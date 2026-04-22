/**
 * Minimal Twilio REST client (SMS only). We intentionally do NOT pull the
 * `twilio` npm package to keep the dep graph small — Twilio's HTTP API is
 * simple enough that a single fetch call is clearer than an SDK wrapper.
 *
 * Docs: https://www.twilio.com/docs/messaging/api/message-resource#create-a-message-resource
 */

export type TwilioConfig = {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  testMode: boolean;
};

export type SendSmsOk = {
  ok: true;
  sid: string;
  status: string;
  to: string;
};

export type SendSmsErr = {
  ok: false;
  error: string;
  /** Twilio error code if available, e.g. 21211 for invalid phone. */
  code?: number;
  /** HTTP status, or 0 for network-level failures. */
  httpStatus: number;
};

export type SendSmsResult = SendSmsOk | SendSmsErr;

export function readTwilioConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !fromNumber) return null;
  return {
    accountSid,
    authToken,
    fromNumber,
    testMode: process.env.TWILIO_TEST_MODE === 'true' || accountSid.startsWith('ACtest'),
  };
}

export async function sendSmsViaTwilio(
  cfg: TwilioConfig,
  to: string,
  body: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SendSmsResult> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}/Messages.json`;
  const auth = Buffer.from(`${cfg.accountSid}:${cfg.authToken}`).toString('base64');

  const form = new URLSearchParams();
  form.set('To', to);
  form.set('From', cfg.fromNumber);
  form.set('Body', body);

  let res: Response;
  try {
    res = await fetchImpl(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'network error calling Twilio',
      httpStatus: 0,
    };
  }

  const json = (await res.json().catch(() => ({}))) as {
    sid?: string;
    status?: string;
    to?: string;
    message?: string;
    code?: number;
  };

  if (!res.ok || !json.sid) {
    return {
      ok: false,
      error: json.message ?? `Twilio request failed (HTTP ${res.status})`,
      code: json.code,
      httpStatus: res.status,
    };
  }

  return {
    ok: true,
    sid: json.sid,
    status: json.status ?? 'queued',
    to: json.to ?? to,
  };
}
