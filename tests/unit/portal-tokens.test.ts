import { describe, it, expect, beforeEach, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    claim: { findUnique: vi.fn() },
    portalToken: {
      updateMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    agreement: { update: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  issuePortalToken,
  resolvePortalToken,
  portalSignAgreement,
} from "@/modules/portal/server/tokens";

const claimShape = { userId: "owner-1", assigneeId: "assignee-1", claimantId: "c-1" };

describe("issuePortalToken", () => {
  beforeEach(() => {
    Object.values(prismaMock).forEach((m: Record<string, unknown>) =>
      Object.values(m).forEach((fn) => (fn as { mockReset: () => void }).mockReset()),
    );
    prismaMock.portalToken.updateMany.mockResolvedValue({ count: 0 });
    prismaMock.portalToken.create.mockResolvedValue({ id: "t" });
    prismaMock.portalToken.update.mockResolvedValue({ id: "t" });
    process.env.NEXTAUTH_URL = "https://example.test";
  });

  it("returns notFound when claim missing", async () => {
    prismaMock.claim.findUnique.mockResolvedValueOnce(null);
    const result = await issuePortalToken("missing", { userId: "u", role: "user" });
    expect(result).toEqual({ notFound: true });
  });

  it("returns forbidden for an outsider", async () => {
    prismaMock.claim.findUnique.mockResolvedValueOnce({
      id: "c",
      ...claimShape,
    });
    const result = await issuePortalToken("c", { userId: "nobody", role: "user" });
    expect(result).toEqual({ forbidden: true });
  });

  it("revokes prior live tokens and mints a new one for the owner", async () => {
    prismaMock.claim.findUnique.mockResolvedValueOnce({ id: "c", ...claimShape });
    const result = await issuePortalToken(
      "c",
      { userId: "owner-1", role: "user" },
      { ttlDays: 30 },
    );
    expect(prismaMock.portalToken.updateMany).toHaveBeenCalledOnce();
    expect(prismaMock.portalToken.create).toHaveBeenCalledOnce();
    if (!("token" in result)) throw new Error("expected token");
    expect(result.url).toBe(`https://example.test/portal/${result.token}`);
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});

describe("resolvePortalToken", () => {
  beforeEach(() => {
    prismaMock.portalToken.findUnique.mockReset();
    prismaMock.portalToken.update.mockReset();
    prismaMock.claim.findUnique.mockReset();
  });

  it("rejects short / missing tokens", async () => {
    expect(await resolvePortalToken("")).toBeNull();
    expect(await resolvePortalToken("tiny")).toBeNull();
  });

  it("rejects revoked tokens", async () => {
    prismaMock.portalToken.findUnique.mockResolvedValueOnce({
      id: "t",
      claimId: "c",
      expiresAt: new Date(Date.now() + 10_000),
      revokedAt: new Date(),
    });
    const result = await resolvePortalToken("x".repeat(20));
    expect(result).toBeNull();
  });

  it("rejects expired tokens", async () => {
    prismaMock.portalToken.findUnique.mockResolvedValueOnce({
      id: "t",
      claimId: "c",
      expiresAt: new Date(Date.now() - 1_000),
      revokedAt: null,
    });
    const result = await resolvePortalToken("x".repeat(20));
    expect(result).toBeNull();
  });

  it("returns the claim payload on a valid token", async () => {
    prismaMock.portalToken.findUnique.mockResolvedValueOnce({
      id: "t",
      claimId: "c",
      expiresAt: new Date(Date.now() + 10_000),
      revokedAt: null,
    });
    prismaMock.claim.findUnique.mockResolvedValueOnce({
      id: "c",
      agreements: [],
      claimant: null,
    });
    prismaMock.portalToken.update.mockResolvedValueOnce({ id: "t" });
    const result = await resolvePortalToken("x".repeat(20));
    expect(result?.claim.id).toBe("c");
    expect(result?.tokenRow.claimId).toBe("c");
  });
});

describe("portalSignAgreement", () => {
  beforeEach(() => {
    prismaMock.portalToken.findUnique.mockReset();
    prismaMock.claim.findUnique.mockReset();
    prismaMock.agreement.update.mockReset();
    prismaMock.portalToken.update.mockResolvedValue({ id: "t" });
  });

  it("rejects a blank typed name", async () => {
    const result = await portalSignAgreement("x".repeat(20), "ag-1", " ");
    expect(result).toEqual({ badState: true, reason: "typed name is required" });
  });

  it("returns notFound when agreement isn't on the token's claim", async () => {
    prismaMock.portalToken.findUnique.mockResolvedValueOnce({
      id: "t",
      claimId: "c",
      expiresAt: new Date(Date.now() + 10_000),
      revokedAt: null,
    });
    prismaMock.claim.findUnique.mockResolvedValueOnce({
      id: "c",
      agreements: [{ id: "different", status: "SENT" }],
      claimant: null,
    });
    const result = await portalSignAgreement("x".repeat(20), "ag-1", "Jane Doe");
    expect(result).toEqual({ notFound: true });
  });

  it("signs a SENT agreement", async () => {
    prismaMock.portalToken.findUnique.mockResolvedValueOnce({
      id: "t",
      claimId: "c",
      expiresAt: new Date(Date.now() + 10_000),
      revokedAt: null,
    });
    prismaMock.claim.findUnique.mockResolvedValueOnce({
      id: "c",
      agreements: [{ id: "ag-1", status: "SENT", renderedText: "Terms..." }],
      claimant: null,
    });
    prismaMock.agreement.update.mockResolvedValueOnce({ id: "ag-1" });

    const result = await portalSignAgreement("x".repeat(20), "ag-1", "Jane Doe");
    if (!("signedAt" in result)) throw new Error("expected signed");
    expect(result.agreementId).toBe("ag-1");
    expect(prismaMock.agreement.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "ag-1" },
        data: expect.objectContaining({ status: "SIGNED" }),
      }),
    );
  });

  it("refuses to sign an already-signed agreement", async () => {
    prismaMock.portalToken.findUnique.mockResolvedValueOnce({
      id: "t",
      claimId: "c",
      expiresAt: new Date(Date.now() + 10_000),
      revokedAt: null,
    });
    prismaMock.claim.findUnique.mockResolvedValueOnce({
      id: "c",
      agreements: [{ id: "ag-1", status: "SIGNED" }],
      claimant: null,
    });
    const result = await portalSignAgreement("x".repeat(20), "ag-1", "Jane Doe");
    expect(result).toEqual({ badState: true, reason: "already signed" });
    expect(prismaMock.agreement.update).not.toHaveBeenCalled();
  });
});
