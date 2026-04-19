import { prisma } from "@/lib/prisma";
import { lookupPerson } from "./providers/people-data-labs";
import { rescoreOne } from "@/modules/leads/server/scoring";

export interface ActorContext {
  userId: string;
  role: string;
}

export type EnrichLeadResult =
  | { notFound: true }
  | { forbidden: true }
  | { alreadyEnriched: true; leadId: string }
  | {
      leadId: string;
      claimantId: string;
      createdClaimant: boolean;
      score: number;
      source: string;
    };

/**
 * Pull a SurplusLead, hit the OSINT provider, upsert the enriched contact
 * into a Claimant row, flip lead.enriched=true, rescore.
 *
 * Access: admin OR the lead must be reachable (open-access until finer
 * ACL lands; leads aren't personally owned yet).
 */
export async function enrichLead(
  leadId: string,
  actor: ActorContext,
  opts: { force?: boolean } = {},
): Promise<EnrichLeadResult> {
  const lead = await prisma.surplusLead.findUnique({
    where: { id: leadId },
    include: {
      claimants: { select: { id: true, email: true, phone: true } },
      county: { select: { state: true } },
    },
  });
  if (!lead) return { notFound: true };

  if (lead.enriched && !opts.force) {
    return { alreadyEnriched: true, leadId: lead.id };
  }

  // Authorization is currently permissive for any authenticated caller —
  // leads aren't per-user scoped. Admins always allowed; regular users can
  // enrich. Kept explicit so it's easy to tighten later.
  if (actor.role !== "admin" && !actor.userId) {
    return { forbidden: true };
  }

  const lookup = await lookupPerson({
    fullName: lead.ownerName,
    addressLine: lead.propertyAddr,
    state: lead.county.state,
  });

  let claimantId: string;
  let createdClaimant = false;

  // Match existing claimant on (email) if present, else take the first row
  // attached to this lead, else create new.
  const byEmail =
    lookup.email &&
    lead.claimants.find((c) => c.email?.toLowerCase() === lookup.email!.toLowerCase());
  const existing = byEmail ?? lead.claimants[0];

  if (existing) {
    const updated = await prisma.claimant.update({
      where: { id: existing.id },
      data: {
        fullName: lead.ownerName,
        phone: lookup.phone ?? undefined,
        altPhone: lookup.altPhone ?? undefined,
        email: lookup.email ?? undefined,
        city: lookup.city ?? undefined,
        state: lookup.state ?? undefined,
        zip: lookup.zip ?? undefined,
        skipTraced: true,
        skipTraceSource: lookup.source,
      },
      select: { id: true },
    });
    claimantId = updated.id;
  } else {
    const created = await prisma.claimant.create({
      data: {
        leadId: lead.id,
        fullName: lead.ownerName,
        phone: lookup.phone,
        altPhone: lookup.altPhone,
        email: lookup.email,
        address: lead.propertyAddr,
        city: lookup.city,
        state: lookup.state,
        zip: lookup.zip,
        skipTraced: true,
        skipTraceSource: lookup.source,
      },
      select: { id: true },
    });
    claimantId = created.id;
    createdClaimant = true;
  }

  await prisma.surplusLead.update({
    where: { id: lead.id },
    data: { enriched: true, status: "SKIP_TRACED" },
  });

  // Rescore immediately — enriched + claimant contact both feed the score.
  let score = 0;
  try {
    score = await rescoreOne(lead.id);
  } catch (e) {
    console.error("[enrich] rescore failed", lead.id, e);
  }

  return {
    leadId: lead.id,
    claimantId,
    createdClaimant,
    score,
    source: lookup.source,
  };
}
