/**
 * Adds rural counties from all 50 states with surplus funds URLs.
 * Run with: npx tsx scripts/seed-rural-counties.ts
 *
 * Focuses on counties with populations under 100,000 that have
 * publicly available surplus/excess proceeds information.
 * Uses state-level unclaimed property portals where county-level pages don't exist.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RuralCounty {
  name: string;
  state: string;
  population: number;
  listUrl: string | null;
  source: string;
  notes: string;
  rulesText: string;
  claimDeadline: string;
  filingOffice?: string;
  officePhone?: string;
}

const RURAL_COUNTIES: RuralCounty[] = [
  // ═══════════════════════════════════════════════════════════════
  // ALABAMA (AL)
  // ═══════════════════════════════════════════════════════════════
  { name: 'Baldwin', state: 'AL', population: 231767, listUrl: 'https://www.baldwincountyal.gov/departments/revenue-commission', source: 'Revenue Commission — tax sale surplus', notes: 'Contact Revenue Commissioner', rulesText: 'AL Code §40-10-28. Excess from tax sale paid to former owner.', claimDeadline: '3 years from sale', filingOffice: 'Revenue Commission', officePhone: '251-937-0245' },
  { name: 'Etowah', state: 'AL', population: 102268, listUrl: 'https://www.etowahcounty.org/departments/revenue_commissioner/', source: 'Revenue Commissioner — tax sale info', notes: 'Gadsden, AL', rulesText: 'AL Code §40-10-28.', claimDeadline: '3 years from sale', filingOffice: 'Revenue Commissioner' },
  { name: 'Covington', state: 'AL', population: 37571, listUrl: null, source: 'County Probate Office', notes: 'Contact probate office for surplus info', rulesText: 'AL Code §40-10-28.', claimDeadline: '3 years from sale', filingOffice: 'Probate Judge' },

  // ALASKA (AK)
  { name: 'Kenai Peninsula', state: 'AK', population: 58708, listUrl: 'https://www.prior.prior.prior.kpb.us/Finance/property-tax-foreclosures', source: 'Borough foreclosure surplus', notes: 'Borough handles tax foreclosures', rulesText: 'AS §29.45.470. Municipality must return surplus.', claimDeadline: 'No fixed deadline', filingOffice: 'Borough Finance' },
  { name: 'Matanuska-Susitna', state: 'AK', population: 107081, listUrl: 'https://www.matsugov.us/finance', source: 'Borough Finance — foreclosure surplus', notes: 'Palmer, AK', rulesText: 'AS §29.45.470.', claimDeadline: 'No fixed deadline', filingOffice: 'Borough Finance' },

  // ARKANSAS (AR)
  { name: 'Benton', state: 'AR', population: 279141, listUrl: 'https://www.bentoncountyar.gov/county-clerk', source: 'County Clerk — tax sale excess', notes: 'Largest county in AR. Bentonville.', rulesText: 'AR Code §18-60-817. Commissioner of State Lands handles tax-delinquent sales.', claimDeadline: '2 years from sale', filingOffice: 'Commissioner of State Lands', officePhone: '501-324-9422' },
  { name: 'Craighead', state: 'AR', population: 110332, listUrl: 'https://www.craigheadcounty.org/county-clerk/', source: 'County Clerk office', notes: 'Jonesboro, AR', rulesText: 'AR Code §18-60-817.', claimDeadline: '2 years from sale', filingOffice: 'Commissioner of State Lands' },
  { name: 'Izard', state: 'AR', population: 13629, listUrl: null, source: 'Commissioner of State Lands', notes: 'Rural county, Melbourne AR', rulesText: 'AR Code §18-60-817.', claimDeadline: '2 years from sale', filingOffice: 'Commissioner of State Lands' },

  // CONNECTICUT (CT)
  { name: 'Litchfield', state: 'CT', population: 180333, listUrl: 'https://portal.ct.gov/ott/unclaimed-property', source: 'CT State Treasurer Unclaimed Property', notes: 'CT uses municipal tax collectors; surplus goes to state unclaimed property', rulesText: 'CT Gen Stat §12-157. Municipalities handle tax sales.', claimDeadline: 'No fixed deadline via state', filingOffice: 'Municipal Tax Collector' },
  { name: 'Windham', state: 'CT', population: 116538, listUrl: 'https://portal.ct.gov/ott/unclaimed-property', source: 'CT State unclaimed property portal', notes: 'Willimantic area', rulesText: 'CT Gen Stat §12-157.', claimDeadline: 'No fixed deadline', filingOffice: 'Municipal Tax Collector' },

  // DELAWARE (DE)
  { name: 'Sussex', state: 'DE', population: 230249, listUrl: 'https://revenue.delaware.gov/unclaimed-property/', source: 'DE Unclaimed Property Division', notes: 'Georgetown, DE. Tax sales through county Sheriff.', rulesText: 'DE Code Title 12 §1198. Sheriff sale surplus returned to owner.', claimDeadline: 'No fixed deadline', filingOffice: 'County Sheriff', officePhone: '302-855-7830' },
  { name: 'Kent', state: 'DE', population: 180786, listUrl: 'https://revenue.delaware.gov/unclaimed-property/', source: 'DE Unclaimed Property', notes: 'Dover, DE', rulesText: 'DE Code Title 12 §1198.', claimDeadline: 'No fixed deadline', filingOffice: 'County Sheriff' },

  // HAWAII (HI)
  { name: 'Hawaii', state: 'HI', population: 200629, listUrl: 'https://budget.hawaii.gov/unclaimed-property/', source: 'HI Unclaimed Property Program', notes: 'Hilo. Tax sales rare in HI; surplus via state program', rulesText: 'HRS §523A. State Unclaimed Property Act.', claimDeadline: 'No fixed deadline', filingOffice: 'Dept of Budget & Finance' },

  // IDAHO (ID)
  { name: 'Bonneville', state: 'ID', population: 119062, listUrl: 'https://tax.idaho.gov/i-1082.cfm', source: 'ID Tax Commission — tax deed surplus', notes: 'Idaho Falls area', rulesText: 'ID Code §63-1009. County Treasurer holds surplus.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer', officePhone: '208-529-1350' },
  { name: 'Custer', state: 'ID', population: 4315, listUrl: null, source: 'County Treasurer', notes: 'Challis, ID. Very rural.', rulesText: 'ID Code §63-1009.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Lemhi', state: 'ID', population: 8027, listUrl: null, source: 'County Treasurer', notes: 'Salmon, ID', rulesText: 'ID Code §63-1009.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // ILLINOIS (IL)
  { name: 'Winnebago', state: 'IL', population: 282572, listUrl: 'https://www.wincoil.us/departments/treasurer/', source: 'County Treasurer — tax sale surplus', notes: 'Rockford area', rulesText: 'IL 35 ILCS 200/21-260. Tax sale surplus held by County Treasurer.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Sangamon', state: 'IL', population: 194672, listUrl: 'https://co.sangamon.il.us/departments/s-z/treasurer', source: 'County Treasurer', notes: 'Springfield, IL', rulesText: 'IL 35 ILCS 200/21-260.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Hardin', state: 'IL', population: 3821, listUrl: null, source: 'County Clerk', notes: 'Elizabethtown, IL. Smallest IL county.', rulesText: 'IL 35 ILCS 200/21-260.', claimDeadline: 'No fixed deadline', filingOffice: 'County Clerk' },
  { name: 'Pope', state: 'IL', population: 4177, listUrl: null, source: 'County Clerk', notes: 'Golconda, IL', rulesText: 'IL 35 ILCS 200/21-260.', claimDeadline: 'No fixed deadline', filingOffice: 'County Clerk' },

  // INDIANA (IN)
  { name: 'Allen', state: 'IN', population: 379299, listUrl: 'https://www.allencounty.us/auditor', source: 'County Auditor — tax sale surplus', notes: 'Fort Wayne area', rulesText: 'IN Code §6-1.1-24-7. Surplus from tax sale paid to owner.', claimDeadline: 'No fixed deadline', filingOffice: 'County Auditor' },
  { name: 'Vigo', state: 'IN', population: 107038, listUrl: 'https://www.vigocounty.in.gov/government/offices/auditor', source: 'County Auditor', notes: 'Terre Haute', rulesText: 'IN Code §6-1.1-24-7.', claimDeadline: 'No fixed deadline', filingOffice: 'County Auditor' },
  { name: 'Ohio', state: 'IN', population: 5875, listUrl: null, source: 'County Auditor', notes: 'Rising Sun, IN. Smallest IN county.', rulesText: 'IN Code §6-1.1-24-7.', claimDeadline: 'No fixed deadline', filingOffice: 'County Auditor' },

  // IOWA (IA)
  { name: 'Polk', state: 'IA', population: 490161, listUrl: 'https://www.polkcountyiowa.gov/treasurer/', source: 'County Treasurer — tax sale surplus', notes: 'Des Moines area', rulesText: 'IA Code §446.37. Excess held by County Treasurer.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Ringgold', state: 'IA', population: 4894, listUrl: null, source: 'County Treasurer', notes: 'Mount Ayr, IA', rulesText: 'IA Code §446.37.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // KANSAS (KS)
  { name: 'Sedgwick', state: 'KS', population: 516042, listUrl: 'https://www.sedgwickcounty.org/treasurer/', source: 'County Treasurer — tax foreclosure surplus', notes: 'Wichita area', rulesText: 'KS Stat §79-2401a. Excess proceeds from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Chautauqua', state: 'KS', population: 3300, listUrl: null, source: 'County Treasurer', notes: 'Sedan, KS. Very rural.', rulesText: 'KS Stat §79-2401a.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // KENTUCKY (KY)
  { name: 'Jefferson', state: 'KY', population: 782969, listUrl: 'https://jeffersondelinquenttax.com/', source: 'Delinquent tax records — surplus from foreclosure', notes: 'Louisville metro', rulesText: 'KY Rev Stat §91A.080. Surplus from tax lien sale.', claimDeadline: '3 years', filingOffice: 'County Clerk' },
  { name: 'Owsley', state: 'KY', population: 4416, listUrl: null, source: 'County Clerk', notes: 'Booneville, KY. Among poorest US counties.', rulesText: 'KY Rev Stat §91A.080.', claimDeadline: '3 years', filingOffice: 'County Clerk' },

  // LOUISIANA (LA)
  { name: 'Caddo', state: 'LA', population: 243243, listUrl: 'https://www.caddoclerk.com/', source: 'Clerk of Court — tax sale surplus', notes: 'Shreveport area. LA uses parishes.', rulesText: 'LA RS 47:2196. Surplus from adjudicated property sales.', claimDeadline: '3 years', filingOffice: 'Clerk of Court' },
  { name: 'Tensas', state: 'LA', population: 4334, listUrl: null, source: 'Clerk of Court', notes: 'St. Joseph, LA. Very rural parish.', rulesText: 'LA RS 47:2196.', claimDeadline: '3 years', filingOffice: 'Clerk of Court' },

  // MAINE (ME)
  { name: 'Cumberland', state: 'ME', population: 303069, listUrl: 'https://www.mainecash.com/', source: 'ME Unclaimed Property — tax surplus via municipalities', notes: 'Portland area. ME uses municipal tax collectors.', rulesText: 'ME Rev Stat Title 36 §943. Municipal tax lien foreclosure surplus.', claimDeadline: 'No fixed deadline', filingOffice: 'Municipal Treasurer' },
  { name: 'Piscataquis', state: 'ME', population: 16800, listUrl: 'https://www.mainecash.com/', source: 'ME Unclaimed Property', notes: 'Dover-Foxcroft. Very rural.', rulesText: 'ME Rev Stat Title 36 §943.', claimDeadline: 'No fixed deadline', filingOffice: 'Municipal Treasurer' },

  // MASSACHUSETTS (MA)
  { name: 'Barnstable', state: 'MA', population: 228996, listUrl: 'https://www.findmassmoney.com/', source: 'MA Unclaimed Property — tax sale surplus', notes: 'Cape Cod. Tax sales by municipalities.', rulesText: 'MA GL c60 §64. Tax sale surplus returned to owner.', claimDeadline: 'No fixed deadline via state', filingOffice: 'Municipal Treasurer/Collector' },
  { name: 'Dukes', state: 'MA', population: 20600, listUrl: 'https://www.findmassmoney.com/', source: 'MA Unclaimed Property', notes: "Martha's Vineyard", rulesText: 'MA GL c60 §64.', claimDeadline: 'No fixed deadline', filingOffice: 'Municipal Treasurer/Collector' },

  // MINNESOTA (MN)
  { name: 'Hennepin', state: 'MN', population: 1281565, listUrl: 'https://www.hennepin.us/residents/property/forfeited-land-sales', source: 'Forfeited land sales — surplus', notes: 'Minneapolis. After Tyler v Hennepin County Supreme Court decision (2023).', rulesText: 'MN Stat §281.25. County must return surplus after Tyler v Hennepin.', claimDeadline: 'File promptly', filingOffice: 'County Auditor/Treasurer' },
  { name: 'Cook', state: 'MN', population: 5463, listUrl: null, source: 'County Auditor', notes: 'Grand Marais. Smallest MN county.', rulesText: 'MN Stat §281.25.', claimDeadline: 'File promptly', filingOffice: 'County Auditor' },

  // MISSISSIPPI (MS)
  { name: 'Hinds', state: 'MS', population: 231840, listUrl: 'https://www.co.hinds.ms.us/pgs/apps/taxsale/', source: 'Tax sale records — surplus', notes: 'Jackson, MS', rulesText: 'MS Code §27-43-7. Surplus from tax sale.', claimDeadline: '2 years', filingOffice: 'Chancery Clerk' },
  { name: 'Issaquena', state: 'MS', population: 1338, listUrl: null, source: 'Chancery Clerk', notes: 'Mayersville. Least populated US county.', rulesText: 'MS Code §27-43-7.', claimDeadline: '2 years', filingOffice: 'Chancery Clerk' },

  // MISSOURI (MO)
  { name: 'Jackson', state: 'MO', population: 717204, listUrl: 'https://www.jacksoncountygov.com/425/Delinquent-Tax', source: 'Delinquent tax — surplus from sale', notes: 'Kansas City area', rulesText: 'MO Rev Stat §140.230. Surplus from tax sale held by Collector.', claimDeadline: 'No fixed deadline', filingOffice: 'County Collector' },
  { name: 'Worth', state: 'MO', population: 2013, listUrl: null, source: 'County Collector', notes: 'Grant City. Very rural.', rulesText: 'MO Rev Stat §140.230.', claimDeadline: 'No fixed deadline', filingOffice: 'County Collector' },

  // MONTANA (MT)
  { name: 'Yellowstone', state: 'MT', population: 164731, listUrl: 'https://www.co.yellowstone.mt.gov/treasurer/', source: 'County Treasurer — tax deed surplus', notes: 'Billings area', rulesText: 'MT Code §15-18-114. Surplus from tax deed sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Petroleum', state: 'MT', population: 487, listUrl: null, source: 'County Treasurer', notes: 'Winnett. Least populated MT county.', rulesText: 'MT Code §15-18-114.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // NEBRASKA (NE)
  { name: 'Douglas', state: 'NE', population: 584526, listUrl: 'https://www.douglascounty-ne.gov/government/offices/treasurer', source: 'County Treasurer — tax sale surplus', notes: 'Omaha area', rulesText: 'NE Rev Stat §77-1837. Surplus from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Arthur', state: 'NE', population: 434, listUrl: null, source: 'County Treasurer', notes: 'Arthur. Least populated NE county.', rulesText: 'NE Rev Stat §77-1837.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // NEVADA (NV)
  { name: 'Clark', state: 'NV', population: 2265461, listUrl: 'https://www.clarkcountynv.gov/government/departments/treasurer/index.php', source: 'County Treasurer — tax sale surplus', notes: 'Las Vegas area', rulesText: 'NV Rev Stat §361.610. Surplus from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Esmeralda', state: 'NV', population: 729, listUrl: null, source: 'County Treasurer', notes: 'Goldfield. Least populated NV county.', rulesText: 'NV Rev Stat §361.610.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // NEW HAMPSHIRE (NH)
  { name: 'Rockingham', state: 'NH', population: 314176, listUrl: 'https://www.revenue.nh.gov/mun-prop/', source: 'NH DRA — municipal property tax', notes: 'Tax sales by municipalities. Check town-specific sites.', rulesText: 'NH RSA §80:88. Surplus from tax lien sale.', claimDeadline: '3 years', filingOffice: 'Municipal Tax Collector' },

  // NEW JERSEY (NJ)
  { name: 'Atlantic', state: 'NJ', population: 274534, listUrl: 'https://www.unclaimedproperty.nj.gov/', source: 'NJ Unclaimed Property — tax sale surplus', notes: 'Atlantic City area. Tax lien certificates common in NJ.', rulesText: 'NJ Rev Stat §54:5-32. Surplus from tax lien foreclosure.', claimDeadline: 'No fixed deadline via state', filingOffice: 'Municipal Tax Collector' },
  { name: 'Salem', state: 'NJ', population: 64837, listUrl: 'https://www.unclaimedproperty.nj.gov/', source: 'NJ Unclaimed Property', notes: 'Salem, NJ. Rural for NJ.', rulesText: 'NJ Rev Stat §54:5-32.', claimDeadline: 'No fixed deadline', filingOffice: 'Municipal Tax Collector' },

  // NEW MEXICO (NM)
  { name: 'Bernalillo', state: 'NM', population: 676685, listUrl: 'https://www.bernco.gov/treasurer/', source: 'County Treasurer — tax sale surplus', notes: 'Albuquerque area', rulesText: 'NM Stat §7-38-67. Surplus from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Harding', state: 'NM', population: 625, listUrl: null, source: 'County Treasurer', notes: 'Mosquero. Least populated NM county.', rulesText: 'NM Stat §7-38-67.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // NORTH CAROLINA (NC)
  { name: 'Wake', state: 'NC', population: 1129410, listUrl: 'https://www.nccash.com/', source: 'NC Unclaimed Property + county foreclosure surplus', notes: 'Raleigh area', rulesText: 'NC GS §105-374. Surplus from tax foreclosure.', claimDeadline: '10 years via state', filingOffice: 'County Tax Collector' },
  { name: 'Tyrrell', state: 'NC', population: 3903, listUrl: 'https://www.nccash.com/', source: 'NC Unclaimed Property', notes: 'Columbia, NC. Least populated NC county.', rulesText: 'NC GS §105-374.', claimDeadline: '10 years', filingOffice: 'County Tax Collector' },
  { name: 'Robeson', state: 'NC', population: 130625, listUrl: 'https://www.nccash.com/', source: 'NC Unclaimed Property', notes: 'Lumberton. Large rural county.', rulesText: 'NC GS §105-374.', claimDeadline: '10 years', filingOffice: 'County Tax Collector' },

  // NORTH DAKOTA (ND)
  { name: 'Cass', state: 'ND', population: 183593, listUrl: 'https://www.casscountynd.gov/departments/auditor', source: 'County Auditor — tax deed surplus', notes: 'Fargo area', rulesText: 'ND Code §57-28-20. Surplus from tax deed sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Auditor' },
  { name: 'Slope', state: 'ND', population: 750, listUrl: null, source: 'County Auditor', notes: 'Amidon. One of least populated US counties.', rulesText: 'ND Code §57-28-20.', claimDeadline: 'No fixed deadline', filingOffice: 'County Auditor' },

  // OKLAHOMA (OK)
  { name: 'Oklahoma', state: 'OK', population: 797434, listUrl: 'https://treasurer.oklahomacounty.org/resale/', source: 'County Treasurer — resale surplus', notes: 'Oklahoma City', rulesText: 'OK Stat §68-3131. Surplus from tax resale.', claimDeadline: '2 years', filingOffice: 'County Treasurer' },
  { name: 'Cimarron', state: 'OK', population: 2137, listUrl: null, source: 'County Treasurer', notes: 'Boise City. OK panhandle, very rural.', rulesText: 'OK Stat §68-3131.', claimDeadline: '2 years', filingOffice: 'County Treasurer' },

  // OREGON (OR)
  { name: 'Multnomah', state: 'OR', population: 815428, listUrl: 'https://www.oregondsa.com/', source: 'OR Dept of State Lands — Unclaimed Property', notes: 'Portland area. OR uses state unclaimed property for surplus.', rulesText: 'OR Rev Stat §312.270. Tax foreclosure surplus.', claimDeadline: 'No fixed deadline', filingOffice: 'County Tax Collector' },
  { name: 'Wheeler', state: 'OR', population: 1332, listUrl: null, source: 'County Tax Collector', notes: 'Fossil, OR. Very rural.', rulesText: 'OR Rev Stat §312.270.', claimDeadline: 'No fixed deadline', filingOffice: 'County Tax Collector' },

  // PENNSYLVANIA (PA)
  { name: 'Philadelphia', state: 'PA', population: 1603797, listUrl: 'https://www.patreasury.gov/unclaimed-property/', source: 'PA Unclaimed Property + Sheriff sale surplus', notes: 'Sheriff sales common in PA', rulesText: 'PA 72 PS §1301.1. Surplus from upset tax sale.', claimDeadline: 'No fixed deadline via state', filingOffice: 'County Tax Claim Bureau' },
  { name: 'Cameron', state: 'PA', population: 4447, listUrl: 'https://www.patreasury.gov/unclaimed-property/', source: 'PA Unclaimed Property', notes: 'Emporium. Least populated PA county.', rulesText: 'PA 72 PS §1301.1.', claimDeadline: 'No fixed deadline', filingOffice: 'County Tax Claim Bureau' },

  // RHODE ISLAND (RI)
  { name: 'Providence', state: 'RI', population: 660741, listUrl: 'https://treasury.ri.gov/unclaimed-property', source: 'RI Unclaimed Property — municipal tax surplus', notes: 'Providence. Tax sales by municipalities.', rulesText: 'RI GL §44-9-19. Tax sale surplus.', claimDeadline: 'No fixed deadline', filingOffice: 'Municipal Tax Collector' },

  // SOUTH CAROLINA (SC)
  { name: 'Charleston', state: 'SC', population: 408235, listUrl: 'https://www.charlestoncounty.org/departments/delinquent-tax/', source: 'Delinquent Tax office — tax sale surplus', notes: 'Charleston, SC', rulesText: 'SC Code §12-51-130. Surplus from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'Delinquent Tax Collector' },
  { name: 'Allendale', state: 'SC', population: 8789, listUrl: null, source: 'County Treasurer', notes: 'Allendale. Very rural SC county.', rulesText: 'SC Code §12-51-130.', claimDeadline: 'No fixed deadline', filingOffice: 'Delinquent Tax Collector' },

  // SOUTH DAKOTA (SD)
  { name: 'Minnehaha', state: 'SD', population: 197214, listUrl: 'https://www.minnehahacounty.org/dept/tr/tr.aspx', source: 'County Treasurer — tax deed surplus', notes: 'Sioux Falls area', rulesText: 'SD CL §10-25-7. Surplus from tax deed.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Jones', state: 'SD', population: 903, listUrl: null, source: 'County Treasurer', notes: 'Murdo. Very rural.', rulesText: 'SD CL §10-25-7.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // TENNESSEE (TN)
  { name: 'Shelby', state: 'TN', population: 929744, listUrl: 'https://www.shelbycountytrustee.com/', source: 'County Trustee — tax sale surplus', notes: 'Memphis area', rulesText: 'TN Code §67-5-2702. Surplus from tax sale.', claimDeadline: '1 year', filingOffice: 'County Trustee/Clerk & Master' },
  { name: 'Pickett', state: 'TN', population: 5170, listUrl: null, source: 'County Trustee', notes: 'Byrdstown. Least populated TN county.', rulesText: 'TN Code §67-5-2702.', claimDeadline: '1 year', filingOffice: 'County Trustee' },

  // UTAH (UT)
  { name: 'Salt Lake', state: 'UT', population: 1185238, listUrl: 'https://slco.org/auditor/tax-sale/', source: 'County Auditor — tax sale surplus', notes: 'Salt Lake City', rulesText: 'UT Code §59-2-1351.1. Surplus from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Auditor' },
  { name: 'Daggett', state: 'UT', population: 948, listUrl: null, source: 'County Treasurer', notes: 'Manila. Least populated UT county.', rulesText: 'UT Code §59-2-1351.1.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // VERMONT (VT)
  { name: 'Chittenden', state: 'VT', population: 168323, listUrl: 'https://www.vermonttreasurer.gov/unclaimed-property', source: 'VT Unclaimed Property — municipal surplus', notes: 'Burlington area. Tax sales by municipalities.', rulesText: 'VT Stat Title 32 §5260. Tax sale surplus.', claimDeadline: 'No fixed deadline', filingOffice: 'Municipal Tax Collector' },

  // VIRGINIA (VA)
  { name: 'Fairfax', state: 'VA', population: 1150309, listUrl: 'https://www.fairfaxcounty.gov/taxes/real-estate-tax-sale', source: 'Real estate tax sale — surplus', notes: 'Northern VA', rulesText: 'VA Code §58.1-3967. Surplus from tax sale.', claimDeadline: '2 years', filingOffice: 'County Treasurer' },
  { name: 'Highland', state: 'VA', population: 2190, listUrl: null, source: 'County Treasurer', notes: 'Monterey. Least populated VA county.', rulesText: 'VA Code §58.1-3967.', claimDeadline: '2 years', filingOffice: 'County Treasurer' },

  // WASHINGTON (WA)
  { name: 'King', state: 'WA', population: 2252782, listUrl: 'https://kingcounty.gov/en/dept/finance-business-operations/services/tax-services/foreclosure', source: 'Tax foreclosure surplus', notes: 'Seattle area', rulesText: 'WA RCW §84.64.080. Surplus from tax foreclosure.', claimDeadline: '3 years', filingOffice: 'County Treasurer' },
  { name: 'Garfield', state: 'WA', population: 2225, listUrl: null, source: 'County Treasurer', notes: 'Pomeroy. Least populated WA county.', rulesText: 'WA RCW §84.64.080.', claimDeadline: '3 years', filingOffice: 'County Treasurer' },

  // WEST VIRGINIA (WV)
  { name: 'Kanawha', state: 'WV', population: 178124, listUrl: 'https://kanawha.us/sheriff/', source: 'Sheriff tax office — surplus from sale', notes: 'Charleston, WV', rulesText: 'WV Code §11A-3-64. Surplus from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Sheriff' },
  { name: 'Wirt', state: 'WV', population: 5533, listUrl: null, source: 'County Sheriff', notes: 'Elizabeth. Very rural WV county.', rulesText: 'WV Code §11A-3-64.', claimDeadline: 'No fixed deadline', filingOffice: 'County Sheriff' },

  // WISCONSIN (WI)
  { name: 'Milwaukee', state: 'WI', population: 939489, listUrl: 'https://county.milwaukee.gov/EN/Treasurer/Tax-Deed', source: 'County Treasurer — tax deed surplus', notes: 'Milwaukee', rulesText: 'WI Stat §75.36. Surplus from tax deed sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Menominee', state: 'WI', population: 4556, listUrl: null, source: 'County Treasurer', notes: 'Keshena. Smallest WI county.', rulesText: 'WI Stat §75.36.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // WYOMING (WY)
  { name: 'Laramie', state: 'WY', population: 99500, listUrl: 'https://www.laramiecounty.com/Treasurer', source: 'County Treasurer — tax sale surplus', notes: 'Cheyenne area', rulesText: 'WY Stat §39-13-108. Surplus from tax sale.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },
  { name: 'Niobrara', state: 'WY', population: 2356, listUrl: null, source: 'County Treasurer', notes: 'Lusk. Very rural WY county.', rulesText: 'WY Stat §39-13-108.', claimDeadline: 'No fixed deadline', filingOffice: 'County Treasurer' },

  // ═══════════════════════════════════════════════════════════════
  // Additional rural counties in EXISTING states
  // ═══════════════════════════════════════════════════════════════

  // More FL rural
  { name: 'Hamilton', state: 'FL', population: 14269, listUrl: 'https://www.hamiltoncountyclerk.com/', source: 'Clerk of Court — surplus from tax deed', notes: 'Jasper, FL. Very rural north FL.', rulesText: 'FL Stat §197.522.', claimDeadline: '120 days from tax deed', filingOffice: 'Clerk of Circuit Court' },
  { name: 'Liberty', state: 'FL', population: 8354, listUrl: null, source: 'Clerk of Court', notes: 'Bristol, FL. Rural panhandle.', rulesText: 'FL Stat §197.522.', claimDeadline: '120 days', filingOffice: 'Clerk of Circuit Court' },
  { name: 'Glades', state: 'FL', population: 13363, listUrl: null, source: 'Clerk of Court', notes: 'Moore Haven, FL', rulesText: 'FL Stat §197.522.', claimDeadline: '120 days', filingOffice: 'Clerk of Circuit Court' },
  { name: 'Lafayette', state: 'FL', population: 8744, listUrl: null, source: 'Clerk of Court', notes: 'Mayo, FL. Smallest FL county.', rulesText: 'FL Stat §197.522.', claimDeadline: '120 days', filingOffice: 'Clerk of Circuit Court' },

  // More TX rural
  { name: 'Loving', state: 'TX', population: 64, listUrl: null, source: 'District Clerk', notes: 'Mentone. Least populated US county.', rulesText: 'TX Tax Code §34.04.', claimDeadline: '2 years from sale', filingOffice: 'District Clerk' },
  { name: 'Kenedy', state: 'TX', population: 404, listUrl: null, source: 'District Clerk', notes: 'Sarita, TX. King Ranch country.', rulesText: 'TX Tax Code §34.04.', claimDeadline: '2 years from sale', filingOffice: 'District Clerk' },
  { name: 'Roberts', state: 'TX', population: 885, listUrl: null, source: 'District Clerk', notes: 'Miami, TX. Texas panhandle.', rulesText: 'TX Tax Code §34.04.', claimDeadline: '2 years from sale', filingOffice: 'District Clerk' },

  // More GA rural
  { name: 'Taliaferro', state: 'GA', population: 1537, listUrl: null, source: 'Tax Commissioner', notes: 'Crawfordville. Least populated GA county.', rulesText: 'GA Code §48-4-5.', claimDeadline: '1 year from sale', filingOffice: 'Tax Commissioner' },
  { name: 'Quitman', state: 'GA', population: 2299, listUrl: null, source: 'Tax Commissioner', notes: 'Georgetown, GA. Very rural.', rulesText: 'GA Code §48-4-5.', claimDeadline: '1 year from sale', filingOffice: 'Tax Commissioner' },
  { name: 'Webster', state: 'GA', population: 2607, listUrl: null, source: 'Tax Commissioner', notes: 'Preston, GA', rulesText: 'GA Code §48-4-5.', claimDeadline: '1 year from sale', filingOffice: 'Tax Commissioner' },
];

async function main() {
  console.log(`Seeding ${RURAL_COUNTIES.length} rural counties across all 50 states...`);

  // Get current max rank
  const maxRank = await prisma.county.aggregate({ _max: { rank: true } });
  let nextRank = (maxRank._max.rank || 0) + 1;

  let created = 0;
  let updated = 0;

  for (const county of RURAL_COUNTIES) {
    const existing = await prisma.county.findFirst({
      where: { name: county.name, state: county.state },
    });

    if (existing) {
      // Update with new fields if they're missing
      await prisma.county.update({
        where: { id: existing.id },
        data: {
          listUrl: existing.listUrl || county.listUrl,
          source: existing.source || county.source,
          notes: existing.notes || county.notes,
          rulesText: existing.rulesText || county.rulesText,
          claimDeadline: existing.claimDeadline || county.claimDeadline,
          filingOffice: county.filingOffice || existing.filingOffice,
          officePhone: county.officePhone || existing.officePhone,
          population: existing.population > 0 ? existing.population : county.population,
        },
      });
      updated++;
    } else {
      await prisma.county.create({
        data: {
          rank: nextRank++,
          name: county.name,
          state: county.state,
          population: county.population,
          listUrl: county.listUrl,
          source: county.source,
          notes: county.notes,
          rulesText: county.rulesText,
          claimDeadline: county.claimDeadline,
          filingOffice: county.filingOffice,
          officePhone: county.officePhone,
        },
      });
      created++;
    }
  }

  // Summary by state
  const states = new Set(RURAL_COUNTIES.map(c => c.state));
  console.log(`\nDone! Created ${created}, updated ${updated} counties.`);
  console.log(`Coverage: ${states.size} states`);

  // Count total
  const total = await prisma.county.count();
  const withUrls = await prisma.county.count({ where: { listUrl: { not: null } } });
  const stateCount = (await prisma.county.groupBy({ by: ['state'] })).length;
  console.log(`Total: ${total} counties across ${stateCount} states (${withUrls} with URLs)`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
