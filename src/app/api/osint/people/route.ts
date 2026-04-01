import { NextRequest } from 'next/server';
import { ok, handleError } from '@/lib/api-utils';
import { searchPeople } from '@/lib/osint';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) return ok({ results: [], source: 'No query' });

    const result = await searchPeople(query);
    return ok({ query, tool: 'people', ...result });
  } catch (e) {
    return handleError(e);
  }
}
