/**
 * People Data Labs (PDL) provider stub.
 *
 * v1: no real API call. Returns deterministic mock contact data when
 * PDL_API_KEY is absent, so we can wire the downstream pipeline + UI
 * without a live integration.
 *
 * TODO: implement the real call — https://docs.peopledatalabs.com/docs/person-enrichment-api
 */

export interface PdlLookupInput {
  fullName: string;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

export interface PdlLookupResult {
  found: boolean;
  source: "people-data-labs" | "mock";
  phone: string | null;
  altPhone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  confidence: number; // 0-1
}

export async function lookupPerson(
  input: PdlLookupInput,
): Promise<PdlLookupResult> {
  const apiKey = process.env.PDL_API_KEY;
  if (!apiKey) {
    // Deterministic mock derived from the name — keeps repeated runs stable.
    const slug = input.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ".")
      .replace(/\.+/g, ".")
      .replace(/^\.|\.$/g, "");
    const digits = Array.from(input.fullName)
      .reduce((acc, c) => acc + c.charCodeAt(0), 0)
      .toString()
      .padStart(10, "0")
      .slice(-10);
    return {
      found: true,
      source: "mock",
      phone: digits,
      altPhone: null,
      email: `${slug || "claimant"}@example.com`,
      city: input.city ?? null,
      state: input.state ?? null,
      zip: input.zip ?? null,
      confidence: 0.5,
    };
  }

  // TODO: real PDL POST /v5/person/enrich
  throw new Error("PDL_API_KEY set but real provider not yet implemented");
}
