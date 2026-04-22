import { prisma } from "@/lib/prisma";
import type { ContactChannel } from "@prisma/client";

import { isFailedContactStatus } from "../follow-up";
import { seedContactFollowUpTask } from "@/modules/tasks/server/autogen";
import type { SendContactInput } from "../schemas";
import {
  sendEmail,
  sendSms,
  type ProviderSendResult,
} from "./providers";

export interface ActorContext {
  userId: string;
  role: string;
}

/**
 * End-to-end "send + log" pipeline for an outbound SMS or email.
 *
 * Contract:
 *  - Always attempts to persist a ContactLog row. A provider failure still
 *    produces a log with status="failed"; the log is the audit record and
 *    must land whenever we reach the provider.
 *  - A missing claimant or missing destination address short-circuits before
 *    we call the provider — no log row is written in that case, because
 *    nothing was attempted.
 *  - Failed outbound attempts seed a follow-up task, same as manual quick-logs.
 */

type CaseGate =
  | { ok: true; claimantId: string | null; assigneeId: string | null; userId: string | null; claimantEmail: string | null; claimantPhone: string | null }
  | { ok: false; reason: "notFound" | "forbidden" };

async function loadCaseForSend(
  claimId: string,
  actor: ActorContext,
): Promise<CaseGate> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: {
      userId: true,
      assigneeId: true,
      claimantId: true,
      claimant: {
        select: {
          email: true,
          phone: true,
          altPhone: true,
        },
      },
    },
  });
  if (!claim) return { ok: false, reason: "notFound" };
  if (
    actor.role !== "admin" &&
    claim.userId !== actor.userId &&
    claim.assigneeId !== actor.userId
  ) {
    return { ok: false, reason: "forbidden" };
  }
  return {
    ok: true,
    claimantId: claim.claimantId,
    assigneeId: claim.assigneeId,
    userId: claim.userId,
    claimantEmail: claim.claimant?.email ?? null,
    claimantPhone: claim.claimant?.phone ?? claim.claimant?.altPhone ?? null,
  };
}

export type SendContactResult =
  | { notFound: true }
  | { forbidden: true }
  | { missingRecipient: true; channel: "SMS" | "EMAIL" }
  | {
      ok: boolean;
      provider: ProviderSendResult["provider"];
      status: string;
      externalId: string | null;
      error: string | null;
      contactLog: Awaited<ReturnType<typeof prisma.contactLog.create>> | null;
      contactLogError: string | null;
      followUpTaskCreated: boolean;
    };

/**
 * Validate and resolve the destination address. Explicit `to` in the input
 * wins; otherwise fall back to the claimant's phone/email on file.
 */
function resolveRecipient(
  channel: "SMS" | "EMAIL",
  input: SendContactInput,
  gate: Extract<CaseGate, { ok: true }>,
): string | null {
  const override = input.to?.trim();
  if (override) return override;
  return channel === "SMS" ? gate.claimantPhone : gate.claimantEmail;
}

export async function sendAndLogContact(
  claimId: string,
  input: SendContactInput,
  actor: ActorContext,
): Promise<SendContactResult> {
  const gate = await loadCaseForSend(claimId, actor);
  if (!gate.ok) {
    return gate.reason === "notFound" ? { notFound: true } : { forbidden: true };
  }

  const recipient = resolveRecipient(input.channel, input, gate);
  if (!recipient) {
    return { missingRecipient: true, channel: input.channel };
  }

  const providerResult: ProviderSendResult =
    input.channel === "SMS"
      ? await sendSms({ to: recipient, body: input.body })
      : await sendEmail({
          to: recipient,
          subject: input.subject ?? "",
          body: input.body,
        });

  // Always attempt to persist the audit row, even on provider failure.
  // If the DB write itself fails we return the provider result so the caller
  // can decide to retry — we do NOT swallow it silently.
  const channelEnum: ContactChannel = input.channel;
  const notePrefix = input.channel === "EMAIL" && input.subject
    ? `Subject: ${input.subject}\n\n`
    : "";
  const baseNotes = `${notePrefix}${input.body}`.slice(0, 1900);
  const failureSuffix = providerResult.error
    ? `\n\n[provider error] ${providerResult.error}`
    : "";

  let contactLog: Awaited<ReturnType<typeof prisma.contactLog.create>> | null = null;
  let contactLogError: string | null = null;
  try {
    contactLog = await prisma.contactLog.create({
      data: {
        claimId,
        userId: actor.userId,
        claimantId: gate.claimantId,
        channel: channelEnum,
        direction: "outbound",
        status: providerResult.status,
        notes: `${baseNotes}${failureSuffix}`.slice(0, 2000),
        externalId: providerResult.externalId,
      },
    });
  } catch (e) {
    contactLogError =
      e instanceof Error ? e.message : "contact-log write failed";
    console.error(
      "[send-contact] ContactLog write failed after provider call",
      { claimId, provider: providerResult.provider, error: contactLogError },
    );
  }

  // Seed follow-up task when the attempt didn't land, mirroring the quick-log
  // flow. Only attempt when the log wrote successfully so we can key off its id.
  let followUpTaskCreated = false;
  if (contactLog && isFailedContactStatus(providerResult.status)) {
    try {
      followUpTaskCreated = await seedContactFollowUpTask({
        contactLogId: contactLog.id,
        claimId,
        channel: channelEnum,
        assigneeId: gate.assigneeId ?? gate.userId ?? actor.userId,
      });
    } catch (e) {
      console.error("[send-contact] seedContactFollowUpTask failed", contactLog.id, e);
    }
  }

  return {
    ok: providerResult.ok,
    provider: providerResult.provider,
    status: providerResult.status,
    externalId: providerResult.externalId,
    error: providerResult.error,
    contactLog,
    contactLogError,
    followUpTaskCreated,
  };
}
