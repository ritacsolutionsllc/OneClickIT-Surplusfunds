import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, handleError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q') || '';

    if (!q.trim()) return ok({ counties: [] });

    const counties = await prisma.county.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { state: { contains: q, mode: 'insensitive' } },
          { notes: { contains: q, mode: 'insensitive' } },
          { source: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { rank: 'asc' },
      take: 20,
    });

    return ok({ counties });
  } catch (e) {
    return handleError(e);
  }
}
