import type { SendResult } from "./sms";

/**
 * Resend email provider. REST-only, no SDK dep.
 *
 * Env:
 *   RESEND_API_KEY
 *   RESEND_FROM          ("Surplus Funds <notify@domain>")
 */
export interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
}

const RESEND_URL = "https://api.resend.com/emails";

export async function sendEmail(input: SendEmailInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      status: "unconfigured",
      externalId: null,
      providerError: "Resend env vars missing (RESEND_API_KEY/RESEND_FROM)",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.to)) {
    return {
      ok: false,
      status: "invalid",
      externalId: null,
      providerError: "invalid destination email",
    };
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.body,
      }),
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
        externalId: json.id ?? null,
        providerError: json.message ?? `Resend HTTP ${res.status}`,
      };
    }
    return {
      ok: true,
      status: "sent",
      externalId: json.id ?? null,
      providerError: null,
    };
  } catch (e) {
    return {
      ok: false,
      status: "failed",
      externalId: null,
      providerError: e instanceof Error ? e.message : "Resend fetch failed",
    };
  }
}
