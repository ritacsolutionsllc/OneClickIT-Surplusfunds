import { z } from "zod";

/** Body accepted by POST /api/v1/leads/:id/skiptrace — all fields optional. */
export const skiptraceRequestSchema = z.object({
  /** If true, force a re-run even if lead.enriched is already true. */
  force: z.boolean().optional().default(false),
});

export type SkiptraceRequestInput = z.infer<typeof skiptraceRequestSchema>;
