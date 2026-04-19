/**
 * Twilio SMS provider. REST-only, no SDK dep.
 *
 * Env:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_FROM         (E.164)
 *
 * If any are missing we short-circuit with status="unconfigured" so the
 * ContactLog row still captures the attempt + reason.
 */
export interface SendResult {
  ok: boolean;
  /** Machine-readable status stamped onto ContactLog.status. */
  status:
    | "sent"
    | "queued"
    | "delivered"
    | "failed"
    | "unconfigured"
    | "invalid";
  /** Provider-issued ID, if any (sms SID, email id). Stamped onto externalId. */
  externalId: string | null;
  /** Surfaced back to the UI; kept short. */
  providerError: string | null;
}

export interface SendSmsInput {
  to: string;
  body: string;
}

const TWILIO_URL = (sid: string) =>
  `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;

export async function sendSms(input: SendSmsInput): Promise<SendResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!sid || !token || !from) {
    return {
      ok: false,
      status: "unconfigured",
      externalId: null,
      providerError: "Twilio env vars missing (TWILIO_ACCOUNT_SID/AUTH_TOKEN/FROM)",
    };
  }
  if (!/^\+?\d{7,15}$/.test(input.to.replace(/[^\d+]/g, ""))) {
    return {
      ok: false,
      status: "invalid",
      externalId: null,
      providerError: "invalid destination phone",
    };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const body = new URLSearchParams({
    To: input.to,
    From: from,
    Body: input.body,
  });

  try {
    const res = await fetch(TWILIO_URL(sid), {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const json = (await res.json().catch(() => ({}))) as {
      sid?: string;
      status?: string;
      message?: string;
      code?: number;
    };
    if (!res.ok) {
      return {
        ok: false,
        status: "failed",
        externalId: json.sid ?? null,
        providerError:
          json.message ?? `Twilio HTTP ${res.status}`,
      };
    }
    // Twilio returns "queued" | "sending" | "sent" | "delivered" | "failed"
    const status: SendResult["status"] =
      json.status === "sent" || json.status === "delivered"
        ? "sent"
        : json.status === "failed"
          ? "failed"
          : "queued";
    return {
      ok: status !== "failed",
      status,
      externalId: json.sid ?? null,
      providerError: null,
    };
  } catch (e) {
    return {
      ok: false,
      status: "failed",
      externalId: null,
      providerError: e instanceof Error ? e.message : "Twilio fetch failed",
    };
  }
}
