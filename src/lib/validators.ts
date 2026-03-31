import { z } from 'zod';

export const countySchema = z.object({
  rank: z.number().int().positive(),
  name: z.string().min(1).max(100),
  state: z.string().length(2),
  population: z.number().int().nonnegative(),
  listUrl: z.string().url().optional().nullable(),
  source: z.string().max(500).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  rulesText: z.string().optional().nullable(),
  claimDeadline: z.string().max(200).optional().nullable(),
});

export const alertSchema = z.object({
  countyId: z.string().cuid(),
  minAmount: z.number().positive().optional().nullable(),
});

export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  state: z.string().length(2).optional(),
  minPop: z.coerce.number().int().nonnegative().optional(),
  maxPop: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CountyInput = z.infer<typeof countySchema>;
export type AlertInput = z.infer<typeof alertSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
