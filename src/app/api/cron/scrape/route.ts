import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeCounty } from '@/lib/scraper';
import { ok, err, requireCronSecret } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  if (!requireCronSecret(request)) {
    return err('Unauthorized', 401);
  }

  const counties = await prisma.county.findMany({
    where: { listUrl: { not: null } },
    orderBy: { rank: 'asc' },
  });

  const results = [];
  for (const county of counties) {
    try {
      const result = await scrapeCounty(county.listUrl!);
      await prisma.fundsList.create({
        data: {
          countyId: county.id,
          status: result.success ? 'success' : 'error',
          fundsData: result.funds as unknown as object,
          errorMsg: result.error || null,
        },
      });
      await prisma.county.update({
        where: { id: county.id },
        data: { lastScraped: new Date() },
      });
      results.push({ county: county.name, state: county.state, success: result.success, count: result.funds.length });
    } catch (e) {
      results.push({ county: county.name, state: county.state, success: false, error: String(e) });
    }
  }

  return ok({ scraped: results.length, results });
}
