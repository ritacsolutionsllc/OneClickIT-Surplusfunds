import * as Sentry from "@sentry/nextjs";

import { prisma } from "@/lib/prisma";
import type { ContactChannel, ContactLog, Prisma, TaskType } from "@prisma/client";

import { sendSms, type SendResult } from "./providers/sms";
import { sendEmail } from "./providers/email";
import type { ActorContext } from "./log-contact";

export type SendChannel = "SMS" | "EMAIL";

export interface SendContactInput {
  channel: SendChannel;
  to: string;
  body: string;
  /** Required for EMAIL, ignored for SMS. */
  subject?: string;
  /** Optional free-form notes stamped alongside the rendered message. */
  notes?: string;
  /** Optional explicit claimant linkage; otherwise falls back to claim.claimantId. */
  claimantId?: string | null;
}

export type SendContactResult =
  | { notFound: true }
  | { forbidden: true }
  | {
      contactLog: ContactLog;
      send: SendResult;
      followUpTaskCreated: boolean;
    };

async function canActOnClaim(
  claimId: string,
  actor: ActorContext,
): Promise<
  | { ok: true; claimantId: string | null; assigneeId: string | null; userId: string | null }
  | { ok: false; reason: "notFound" | "forbidden" }
> {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: { userId: true, assigneeId: true, claimantId: true },
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
  };
}

/**
 * Queue-safe DB insert: if the provider already accepted the message (we have
 * an externalId) we must not lose the log. Retry the insert 3× with exp
 * backoff, then fall back to Sentry with full context so ops can reconcile.
 */
async function writeContactLogWithRetry(
  data: Prisma.ContactLogUncheckedCreateInput,
  externalId: string | null,
): Promise<ContactLog | null> {
  const attempts = externalId ? 3 : 1;
  let lastErr: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await prisma.contactLog.create({ data });
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 150 * 2 ** i));
      }
    }
  }
  // Provider accepted the send but we cannot persist the log — that's an
  // audit hole. Escalate with every field ops might need to reconcile.
  Sentry.captureException(lastErr, {
    level: "error",
    tags: { area: "outbound", kind: "contact_log_persist_failed" },
    extra: {
      externalId,
      claimId: data.claimId,
      channel: data.channel,
      direction: data.direction,
      status: data.status,
    },
  });
  console.error(
    "[outbound] contact log persist failed; externalId=%s err=",
    externalId,
    lastErr,
  );
  return null;
}

/**
 * Create a FOLLOW_UP task nudging the operator to retry a failed send. Marker
 * keys off the ContactLog.id so repeat failures produce separate tasks.
 */
async function seedSendRetryFollowUp(
  claimId: string,
  contactLogId: string,
  assigneeId: string | null,
  channel: SendChannel,
): Promise<boolean> {
  const marker = `[send-retry:${contactLogId}]`;
  const existing = await prisma.task.findFirst({
    where: { claimId, notes: { contains: marker } },
    select: { id: true },
  });
  if (existing) return false;

  const due = new Date();
  due.setUTCDate(due.getUTCDate() + 1);

  await prisma.task.create({
    data: {
      claimId,
      assigneeId,
      type: "FOLLOW_UP" as TaskType,
      title: `Retry ${channel === "SMS" ? "SMS" : "email"} — previous attempt failed`,
      dueDate: due,
      priority: "high",
      notes: `Outbound ${channel} send failed. Investigate and retry.\n${marker}`,
    },
  });
  return true;
}

function buildLogNotes(input: SendContactInput, send: SendResult): string {
  const parts: string[] = [];
  parts.push(`To: ${input.to}`);
  if (input.channel === "EMAIL" && input.subject) {
    parts.push(`Subject: ${input.subject}`);
  }
  if (input.body) {
    parts.push("");
    parts.push(input.body);
  }
  if (!send.ok && send.providerError) {
    parts.push("");
    parts.push(`[provider error] ${send.providerError}`);
  }
  if (input.notes) {
    parts.push("");
    parts.push(input.notes);
  }
  return parts.join("\n");
}

/**
 * Send an outbound message via the configured provider and create a
 * ContactLog row reflecting the result — regardless of send success.
 *
 * Guarantees:
 *  - Every call that passes auth produces either a ContactLog row OR a Sentry
 *    event with the externalId (if the provider accepted but the DB write
 *    failed after retries).
 *  - On failure we also seed a FOLLOW_UP task so the operator can retry.
 */
export async function sendAndLogContact(
  claimId: string,
  input: SendContactInput,
  actor: ActorContext,
): Promise<SendContactResult> {
  const gate = await canActOnClaim(claimId, actor);
  if (!gate.ok) {
    return gate.reason === "notFound" ? { notFound: true } : { forbidden: true };
  }

  const send: SendResult =
    input.channel === "SMS"
      ? await sendSms({ to: input.to, body: input.body })
      : await sendEmail({
          to: input.to,
          subject: input.subject ?? "(no subject)",
          body: input.body,
        });

  const channel: ContactChannel =
    input.channel === "SMS" ? ("SMS" as ContactChannel) : ("EMAIL" as ContactChannel);

  const contactLog = await writeContactLogWithRetry(
    {
      claimId,
      userId: actor.userId,
      claimantId: input.claimantId ?? gate.claimantId,
      channel,
      direction: "outbound",
      status: send.status,
      notes: buildLogNotes(input, send),
      externalId: send.externalId,
    },
    send.externalId,
  );

  // If we couldn't persist the log at all, surface it — but keep the send
  // result so the caller can show provider-side errors.
  if (!contactLog) {
    return {
      contactLog: {
        id: "",
        claimantId: input.claimantId ?? gate.claimantId ?? null,
        claimId,
        userId: actor.userId,
        channel,
        direction: "outbound",
        status: send.status,
        notes: buildLogNotes(input, send),
        duration: null,
        externalId: send.externalId,
        createdAt: new Date(),
      } satisfies ContactLog,
      send,
      followUpTaskCreated: false,
    };
  }

  let followUpTaskCreated = false;
  if (!send.ok) {
    try {
      followUpTaskCreated = await seedSendRetryFollowUp(
        claimId,
        contactLog.id,
        gate.assigneeId ?? gate.userId,
        input.channel,
      );
    } catch (e) {
      // Task creation is best-effort — never mask the send/log result.
      console.error("[outbound] follow-up task seed failed", claimId, e);
    }
  }

  return { contactLog, send, followUpTaskCreated };
}
