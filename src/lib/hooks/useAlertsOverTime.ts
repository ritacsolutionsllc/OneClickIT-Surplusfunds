import { prisma } from '@/lib/prisma';

export async function getAlertsOverTime() {
  const rows = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
    SELECT DATE("created_at") as date, COUNT(*) as count
    FROM "alerts"
    GROUP BY DATE("created_at")
    ORDER BY date ASC
  `;
  return rows.map((r: { date: string; count: bigint }) => ({ date: String(r.date), count: Number(r.count) }));
}
