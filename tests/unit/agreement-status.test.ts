import { describe, it, expect } from "vitest";

import {
  agreementPortalDisplay,
  summarizePortalAgreements,
  tokenExpiryInfo,
} from "@/modules/agreements/status";

describe("agreementPortalDisplay", () => {
  it("marks SIGNED as a done, non-signable state", () => {
    const d = agreementPortalDisplay({ status: "SIGNED" });
    expect(d.tone).toBe("signed");
    expect(d.canSign).toBe(false);
    expect(d.label).toBe("Signed");
  });

  it("lets the claimant sign SENT and VIEWED", () => {
    for (const status of ["SENT", "VIEWED"] as const) {
      const d = agreementPortalDisplay({ status });
      expect(d.tone).toBe("awaiting");
      expect(d.canSign).toBe(true);
    }
  });

  it("closes out DECLINED and EXPIRED with distinct copy", () => {
    const declined = agreementPortalDisplay({ status: "DECLINED" });
    const expired = agreementPortalDisplay({ status: "EXPIRED" });
    expect(declined.tone).toBe("closed");
    expect(expired.tone).toBe("closed");
    expect(declined.canSign).toBe(false);
    expect(expired.canSign).toBe(false);
    expect(declined.message).not.toBe(expired.message);
  });

  it("hides DRAFT so claimants never see half-baked docs", () => {
    const d = agreementPortalDisplay({ status: "DRAFT" });
    expect(d.tone).toBe("closed");
    expect(d.canSign).toBe(false);
  });
});

describe("summarizePortalAgreements", () => {
  it("empty list -> no agreements shared yet", () => {
    const s = summarizePortalAgreements([]);
    expect(s.total).toBe(0);
    expect(s.allSigned).toBe(false);
    expect(s.progressLabel).toMatch(/no agreements/i);
  });

  it("all signed -> allSigned flag + congratulatory label", () => {
    const s = summarizePortalAgreements([
      { status: "SIGNED" },
      { status: "SIGNED" },
    ]);
    expect(s.signed).toBe(2);
    expect(s.awaiting).toBe(0);
    expect(s.allSigned).toBe(true);
    expect(s.progressLabel).toMatch(/all/i);
  });

  it("mixed -> surfaces awaiting count in the label", () => {
    const s = summarizePortalAgreements([
      { status: "SIGNED" },
      { status: "SENT" },
      { status: "VIEWED" },
    ]);
    expect(s.signed).toBe(1);
    expect(s.awaiting).toBe(2);
    expect(s.allSigned).toBe(false);
    expect(s.progressLabel).toContain("1 of 3 signed");
    expect(s.progressLabel).toContain("2 awaiting");
  });

  it("ignores DRAFT/EXPIRED/DECLINED in awaiting count", () => {
    const s = summarizePortalAgreements([
      { status: "SIGNED" },
      { status: "EXPIRED" },
      { status: "DECLINED" },
      { status: "DRAFT" },
    ]);
    expect(s.signed).toBe(1);
    expect(s.awaiting).toBe(0);
    expect(s.closed).toBe(3);
    expect(s.allSigned).toBe(false);
  });
});

describe("tokenExpiryInfo", () => {
  const now = new Date("2025-01-15T12:00:00Z");

  it("reports expired once the expiry has passed", () => {
    const info = tokenExpiryInfo(new Date("2025-01-15T11:59:59Z"), now);
    expect(info.level).toBe("expired");
    expect(info.daysLeft).toBe(0);
  });

  it("critical under 24h", () => {
    const info = tokenExpiryInfo(new Date("2025-01-15T23:00:00Z"), now);
    expect(info.level).toBe("critical");
    expect(info.daysLeft).toBe(1);
  });

  it("soon at 7 days or fewer", () => {
    const info = tokenExpiryInfo(new Date("2025-01-20T12:00:00Z"), now);
    expect(info.level).toBe("soon");
    expect(info.daysLeft).toBe(5);
    expect(info.label).toMatch(/5 days/);
  });

  it("ok beyond 7 days", () => {
    const info = tokenExpiryInfo(new Date("2025-02-15T12:00:00Z"), now);
    expect(info.level).toBe("ok");
    expect(info.daysLeft).toBeGreaterThan(7);
  });
});
