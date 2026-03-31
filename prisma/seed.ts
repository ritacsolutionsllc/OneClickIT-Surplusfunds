import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

interface CountyRow {
  rank: string;
  county: string;
  state: string;
  pop: string;
  source: string;
  notes: string;
}

// Known list URLs for counties with confirmed online lists
const KNOWN_URLS: Record<string, string> = {
  'Inyo-CA': 'https://inyocounty.us/sites/default/files/Excess%20Proceeds%20Publication.pdf',
  'Riverside-CA': 'https://www.rscso.com/sites/default/files/uploads/Riverside-Dept/Sheriff/Unclaimed-Property.pdf',
};

async function main() {
  const csvPath = path.join(__dirname, 'counties_seed.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');

  const { data } = Papa.parse<CountyRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`Seeding ${data.length} counties...`);

  for (const row of data) {
    const key = `${row.county}-${row.state}`;
    await prisma.county.upsert({
      where: { name_state: { name: row.county, state: row.state } },
      update: {
        rank: parseInt(row.rank),
        population: parseInt(row.pop),
        source: row.source || null,
        notes: row.notes || null,
        listUrl: KNOWN_URLS[key] || null,
      },
      create: {
        rank: parseInt(row.rank),
        name: row.county,
        state: row.state,
        population: parseInt(row.pop),
        source: row.source || null,
        notes: row.notes || null,
        listUrl: KNOWN_URLS[key] || null,
      },
    });
  }

  console.log(`✓ Seeded ${data.length} counties successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
