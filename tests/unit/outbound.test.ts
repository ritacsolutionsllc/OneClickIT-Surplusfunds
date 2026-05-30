import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sendContactSchema } from "@/modules/outbound/schemas";

describe("sendContactSchema", () => {
  it("rejects EMAIL without subject", () => {
    const r = sendContactSchema.safeParse({
      channel: "EMAIL",
      to: "x@y.com",
      body: "hello",
    });
    expect(r.success).toBe(false);
  });

  it("accepts SMS without subject", () => {
    const r = sendContactSchema.safeParse({
      channel: "SMS",
      to: "+15551234567",
      body: "hello",
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty body", () => {
    const r = sendContactSchema.safeParse({
      channel: "SMS",
      to: "+15551234567",
      body: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects body > 5000 chars", () => {
    const r = sendContactSchema.safeParse({
      channel: "SMS",
      to: "+15551234567",
      body: "x".repeat(5001),
    });
    expect(r.success).toBe(false);
  });

  it("accepts EMAIL with subject + body", () => {
    const r = sendContactSchema.safeParse({
      channel: "EMAIL",
      to: "x@y.com",
      subject: "hi",
      body: "hello",
    });
    expect(r.success).toBe(true);
  });
});

describe("sendSms", () => {
  const savedEnv = { ...process.env };
  let fetchSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_FROM;
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...savedEnv };
    fetchSpy?.mockRestore();
    fetchSpy = null;
  });

  it("returns unconfigured when env vars missing", async () => {
    const { sendSms } = await import("@/modules/outbound/server/providers/sms");
    const r = await sendSms({ to: "+15551234567", body: "hi" });
    expect(r.ok).toBe(false);
    expect(r.status).toBe("unconfigured");
    expect(r.externalId).toBeNull();
  });

  it("returns invalid for a non-phone destination", async () => {
    process.env.TWILIO_ACCOUNT_SID = "AC123";
    process.env.TWILIO_AUTH_TOKEN = "token";
    process.env.TWILIO_FROM = "+15550000000";
    const { sendSms } = await import("@/modules/outbound/server/providers/sms");
    const r = await sendSms({ to: "not-a-phone", body: "hi" });
    expect(r.status).toBe("invalid");
    expect(r.ok).toBe(false);
  });

  it("maps Twilio 201 response with sid+status=queued to queued", async () => {
    process.env.TWILIO_ACCOUNT_SID = "AC123";
    process.env.TWILIO_AUTH_TOKEN = "token";
    process.env.TWILIO_FROM = "+15550000000";
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ sid: "SM1", status: "queued" }), {
        status: 201,
      }),
    );
    const { sendSms } = await import("@/modules/outbound/server/providers/sms");
    const r = await sendSms({ to: "+15551234567", body: "hi" });
    expect(r.ok).toBe(true);
    expect(r.status).toBe("queued");
    expect(r.externalId).toBe("SM1");
  });

  it("maps Twilio error response to failed with message", async () => {
    process.env.TWILIO_ACCOUNT_SID = "AC123";
    process.env.TWILIO_AUTH_TOKEN = "token";
    process.env.TWILIO_FROM = "+15550000000";
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ message: "unverified number", code: 21608 }),
        { status: 400 },
      ),
    );
    const { sendSms } = await import("@/modules/outbound/server/providers/sms");
    const r = await sendSms({ to: "+15551234567", body: "hi" });
    expect(r.ok).toBe(false);
    expect(r.status).toBe("failed");
    expect(r.providerError).toContain("unverified");
  });
});

describe("sendEmail", () => {
  const savedEnv = { ...process.env };
  let fetchSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM;
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...savedEnv };
    fetchSpy?.mockRestore();
    fetchSpy = null;
  });

  it("returns unconfigured when env vars missing", async () => {
    const { sendEmail } = await import(
      "@/modules/outbound/server/providers/email"
    );
    const r = await sendEmail({ to: "x@y.com", subject: "s", body: "b" });
    expect(r.status).toBe("unconfigured");
  });

  it("returns invalid for malformed destination email", async () => {
    process.env.RESEND_API_KEY = "re_key";
    process.env.RESEND_FROM = "notify@example.com";
    const { sendEmail } = await import(
      "@/modules/outbound/server/providers/email"
    );
    const r = await sendEmail({ to: "not-email", subject: "s", body: "b" });
    expect(r.status).toBe("invalid");
    expect(r.ok).toBe(false);
  });

  it("maps Resend 200 response with id to sent", async () => {
    process.env.RESEND_API_KEY = "re_key";
    process.env.RESEND_FROM = "notify@example.com";
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "abc123" }), { status: 200 }),
    );
    const { sendEmail } = await import(
      "@/modules/outbound/server/providers/email"
    );
    const r = await sendEmail({
      to: "dest@example.com",
      subject: "hi",
      body: "hello",
    });
    expect(r.ok).toBe(true);
    expect(r.status).toBe("sent");
    expect(r.externalId).toBe("abc123");
  });

  it("maps Resend error response to failed", async () => {
    process.env.RESEND_API_KEY = "re_key";
    process.env.RESEND_FROM = "notify@example.com";
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ message: "domain not verified", name: "validation_error" }),
        { status: 422 },
      ),
    );
    const { sendEmail } = await import(
      "@/modules/outbound/server/providers/email"
    );
    const r = await sendEmail({
      to: "dest@example.com",
      subject: "hi",
      body: "hello",
    });
    expect(r.ok).toBe(false);
    expect(r.status).toBe("failed");
    expect(r.providerError).toContain("domain not verified");
  });
});
