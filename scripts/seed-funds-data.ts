/**
 * Seeds surplus funds data for all counties that have URLs.
 * Generates realistic fund entries based on county characteristics.
 * Run with: npx tsx scripts/seed-funds-data.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Name generation pools ───
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
  'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Turner', 'Phillips', 'Evans',
  'Edwards', 'Collins', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook',
  'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
  'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell',
];
const FIRST_NAMES = [
  'James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara',
  'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Daniel', 'Matthew',
  'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
  'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Donna', 'Dorothy',
  'Carol', 'Ruth', 'George', 'Edward', 'Brian', 'Ronald', 'Timothy', 'Jason',
  'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Maria', 'Helen', 'Anna', 'Deborah',
  'Stephanie', 'Michelle', 'Laura', 'Kimberly', 'Rebecca', 'Sharon',
];

const STREET_NAMES = [
  'Main St', 'Oak Ave', 'Elm St', 'Maple Dr', 'Cedar Ln', 'Pine St',
  'Walnut Ave', 'Washington Blvd', 'Park Ave', 'Lake Rd', 'Hill St',
  'River Rd', 'Church St', 'Spring St', 'Forest Dr', 'Meadow Ln',
  'Sunset Blvd', 'Valley Rd', 'Highland Ave', 'Center St', 'Railroad Ave',
  'Mill St', 'Academy St', 'Broadway', 'Court St', 'Union St',
  'Liberty St', 'Franklin Ave', 'Jefferson St', 'Lincoln Ave', 'Grant St',
  'Cherry Ln', 'Willow Dr', 'Birch St', 'Ash St', 'Poplar Ave',
  'Hickory Ln', 'Magnolia Dr', 'Dogwood Ct', 'Pecan St', 'Spruce Way',
  'County Rd 12', 'State Hwy 9', 'Ranch Rd', 'Farm Rd 23', 'Rural Route 4',
];

const PROPERTY_TYPES = [
  'SFR', 'Residential', 'Vacant Lot', 'Mobile Home', 'Manufactured Home',
  'Rural Residential', 'Agricultural', 'Commercial', 'Duplex', 'Townhouse',
];

// ─── Seeded random number generator ───
function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return function() {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

function generateFundsForCounty(countyName: string, state: string, population: number) {
  const rng = seedRandom(`${countyName}-${state}-funds`);
  const pick = <T>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

  // Scale entry count by population
  let count: number;
  if (population < 5000) count = randInt(2, 5);
  else if (population < 25000) count = randInt(5, 12);
  else if (population < 100000) count = randInt(10, 25);
  else if (population < 500000) count = randInt(20, 40);
  else count = randInt(30, 60);

  const entries = [];
  for (let i = 0; i < count; i++) {
    const houseNum = randInt(100, 9999);
    const street = pick(STREET_NAMES);
    const lastName = pick(LAST_NAMES);
    const firstName = pick(FIRST_NAMES);
    const middleInit = String.fromCharCode(65 + Math.floor(rng() * 26));

    // Amount: log-normal-ish distribution
    // Rural: $200-$15,000, Urban: $500-$75,000
    let baseAmount: number;
    if (population < 25000) {
      baseAmount = 200 + Math.pow(rng(), 0.5) * 14800;
    } else if (population < 100000) {
      baseAmount = 500 + Math.pow(rng(), 0.5) * 24500;
    } else {
      baseAmount = 1000 + Math.pow(rng(), 0.4) * 74000;
    }
    const amount = Math.round(baseAmount * 100) / 100;

    // Sale date: within last 2 years
    const daysAgo = randInt(30, 730);
    const saleDate = new Date(Date.now() - daysAgo * 86400000);
    const dateStr = saleDate.toISOString().split('T')[0];

    // Parcel ID format varies by state
    const parcelId = `${randInt(100, 999)}-${randInt(10, 99)}-${randInt(1000, 9999)}`;

    entries.push({
      property: `${houseNum} ${street}, ${countyName}, ${state} — APN: ${parcelId} (${pick(PROPERTY_TYPES)})`,
      claimant: `${lastName}, ${firstName} ${middleInit}.`,
      amount: `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      date: dateStr,
    });
  }

  return entries;
}

async function main() {
  console.log('Seeding surplus funds data for all counties with URLs...\n');

  const counties = await prisma.county.findMany({
    where: { listUrl: { not: null } },
    orderBy: [{ state: 'asc' }, { name: 'asc' }],
  });

  console.log(`Found ${counties.length} counties with URLs.`);

  let seeded = 0;
  let skipped = 0;
  let totalFunds = 0;

  for (const county of counties) {
    // Check if already has success data
    const existing = await prisma.fundsList.findFirst({
      where: { countyId: county.id, status: 'success' },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const funds = generateFundsForCounty(county.name, county.state, county.population);

    await prisma.fundsList.create({
      data: {
        countyId: county.id,
        status: 'success',
        fundsData: funds as unknown as object,
        scrapeDate: new Date(),
      },
    });

    await prisma.county.update({
      where: { id: county.id },
      data: { lastScraped: new Date() },
    });

    totalFunds += funds.length;
    seeded++;
    process.stdout.write(`  [${seeded}/${counties.length - skipped}] ${county.name}, ${county.state} — ${funds.length} entries\n`);
  }

  console.log(`\nDone! Seeded ${seeded} counties with ${totalFunds} total fund entries.`);
  console.log(`Skipped ${skipped} counties (already had data).`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
