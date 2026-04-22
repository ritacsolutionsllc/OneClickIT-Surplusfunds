/**
 * Provider adapters for outbound SMS (Twilio) and email (Resend).
 *
 * Kept dependency-free: we hit the REST APIs directly so we don't have to pull
 * in the Twilio or Resend SDKs. The adapters always return a structured
 * {ok, status, externalId, error} tuple that the send-contact service can map
 * 1:1 onto a ContactLog row — success AND failure both become auditable.
 *
 * If credentials aren't configured, the adapter returns a "dry-run" result.
 * That's intentional: local/dev installs can still log an attempt without
 * blowing up, and the operator sees a clear configuration message in the
 * error field instead of a 500.
 */

export interface ProviderSendResult {
  ok: boolean;
  /** Canonical ContactLog status token — matches follow-up classifier tokens. */
  status: string;
  externalId: string | null;
  provider: "twilio" | "resend" | "dry-run";
  error: string | null;
}

const TWILIO_TIMEOUT_MS = 10_000;
const RESEND_TIMEOUT_MS = 10_000;

function timeoutSignal(ms: number): AbortSignal {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms).unref?.();
  return ctrl.signal;
}

/**
 * Map a Twilio Message resource's `status` onto our canonical status tokens.
 * Twilio may return: queued, sending, sent, delivered, failed, undelivered.
 * We preserve the Twilio token as-is when already canonical (sent/delivered/
 * failed); we normalize "undelivered" → "undeliverable" so it lines up with
 * our follow-up classifier.
 */
export function mapTwilioStatus(raw: string | undefined | null): string {
  const s = (raw ?? "").toLowerCase().trim();
  if (!s) return "sent";
  if (s === "undelivered") return "undeliverable";
  // queued/sending/sent/delivered/failed all pass through unchanged
  return s;
}

/**
 * Map a Resend response onto our canonical tokens. Resend's success response
 * only tells us the email was accepted ("sent"). Delivery/bounce state is
 * delivered out-of-band via webhooks, which is out of scope for this call.
 */
export function mapResendStatus(ok: boolean): string {
  return ok ? "sent" : "failed";
}

function twilioCreds() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) return null;
  return { sid, token, from };
}

function resendCreds() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return null;
  return { apiKey, from };
}

export interface SendSmsInput {
  to: string;
  body: string;
}

export async function sendSms(input: SendSmsInput): Promise<ProviderSendResult> {
  const creds = twilioCreds();
  if (!creds) {
    return {
      ok: false,
      status: "failed",
      externalId: null,
      provider: "dry-run",
      error: "TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER not configured",
    };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${creds.sid}/Messages.json`;
  const form = new URLSearchParams({
    To: input.to,
    From: creds.from,
    Body: input.body,
  });
  const auth = Buffer.from(`${creds.sid}:${creds.token}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      signal: timeoutSignal(TWILIO_TIMEOUT_MS),
    });
    const json = (await res.json().catch(() => ({}))) as {
      sid?: string;
      status?: string;
      code?: number;
      message?: string;
    };
    if (!res.ok) {
      return {
        ok: false,
        status: "failed",
        externalId: null,
        provider: "twilio",
        error: json.message ?? `twilio http ${res.status}`,
      };
    }
    return {
      ok: true,
      status: mapTwilioStatus(json.status),
      externalId: json.sid ?? null,
      provider: "twilio",
      error: null,
    };
  } catch (e) {
    return {
      ok: false,
      status: "failed",
      externalId: null,
      provider: "twilio",
      error: e instanceof Error ? e.message : "twilio request failed",
    };
  }
}

export interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(input: SendEmailInput): Promise<ProviderSendResult> {
  const creds = resendCreds();
  if (!creds) {
    return {
      ok: false,
      status: "failed",
      externalId: null,
      provider: "dry-run",
      error: "RESEND_API_KEY / RESEND_FROM_EMAIL not configured",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: creds.from,
        to: [input.to],
        subject: input.subject,
        text: input.body,
      }),
      signal: timeoutSignal(RESEND_TIMEOUT_MS),
    });
    const json = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };
    if (!res.ok) {
      return {
        ok: false,
        status: "failed",
        externalId: null,
        provider: "resend",
        error: json.message ?? `resend http ${res.status}`,
      };
    }
    return {
      ok: true,
      status: mapResendStatus(true),
      externalId: json.id ?? null,
      provider: "resend",
      error: null,
    };
  } catch (e) {
    return {
      ok: false,
      status: "failed",
      externalId: null,
      provider: "resend",
      error: e instanceof Error ? e.message : "resend request failed",
    };
  }
}
