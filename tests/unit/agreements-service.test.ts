import { describe, it, expect, beforeEach, vi } from "vitest";

const { prismaMock, seedMock, renderMock, esignMock } = vi.hoisted(() => ({
  prismaMock: {
    claim: { findUnique: vi.fn() },
    agreement: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    task: { findFirst: vi.fn(), create: vi.fn() },
  },
  seedMock: vi.fn(),
  renderMock: vi.fn(),
  esignMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/modules/tasks/server/autogen", () => ({
  seedAgreementFollowUpTask: seedMock,
}));
vi.mock("@/modules/agreements/server/render", () => ({
  renderAgreement: renderMock,
}));
vi.mock("@/modules/agreements/server/esign", () => ({
  sendForSignature: esignMock,
}));

import {
  createAgreement,
  sendAgreement,
  markSigned,
} from "@/modules/agreements/server/service";

const actor = { userId: "owner-1", role: "user", name: "Jane Agent" };

describe("createAgreement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns notFound when claim missing", async () => {
    prismaMock.claim.findUnique.mockResolvedValueOnce(null);
    const result = await createAgreement(
      { claimId: "c", type: "ENGAGEMENT" },
      actor,
    );
    expect(result).toEqual({ notFound: true });
  });

  it("returns forbidden for non-owner/assignee/admin", async () => {
    prismaMock.claim.findUnique.mockResolvedValueOnce({
      id: "c",
      userId: "someone",
      assigneeId: "someone-else",
      claimantId: null,
      feePercent: null,
    });
    const result = await createAgreement(
      { claimId: "c", type: "ENGAGEMENT" },
      { userId: "outsider", role: "user", name: "Out Sider" },
    );
    expect(result).toEqual({ forbidden: true });
  });

  it("renders and persists a DRAFT agreement with the chosen fee", async () => {
    prismaMock.claim.findUnique.mockResolvedValueOnce({
      id: "c",
      userId: "owner-1",
      assigneeId: null,
      claimantId: "cl-1",
      feePercent: 25,
    });
    renderMock.mockResolvedValueOnce({ text: "Terms..." });
    prismaMock.agreement.create.mockResolvedValueOnce({
      id: "ag-1",
      status: "DRAFT",
    });

    const result = await createAgreement(
      { claimId: "c", type: "ENGAGEMENT", feePercent: 40 },
      actor,
    );
    expect("agreement" in result && result.agreement.id).toBe("ag-1");

    expect(renderMock).toHaveBeenCalledWith("c", "ENGAGEMENT", 40, "Jane Agent");
    const created = prismaMock.agreement.create.mock.calls[0][0];
    expect(created.data.status).toBe("DRAFT");
    expect(created.data.feePercent).toBe(40);
    expect(created.data.renderedText).toBe("Terms...");
  });
});

describe("sendAgreement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when agreement missing", async () => {
    prismaMock.agreement.findFirst.mockResolvedValueOnce(null);
    const result = await sendAgreement("ag-1", actor);
    expect(result).toEqual({ notFound: true });
  });

  it("rejects non-DRAFT status", async () => {
    prismaMock.agreement.findFirst.mockResolvedValueOnce({
      id: "ag-1",
      status: "SIGNED",
      claim: { userId: "owner-1", assigneeId: null },
      claimant: { email: "a@b.com", fullName: "A B" },
    });
    const result = await sendAgreement("ag-1", actor);
    expect("badState" in result && result.badState).toBe(true);
  });

  it("rejects when claimant has no email", async () => {
    prismaMock.agreement.findFirst.mockResolvedValueOnce({
      id: "ag-1",
      status: "DRAFT",
      claim: { userId: "owner-1", assigneeId: null },
      claimant: { email: null, fullName: "A B" },
    });
    const result = await sendAgreement("ag-1", actor);
    expect("badState" in result && result.badState).toBe(true);
    if ("reason" in result) expect(result.reason).toMatch(/email/i);
  });

  it("transitions DRAFT → SENT and seeds a follow-up task", async () => {
    prismaMock.agreement.findFirst.mockResolvedValueOnce({
      id: "ag-1",
      type: "ENGAGEMENT",
      status: "DRAFT",
      renderedText: "Terms...",
      claimId: "c",
      claim: { userId: "owner-1", assigneeId: null },
      claimant: { email: "jane@example.com", fullName: "Jane Doe" },
    });
    esignMock.mockResolvedValueOnce({
      eSignUrl: "https://sign.test/x",
      provider: "stub",
      externalId: "ext-1",
    });
    prismaMock.agreement.update.mockResolvedValueOnce({
      id: "ag-1",
      claimId: "c",
      status: "SENT",
      sentAt: new Date(),
    });
    seedMock.mockResolvedValueOnce(true);

    const result = await sendAgreement("ag-1", actor);
    expect("agreement" in result && result.agreement.status).toBe("SENT");

    const update = prismaMock.agreement.update.mock.calls[0][0];
    expect(update.data.status).toBe("SENT");
    expect(update.data.sentAt).toBeInstanceOf(Date);
    expect(update.data.eSignUrl).toBe("https://sign.test/x");

    expect(seedMock).toHaveBeenCalledWith("ag-1", "c", "owner-1");
  });
});

describe("markSigned", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is admin-only", async () => {
    const result = await markSigned("ag-1", actor);
    expect(result).toEqual({ forbidden: true });
  });

  it("updates status and sets signedAt when admin", async () => {
    prismaMock.agreement.findUnique.mockResolvedValueOnce({ id: "ag-1" });
    prismaMock.agreement.update.mockResolvedValueOnce({
      id: "ag-1",
      status: "SIGNED",
      signedAt: new Date(),
    });
    const result = await markSigned("ag-1", {
      userId: "admin-1",
      role: "admin",
      name: "Admin",
    });
    expect("agreement" in result && result.agreement.status).toBe("SIGNED");
    const update = prismaMock.agreement.update.mock.calls[0][0];
    expect(update.data.status).toBe("SIGNED");
    expect(update.data.signedAt).toBeInstanceOf(Date);
  });
});
