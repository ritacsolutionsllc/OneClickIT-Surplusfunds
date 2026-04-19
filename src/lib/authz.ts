import { prisma } from "@/lib/prisma";

/**
 * Canonical actor + case access helpers.
 *
 * Every service module previously redeclared its own `ActorContext` and
 * reinvented the owner/assignee/admin gate. Collecting them here gives us
 * one place to evolve access policy (e.g. adding org/team scopes).
 */

export interface ActorContext {
  userId: string;
  role: string;
}

/** Shape of a Claim row's access-relevant columns. */
export interface ClaimAccessShape {
  userId: string | null;
  assigneeId: string | null;
}

/**
 * Pure predicate: may this actor act on a claim with these owner/assignee ids?
 * Admins always yes; owners and assignees yes.
 */
export function canActOnClaimShape(
  claim: ClaimAccessShape,
  actor: ActorContext,
): boolean {
  if (actor.role === "admin") return true;
  if (claim.userId && claim.userId === actor.userId) return true;
  if (claim.assigneeId && claim.assigneeId === actor.userId) return true;
  return false;
}

export type ClaimGate =
  | {
      ok: true;
      claimantId: string | null;
      assigneeId: string | null;
      ownerId: string | null;
    }
  | { ok: false; reason: "notFound" | "forbidden" };

/**
 * DB-backed gate: fetch a claim and check access in one go.
 * Used by log-contact and other per-case mutators.
 */
export async function canActOnClaim(
  claimId: string,
  actor: ActorContext,
): Promise<ClaimGate> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: { userId: true, assigneeId: true, claimantId: true },
  });
  if (!claim) return { ok: false, reason: "notFound" };
  if (!canActOnClaimShape(claim, actor)) {
    return { ok: false, reason: "forbidden" };
  }
  return {
    ok: true,
    claimantId: claim.claimantId,
    assigneeId: claim.assigneeId,
    ownerId: claim.userId,
  };
}

/**
 * Prisma `ClaimWhereInput` fragment for list queries:
 *   admin  -> {}                               (sees everything)
 *   other  -> { OR: [owner, assignee] }        (sees only their cases)
 */
export function claimVisibility(actor: ActorContext): {
  OR?: Array<{ userId?: string; assigneeId?: string }>;
} {
  if (actor.role === "admin") return {};
  return {
    OR: [{ userId: actor.userId }, { assigneeId: actor.userId }],
  };
}
