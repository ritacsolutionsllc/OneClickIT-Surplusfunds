import { prisma } from '@/lib/prisma';

export async function getCountiesByState() {
  const rows = await prisma.county.groupBy({
    by: ['state'],
    _count: { id: true },
  });
  return rows.map((r: { state: string; _count: { id: number } }) => ({ state: r.state, counties: r._count.id }));
}
