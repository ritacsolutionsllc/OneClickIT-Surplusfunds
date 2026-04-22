import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  readTwilioConfig,
  sendSmsViaTwilio,
  type TwilioConfig,
} from "@/modules/outbound/server/twilio-sms";

const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_FROM_NUMBER;
  delete process.env.TWILIO_TEST_MODE;
}

describe("readTwilioConfig", () => {
  beforeEach(resetEnv);

  it("returns null when any required var is missing", () => {
    expect(readTwilioConfig()).toBeNull();

    process.env.TWILIO_ACCOUNT_SID = "ACxxxx";
    expect(readTwilioConfig()).toBeNull();

    process.env.TWILIO_AUTH_TOKEN = "tok";
    expect(readTwilioConfig()).toBeNull();
  });

  it("returns a config when all three vars are present", () => {
    process.env.TWILIO_ACCOUNT_SID = "AClive";
    process.env.TWILIO_AUTH_TOKEN = "tok";
    process.env.TWILIO_FROM_NUMBER = "+15551230000";
    const cfg = readTwilioConfig();
    expect(cfg).toMatchObject({
      accountSid: "AClive",
      authToken: "tok",
      fromNumber: "+15551230000",
      testMode: false,
    });
  });

  it("flags test mode when the SID looks like a test SID", () => {
    process.env.TWILIO_ACCOUNT_SID = "ACtest123";
    process.env.TWILIO_AUTH_TOKEN = "tok";
    process.env.TWILIO_FROM_NUMBER = "+15005550006";
    expect(readTwilioConfig()?.testMode).toBe(true);
  });

  it("flags test mode when TWILIO_TEST_MODE=true", () => {
    process.env.TWILIO_ACCOUNT_SID = "AClive";
    process.env.TWILIO_AUTH_TOKEN = "tok";
    process.env.TWILIO_FROM_NUMBER = "+15551230000";
    process.env.TWILIO_TEST_MODE = "true";
    expect(readTwilioConfig()?.testMode).toBe(true);
  });
});

const cfg: TwilioConfig = {
  accountSid: "ACxxxx",
  authToken: "tok",
  fromNumber: "+15551230000",
  testMode: false,
};

describe("sendSmsViaTwilio", () => {
  it("POSTs form-encoded credentials to the Twilio endpoint", async () => {
    const fetchMock: typeof fetch = vi.fn(async (input, init) => {
      expect(String(input)).toBe(
        `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}/Messages.json`,
      );
      expect(init?.method).toBe("POST");
      const headers = (init?.headers ?? {}) as Record<string, string>;
      expect(headers.Authorization).toBe(
        "Basic " + Buffer.from(`${cfg.accountSid}:${cfg.authToken}`).toString("base64"),
      );
      expect(headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
      const body = String(init?.body);
      expect(body).toContain("To=%2B15550001234");
      expect(body).toContain("From=%2B15551230000");
      expect(body).toContain("Body=hello");
      return new Response(
        JSON.stringify({ sid: "SM123", status: "queued", to: "+15550001234" }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    });
    const res = await sendSmsViaTwilio(cfg, "+15550001234", "hello", fetchMock);
    expect(res).toEqual({
      ok: true,
      sid: "SM123",
      status: "queued",
      to: "+15550001234",
    });
    expect(vi.mocked(fetchMock)).toHaveBeenCalledOnce();
  });

  it("returns an error with the Twilio code when the API rejects", async () => {
    const fetchMock: typeof fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            code: 21211,
            message: "The 'To' number is not a valid phone number.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        ),
    );
    const res = await sendSmsViaTwilio(cfg, "+1nope", "hi", fetchMock);
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error("unreachable");
    expect(res.code).toBe(21211);
    expect(res.httpStatus).toBe(400);
    expect(res.error).toContain("not a valid phone number");
  });

  it("returns a network-level error with httpStatus=0 when fetch throws", async () => {
    const fetchMock: typeof fetch = vi.fn(async () => {
      throw new Error("DNS broke");
    });
    const res = await sendSmsViaTwilio(cfg, "+15550001234", "hi", fetchMock);
    expect(res).toEqual({ ok: false, error: "DNS broke", httpStatus: 0 });
  });

  it("treats a missing sid in the response as a failure", async () => {
    const fetchMock: typeof fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ status: "queued" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    const res = await sendSmsViaTwilio(cfg, "+15550001234", "hi", fetchMock);
    expect(res.ok).toBe(false);
  });
});
