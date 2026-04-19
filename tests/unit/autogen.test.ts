import { describe, it, expect, beforeEach, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    task: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  seedCaseKickoffTasks,
  seedAgreementFollowUpTask,
  seedContactFailureFollowUpTask,
} from "@/modules/tasks/server/autogen";

describe("autogen task seeders (idempotency)", () => {
  beforeEach(() => {
    prismaMock.task.findFirst.mockReset();
    prismaMock.task.create.mockReset();
  });

  describe("seedCaseKickoffTasks", () => {
    it("creates a kickoff task when no marker exists", async () => {
      prismaMock.task.findFirst.mockResolvedValueOnce(null);
      prismaMock.task.create.mockResolvedValueOnce({ id: "t1" });

      await seedCaseKickoffTasks("claim-1", "user-a");

      expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
        where: { claimId: "claim-1", notes: { contains: "[kickoff:claim-1]" } },
        select: { id: true },
      });
      expect(prismaMock.task.create).toHaveBeenCalledOnce();
      const call = prismaMock.task.create.mock.calls[0][0];
      expect(call.data.claimId).toBe("claim-1");
      expect(call.data.assigneeId).toBe("user-a");
      expect(call.data.type).toBe("CALL");
      expect(call.data.priority).toBe("high");
      expect(call.data.notes).toContain("[kickoff:claim-1]");
    });

    it("is idempotent — second call with existing marker skips creation", async () => {
      prismaMock.task.findFirst.mockResolvedValueOnce({ id: "existing" });
      await seedCaseKickoffTasks("claim-1", "user-a");
      expect(prismaMock.task.create).not.toHaveBeenCalled();
    });
  });

  describe("seedAgreementFollowUpTask", () => {
    it("creates and returns true when no marker exists", async () => {
      prismaMock.task.findFirst.mockResolvedValueOnce(null);
      prismaMock.task.create.mockResolvedValueOnce({ id: "t2" });

      const result = await seedAgreementFollowUpTask("ag-1", "claim-1", "user-a");
      expect(result).toBe(true);
      expect(prismaMock.task.create).toHaveBeenCalledOnce();
      expect(prismaMock.task.create.mock.calls[0][0].data.type).toBe("FOLLOW_UP");
      expect(prismaMock.task.create.mock.calls[0][0].data.notes).toContain(
        "[followup:agreement:ag-1]",
      );
    });

    it("returns false and skips creation when marker exists", async () => {
      prismaMock.task.findFirst.mockResolvedValueOnce({ id: "existing" });
      const result = await seedAgreementFollowUpTask("ag-1", "claim-1", null);
      expect(result).toBe(false);
      expect(prismaMock.task.create).not.toHaveBeenCalled();
    });
  });

  describe("seedContactFailureFollowUpTask", () => {
    it("creates a task and returns its id for a new contact-log marker", async () => {
      prismaMock.task.findFirst.mockResolvedValueOnce(null);
      prismaMock.task.create.mockResolvedValueOnce({ id: "t3" });

      const id = await seedContactFailureFollowUpTask({
        claimId: "claim-1",
        contactLogId: "cl-1",
        channel: "CALL",
        direction: "outbound",
        status: "voicemail",
        assigneeId: "user-a",
      });
      expect(id).toBe("t3");
      const data = prismaMock.task.create.mock.calls[0][0].data;
      expect(data.notes).toContain("[followup:contact:cl-1]");
      expect(data.notes).toContain("voicemail");
      expect(data.title).toMatch(/call/i);
    });

    it("returns null when the contact-log marker already exists", async () => {
      prismaMock.task.findFirst.mockResolvedValueOnce({ id: "existing" });
      const id = await seedContactFailureFollowUpTask({
        claimId: "claim-1",
        contactLogId: "cl-1",
        channel: "CALL",
        direction: "outbound",
        status: "voicemail",
        assigneeId: null,
      });
      expect(id).toBeNull();
      expect(prismaMock.task.create).not.toHaveBeenCalled();
    });
  });
});
