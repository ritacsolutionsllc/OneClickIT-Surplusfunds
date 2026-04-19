import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireCronSecret } from "@/lib/api-utils";
import { seedAgreementFollowUpTask } from "@/modules/tasks/server/autogen";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Scheduled sweep over SENT-but-not-SIGNED agreements.
 *
 *  - For any that were sent >= 5 days ago, seed a FOLLOW_UP task on the
 *    parent case (seedAgreementFollowUpTask is idempotent).
 *  - For any that were sent >= 30 days ago, mark them EXPIRED.
 *
 * Gated by CRON_SECRET. Safe to invoke ad hoc for reconciliation.
 */
export async function GET(request: NextRequest) {
  if (!requireCronSecret(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const FOLLOWUP_AFTER_DAYS = 5;
  const EXPIRE_AFTER_DAYS = 30;

  const followupCutoff = new Date(now - FOLLOWUP_AFTER_DAYS * 86_400_000);
  const expireCutoff = new Date(now - EXPIRE_AFTER_DAYS * 86_400_000);

  try {
    const staleSent = await prisma.agreement.findMany({
      where: {
        status: { in: ["SENT", "VIEWED"] },
        signedAt: null,
        sentAt: { lte: followupCutoff, not: null },
      },
      include: {
        claim: { select: { userId: true, assigneeId: true } },
      },
    });

    let seeded = 0;
    let expired = 0;

    for (const ag of staleSent) {
      if (ag.sentAt && ag.sentAt <= expireCutoff) {
        await prisma.agreement.update({
          where: { id: ag.id },
          data: { status: "EXPIRED" },
        });
        expired++;
        continue;
      }
      const created = await seedAgreementFollowUpTask(
        ag.id,
        ag.claimId,
        ag.claim.assigneeId ?? ag.claim.userId ?? null,
      );
      if (created) seeded++;
    }

    return NextResponse.json({
      ok: true,
      scanned: staleSent.length,
      followupsSeeded: seeded,
      expired,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "sweep failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
