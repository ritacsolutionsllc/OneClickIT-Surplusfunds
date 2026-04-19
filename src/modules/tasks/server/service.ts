import { prisma } from "@/lib/prisma";
import type { Prisma, TaskType } from "@prisma/client";
import type {
  CreateTaskInput,
  TasksQueryInput,
  UpdateTaskInput,
} from "../schemas";
import type { ActorContext } from "@/lib/authz";

export type { ActorContext };

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Build a visibility predicate: admins see everything. Everyone else sees
 * tasks they're assigned to OR tasks on a claim they own / are assigned to.
 */
function visibilityScope(actor: ActorContext): Prisma.TaskWhereInput {
  if (actor.role === "admin") return {};
  return {
    OR: [
      { assigneeId: actor.userId },
      { claim: { userId: actor.userId } },
      { claim: { assigneeId: actor.userId } },
    ],
  };
}

function mergeWhere(
  a: Prisma.TaskWhereInput,
  b: Prisma.TaskWhereInput,
): Prisma.TaskWhereInput {
  const aEmpty = !a || Object.keys(a).length === 0;
  const bEmpty = !b || Object.keys(b).length === 0;
  if (aEmpty) return b;
  if (bEmpty) return a;
  return { AND: [a, b] };
}

/** Paginated, filtered listing of tasks within actor's scope. */
export async function listTasks(input: TasksQueryInput, actor: ActorContext) {
  const { page, limit } = input;
  const skip = (page - 1) * limit;

  const filters: Prisma.TaskWhereInput = {
    ...(input.status === "open" ? { completedAt: null } : {}),
    ...(input.status === "completed" ? { completedAt: { not: null } } : {}),
    ...(input.priority ? { priority: input.priority } : {}),
    ...(input.type ? { type: input.type } : {}),
    ...(input.assigneeId ? { assigneeId: input.assigneeId } : {}),
    ...(input.claimId ? { claimId: input.claimId } : {}),
    ...(input.leadId ? { leadId: input.leadId } : {}),
    ...(input.q
      ? {
          OR: [
            { title: { contains: input.q, mode: "insensitive" } },
            { notes: { contains: input.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const where = mergeWhere(visibilityScope(actor), filters);

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        claim: { select: { id: true, ownerName: true, countyName: true, state: true } },
        lead: { select: { id: true, ownerName: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ completedAt: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  return { data: items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

/** Tasks due today (local day boundary computed in UTC for consistency). */
export async function dueToday(actor: ActorContext) {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0),
  );
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return prisma.task.findMany({
    where: mergeWhere(visibilityScope(actor), {
      completedAt: null,
      dueDate: { gte: start, lt: end },
    }),
    include: {
      claim: { select: { id: true, ownerName: true, countyName: true, state: true } },
      lead: { select: { id: true, ownerName: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });
}

/** Tasks past their dueDate and not yet completed. */
export async function overdueTasks(actor: ActorContext) {
  return prisma.task.findMany({
    where: mergeWhere(visibilityScope(actor), {
      completedAt: null,
      dueDate: { lt: new Date() },
    }),
    include: {
      claim: { select: { id: true, ownerName: true, countyName: true, state: true } },
      lead: { select: { id: true, ownerName: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ dueDate: "asc" }],
  });
}

export async function createTask(input: CreateTaskInput, actor: ActorContext) {
  return prisma.task.create({
    data: {
      claimId: input.claimId ?? null,
      leadId: input.leadId ?? null,
      assigneeId: input.assigneeId ?? actor.userId,
      type: input.type as TaskType,
      title: input.title,
      dueDate: parseDate(input.dueDate),
      priority: input.priority,
      notes: input.notes ?? null,
    },
    include: {
      claim: { select: { id: true, ownerName: true, countyName: true, state: true } },
      lead: { select: { id: true, ownerName: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}

export type UpdateTaskResult =
  | { notFound: true }
  | { forbidden: true }
  | { task: Awaited<ReturnType<typeof prisma.task.update>> };

/** Assignee or admin may edit. Task owner (userId of linked claim) too. */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput,
  actor: ActorContext,
): Promise<UpdateTaskResult> {
  const existing = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      claim: { select: { userId: true, assigneeId: true } },
    },
  });
  if (!existing) return { notFound: true };

  const canEdit =
    actor.role === "admin" ||
    existing.assigneeId === actor.userId ||
    existing.claim?.userId === actor.userId ||
    existing.claim?.assigneeId === actor.userId ||
    (!existing.assigneeId && !existing.claim?.userId && !existing.claim?.assigneeId);

  if (!canEdit) return { forbidden: true };

  const data: Prisma.TaskUpdateInput = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.assigneeId !== undefined
      ? input.assigneeId
        ? { assignee: { connect: { id: input.assigneeId } } }
        : { assignee: { disconnect: true } }
      : {}),
    ...(input.type !== undefined ? { type: input.type as TaskType } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.dueDate !== undefined ? { dueDate: parseDate(input.dueDate) } : {}),
    ...(input.completed !== undefined
      ? { completedAt: input.completed ? new Date() : null }
      : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
  };

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      claim: { select: { id: true, ownerName: true, countyName: true, state: true } },
      lead: { select: { id: true, ownerName: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
  return { task };
}

export type DeleteTaskResult =
  | { notFound: true }
  | { forbidden: true }
  | { deleted: true };

export async function deleteTask(
  taskId: string,
  actor: ActorContext,
): Promise<DeleteTaskResult> {
  const existing = await prisma.task.findUnique({
    where: { id: taskId },
    include: { claim: { select: { userId: true, assigneeId: true } } },
  });
  if (!existing) return { notFound: true };

  const canDelete =
    actor.role === "admin" ||
    existing.assigneeId === actor.userId ||
    existing.claim?.userId === actor.userId ||
    existing.claim?.assigneeId === actor.userId;

  if (!canDelete) return { forbidden: true };

  await prisma.task.delete({ where: { id: taskId } });
  return { deleted: true };
}
