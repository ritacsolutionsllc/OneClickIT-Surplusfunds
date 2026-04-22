import { prisma } from "@/lib/prisma";

import {
  canActOnClaim,
  logContact,
  type ActorContext,
} from "./log-contact";
import {
  readTwilioConfig,
  sendSmsViaTwilio,
  type TwilioConfig,
  type SendSmsResult,
} from "./twilio-sms";

export type SendSmsForCaseInput = {
  /** Message body. */
  message: string;
  /** Optional explicit recipient phone. Falls back to the claimant's phone. */
  to?: string;
  /** Optional claimant id if the case has multiple claimants in scope. */
  claimantId?: string | null;
};

export type SendSmsForCaseResult =
  | { notFound: true }
  | { forbidden: true }
  | { notConfigured: true }
  | { missingRecipient: true }
  | {
      ok: true;
      sid: string;
      status: string;
      to: string;
      testMode: boolean;
      contactLogId: string;
    }
  | {
      ok: false;
      error: string;
      code?: number;
      httpStatus: number;
      testMode: boolean;
      contactLogId: string;
      followUpTaskCreated: boolean;
    };

type TwilioSender = (
  cfg: TwilioConfig,
  to: string,
  body: string,
) => Promise<SendSmsResult>;

/**
 * Send an SMS through Twilio for a case and log the attempt to ContactLog.
 *
 * On success: writes status="sent" with externalId=<Twilio SID>.
 * On failure: writes status="failed" with the Twilio error in notes, which
 * trips the existing failure classifier and auto-schedules a follow-up task.
 *
 * The log row is always written when we actually contacted Twilio — even if
 * Twilio rejected the request — so operators have an audit trail.
 */
export async function sendSmsForCase(
  claimId: string,
  input: SendSmsForCaseInput,
  actor: ActorContext,
  sender: TwilioSender = sendSmsViaTwilio,
): Promise<SendSmsForCaseResult> {
  const message = input.message?.trim();
  if (!message) return { missingRecipient: true }; // caller should validate earlier; defensive

  const cfg = readTwilioConfig();
  if (!cfg) return { notConfigured: true };

  const gate = await canActOnClaim(claimId, actor);
  if (!gate.ok) {
    return gate.reason === "notFound" ? { notFound: true } : { forbidden: true };
  }

  const targetClaimantId = input.claimantId ?? gate.claimantId;
  let to = input.to?.trim();
  if (!to && targetClaimantId) {
    const claimant = await prisma.claimant.findUnique({
      where: { id: targetClaimantId },
      select: { phone: true, altPhone: true },
    });
    to = claimant?.phone?.trim() || claimant?.altPhone?.trim() || undefined;
  }
  if (!to) return { missingRecipient: true };

  const result = await sender(cfg, to, message);

  if (result.ok) {
    const log = await logContact(
      claimId,
      {
        channel: "SMS",
        direction: "outbound",
        status: "sent",
        notes: message,
        externalId: result.sid,
        claimantId: targetClaimantId ?? null,
      },
      actor,
    );
    // gate passed above, so notFound/forbidden shouldn't happen here; if they
    // somehow do, fall through with a generic error.
    if ("notFound" in log || "forbidden" in log) {
      return {
        ok: false,
        error: "contact log write failed after successful send",
        httpStatus: 500,
        testMode: cfg.testMode,
        contactLogId: "",
        followUpTaskCreated: false,
      };
    }
    return {
      ok: true,
      sid: result.sid,
      status: result.status,
      to: result.to,
      testMode: cfg.testMode,
      contactLogId: log.contactLog.id,
    };
  }

  // Failure path: still log so operators see it in the timeline and the
  // follow-up-task automation fires.
  const errorLine = result.code
    ? `Twilio error ${result.code}: ${result.error}`
    : `Twilio error: ${result.error}`;
  const log = await logContact(
    claimId,
    {
      channel: "SMS",
      direction: "outbound",
      status: "failed",
      notes: `${message}\n\n--\n${errorLine}`,
      claimantId: targetClaimantId ?? null,
    },
    actor,
  );
  if ("notFound" in log || "forbidden" in log) {
    return {
      ok: false,
      error: result.error,
      code: result.code,
      httpStatus: result.httpStatus,
      testMode: cfg.testMode,
      contactLogId: "",
      followUpTaskCreated: false,
    };
  }
  return {
    ok: false,
    error: result.error,
    code: result.code,
    httpStatus: result.httpStatus,
    testMode: cfg.testMode,
    contactLogId: log.contactLog.id,
    followUpTaskCreated: log.followUpTaskCreated,
  };
}
