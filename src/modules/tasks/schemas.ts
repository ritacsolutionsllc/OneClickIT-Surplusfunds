import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const TASK_TYPE = z.enum([
  "CALL",
  "EMAIL",
  "SMS",
  "SEND_AGREEMENT",
  "FILE_WITH_COUNTY",
  "FOLLOW_UP",
  "DOCUMENT",
  "RESEARCH",
  "COURT",
  "OTHER",
]);

export const tasksQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    status: z.preprocess(
      emptyToUndefined,
      z.enum(["open", "completed"]).optional(),
    ),
    priority: z.preprocess(
      emptyToUndefined,
      z.enum(["low", "medium", "high"]).optional(),
    ),
    type: z.preprocess(emptyToUndefined, TASK_TYPE.optional()),
    assigneeId: z.preprocess(emptyToUndefined, z.string().cuid().optional()),
    claimId: z.preprocess(emptyToUndefined, z.string().cuid().optional()),
    leadId: z.preprocess(emptyToUndefined, z.string().cuid().optional()),
    q: z.preprocess(emptyToUndefined, z.string().max(200).optional()),
  });

export const createTaskSchema = z
  .object({
    claimId: z.string().cuid().optional().nullable(),
    leadId: z.string().cuid().optional().nullable(),
    assigneeId: z.string().cuid().optional().nullable(),
    type: TASK_TYPE,
    title: z.string().min(1).max(200),
    dueDate: z.string().optional().nullable(),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    notes: z.string().max(2000).optional().nullable(),
  })
  .refine((v) => v.claimId || v.leadId, {
    message: "task must be attached to a claimId or leadId",
    path: ["claimId"],
  });

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
  type: TASK_TYPE.optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type TasksQueryInput = z.infer<typeof tasksQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
