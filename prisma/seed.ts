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
// Last researched: 2026-03-31
const KNOWN_URLS: Record<string, string> = {
  // --- California Counties ---
  'Alpine-CA': 'https://alpinecountyca.gov/353/Treasurer-Tax-Collector',
  'Sierra-CA': 'https://www.sierracounty.ca.gov/314/Property-Tax-Sales',
  'Modoc-CA': 'https://www.co.modoc.ca.us/departments/tax_collector/publications.php',
  'Mono-CA': 'https://monocounty.ca.gov/tax/page/property-tax-auction-excess-proceeds',
  'Trinity-CA': 'https://www.trinitycounty.org/438/Treasurer-Tax-Collector',
  'Inyo-CA': 'https://inyocounty.us/sites/default/files/Excess%20Proceeds%20Publication.pdf',
  'Mariposa-CA': 'https://www.mariposacounty.gov/1748/Publications',
  'Colusa-CA': 'https://www.countyofcolusaca.gov/753/Sale-of-Tax-Defaulted-Property',
  'Amador-CA': 'https://www.amadorcounty.gov/government/treasurer-tax-collector/publications',
  'Calaveras-CA': 'https://taxcollector.calaverasgov.us/Auctions',
  'Shasta-CA': 'https://www.shastacounty.gov/tax-collector/page/excess-proceeds',
  'Tulare-CA': 'https://tularecounty.ca.gov/treasurertaxcollector/tax-collector/tax-auction',
  'Riverside-CA': 'https://countytreasurer.org/tax-collector/tax-sale-information',
  'Fresno-CA': 'https://www.fresnocountyca.gov/Departments/Auditor-Controller-Treasurer-Tax-Collector/Property-Tax-Information/Tax-Sale-Excess-Proceeds',
  'Kern-CA': 'https://www.kerncounty.com/services/property-land-and-taxes/property-tax-portal/tax-defaulted-property-sales',
  // --- Non-CA Counties ---
  'Loving-TX': 'https://www.claimittexas.gov/', // Pop ~120; no county website; use TX state unclaimed property
  'Sumter-FL': 'https://www.sumterclerk.com/surplus-funds-list',
  'Carroll-MD': 'https://www.carrollcountymd.gov/government/directory/comptroller/collectionstaxes/surplus-funds-list/',
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
