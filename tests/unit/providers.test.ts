import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import {
  mapResendStatus,
  mapTwilioStatus,
  sendEmail,
  sendSms,
} from "@/modules/outbound/server/providers";
import {
  isFailedContactStatus,
} from "@/modules/outbound/follow-up";
import { sendContactSchema } from "@/modules/outbound/schemas";

describe("mapTwilioStatus", () => {
  it("passes canonical tokens through unchanged", () => {
    expect(mapTwilioStatus("sent")).toBe("sent");
    expect(mapTwilioStatus("delivered")).toBe("delivered");
    expect(mapTwilioStatus("failed")).toBe("failed");
    expect(mapTwilioStatus("queued")).toBe("queued");
  });

  it("normalizes 'undelivered' → 'undeliverable'", () => {
    expect(mapTwilioStatus("undelivered")).toBe("undeliverable");
    expect(mapTwilioStatus("UNDELIVERED")).toBe("undeliverable");
  });

  it("trims and lowercases", () => {
    expect(mapTwilioStatus("  Delivered  ")).toBe("delivered");
  });

  it("falls back to 'sent' on empty / null", () => {
    expect(mapTwilioStatus(undefined)).toBe("sent");
    expect(mapTwilioStatus(null)).toBe("sent");
    expect(mapTwilioStatus("")).toBe("sent");
  });

  it("produces tokens the follow-up classifier understands as failures", () => {
    expect(isFailedContactStatus(mapTwilioStatus("failed"))).toBe(true);
    expect(isFailedContactStatus(mapTwilioStatus("undelivered"))).toBe(true);
    expect(isFailedContactStatus(mapTwilioStatus("delivered"))).toBe(false);
    expect(isFailedContactStatus(mapTwilioStatus("sent"))).toBe(false);
  });
});

describe("mapResendStatus", () => {
  it("maps ok → 'sent' and error → 'failed'", () => {
    expect(mapResendStatus(true)).toBe("sent");
    expect(mapResendStatus(false)).toBe("failed");
  });

  it("'failed' tokens trigger follow-up, 'sent' does not", () => {
    expect(isFailedContactStatus(mapResendStatus(false))).toBe(true);
    expect(isFailedContactStatus(mapResendStatus(true))).toBe(false);
  });
});

describe("sendContactSchema", () => {
  it("requires subject for email", () => {
    const bad = sendContactSchema.safeParse({
      channel: "EMAIL",
      body: "hello",
    });
    expect(bad.success).toBe(false);
  });

  it("accepts SMS without subject", () => {
    const ok = sendContactSchema.safeParse({
      channel: "SMS",
      body: "hello",
    });
    expect(ok.success).toBe(true);
  });

  it("rejects empty body", () => {
    const r = sendContactSchema.safeParse({ channel: "SMS", body: "" });
    expect(r.success).toBe(false);
  });

  it("caps body length at 1900", () => {
    const r = sendContactSchema.safeParse({
      channel: "SMS",
      body: "x".repeat(2000),
    });
    expect(r.success).toBe(false);
  });

  it("empty 'to' collapses to undefined so service falls back to claimant", () => {
    const r = sendContactSchema.parse({
      channel: "SMS",
      to: "   ",
      body: "hi",
    });
    expect(r.to).toBeUndefined();
  });
});

describe("provider adapters with no credentials", () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    // Strip every provider-relevant var so the adapter falls into dry-run.
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_FROM_NUMBER;
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
  });
  // Restore after suite so later tests aren't affected.
  afterAll(() => {
    process.env = originalEnv;
  });

  it("sendSms returns dry-run with a configuration error, no network call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await sendSms({ to: "+15551234567", body: "hi" });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.provider).toBe("dry-run");
    expect(result.status).toBe("failed");
    expect(result.error).toMatch(/TWILIO/);
    fetchSpy.mockRestore();
  });

  it("sendEmail returns dry-run with a configuration error, no network call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await sendEmail({
      to: "ok@example.com",
      subject: "s",
      body: "b",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.provider).toBe("dry-run");
    expect(result.error).toMatch(/RESEND/);
    fetchSpy.mockRestore();
  });
});

