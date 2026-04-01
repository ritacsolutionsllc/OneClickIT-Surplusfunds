/**
 * Script to update county list URLs in the database with researched, verified URLs.
 * Run with: npx tsx scripts/update-urls.ts
 * Last researched: 2026-04-01
 *
 * Sources: Google dork searches using:
 *   site:*.ca.gov ("excess proceeds" OR "surplus funds") (county OR "treasurer-tax collector")
 *   site:*.ca.gov "notice of right to claim excess proceeds" filetype:pdf
 *   [state] county surplus funds / excess proceeds searches
 *
 * Total: 75+ counties across CA, FL, TX, GA, AZ, OH, MI, MD, IL, NY, CO
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CountyUrl {
  name: string;
  state: string;
  listUrl: string;
  source?: string;
  notes?: string;
  rulesText?: string;
  claimDeadline?: string;
}

const COUNTY_URLS: CountyUrl[] = [
  // ═══════════════════════════════════════════════════════════════
  // CALIFORNIA (CA) — 55 counties
  // ═══════════════════════════════════════════════════════════════

  // --- BEST: Dedicated excess proceeds pages with PDFs ---
  {
    name: 'Mono',
    state: 'CA',
    listUrl: 'https://monocounty.ca.gov/tax/page/property-tax-auction-excess-proceeds',
    source: 'Dedicated excess proceeds page with PDFs',
    notes: 'Downloadable claim form + excess proceeds lists. Contact: 760-932-5480, treasurer@mono.ca.gov',
    rulesText: 'CA Rev & Tax Code §4675. Claim deadline: 1 year from deed recording.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Mariposa',
    state: 'CA',
    listUrl: 'https://www.mariposacounty.gov/1748/Publications',
    source: 'Annual excess proceeds publication PDFs (2018-2025)',
    notes: 'Sep 2025 latest PDF. Contact: 209-966-2621',
    rulesText: 'CA Rev & Tax Code §4675. Annual publication of excess proceeds.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Modoc',
    state: 'CA',
    listUrl: 'https://www.co.modoc.ca.us/departments/tax_collector/publications.php',
    source: 'Notice of Right to Claim Excess Proceeds PDFs (2019-2025)',
    notes: 'Uses Bid4Assets for auctions. Contact: 530-233-6223',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Shasta',
    state: 'CA',
    listUrl: 'https://www.shastacounty.gov/tax-collector/page/excess-proceeds',
    source: 'Dedicated excess proceeds page with claim forms',
    notes: 'One of the best-organized CA county pages for excess proceeds.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Fresno',
    state: 'CA',
    listUrl: 'https://www.fresnocountyca.gov/Departments/Auditor-Controller-Treasurer-Tax-Collector/Property-Tax-Information/Tax-Sale-Excess-Proceeds',
    source: 'Dedicated page with direct PDF excess proceed lists',
    notes: 'Has direct PDF links. Managed by Auditor-Controller/Treasurer-Tax Collector',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Trinity',
    state: 'CA',
    listUrl: 'https://www.trinitycounty.org/438/Treasurer-Tax-Collector',
    source: 'Tax Sale Excess Proceeds Claim Form PDFs',
    notes: 'Board approves distribution annually. Uses GovEase. Contact: 530-623-1251',
    rulesText: 'CA Rev & Tax Code §4675. Board of Supervisors approves distribution annually.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Inyo',
    state: 'CA',
    listUrl: 'https://inyocounty.us/sites/default/files/Excess%20Proceeds%20Publication.pdf',
    source: 'Direct PDF of excess proceeds publication',
    notes: '14 real properties confirmed. Published quarterly',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Los Angeles',
    state: 'CA',
    listUrl: 'https://ttc.lacounty.gov/notice-of-excess-proceeds/',
    source: 'Dedicated page with multiple year EP listings and claim forms',
    notes: 'EP listings for 2024A, 2024B, 2025A, 2025B. Claim form, assignment form, agent auth form, checklist PDFs. Room 130, 225 N Hill St, LA 90012. Phone: 213-974-7245',
    rulesText: 'CA Rev & Tax Code §4675. No fee to file claim.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'San Diego',
    state: 'CA',
    listUrl: 'https://www.sdttc.com/content/ttc/en/tax-collection/property-tax-sales/excess-proceeds.html',
    source: 'Dedicated excess proceeds page with filing instructions PDF',
    notes: 'Excess must exceed $150 after liens/fees. Filing instructions PDF available. Phone: 619-531-5708',
    rulesText: 'CA Rev & Tax Code §4675. Assignment requires dated written instrument with disclosure.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Orange',
    state: 'CA',
    listUrl: 'https://octreasurer.gov/property-tax/property-tax-auction/excess-proceeds',
    source: 'Dedicated excess proceeds page',
    notes: 'Claims mailed to OC Treasurer-Tax Collector, PO Box 1438, Santa Ana, CA 92702-1438. 90-day wait if multiple claims.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Sacramento',
    state: 'CA',
    listUrl: 'https://finance.saccounty.gov/Tax/Pages/ExcessProceeds-TaxSale_FAQs.aspx',
    source: 'Dedicated FAQ page with claim forms and EP list PDFs',
    notes: 'No charge to file. May 2025 + May 2024 claim form PDFs. 90-day dispute period after recommended distribution.',
    rulesText: 'CA Rev & Tax Code §4675. Requires original recorded document + calculation.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'San Bernardino',
    state: 'CA',
    listUrl: 'https://www.sbcountyatc.gov/tax-collector/tax-sale/excess-proceeds',
    source: 'Dedicated excess proceeds page',
    notes: '$271 listing fee per County Fee Ordinance. Under Auditor-Controller/Treasurer/Tax Collector',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Santa Clara',
    state: 'CA',
    listUrl: 'https://dtac.sccgov.org/services/property-taxes/public-auction-tax-defaulted-properties',
    source: 'Auction page with EP notice PDFs',
    notes: 'Notice of Right to Claim PDF (Oct 2025). DTAC publications page has forms. Contact DTAC.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Contra Costa',
    state: 'CA',
    listUrl: 'https://www.contracosta.ca.gov/5675/Excess-Proceeds-Policy-and-Forms',
    source: 'Dedicated policy & forms page with claim, assignment, and probate forms',
    notes: 'Claim form, assignment form, probate affidavit PDFs. 625 Court St, Room 100, Martinez. Uses Premium Bid Method.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'San Joaquin',
    state: 'CA',
    listUrl: 'https://www.sjgov.org/department/ttc/tax/redemption/public-auction',
    source: 'Public auction page with March 2025 EP forms, notice, and list PDFs',
    notes: '44 N. San Joaquin St, 1st Floor, Suite 150, Stockton 95202. Phone: 209-468-2133, tax@sjgov.org. Uses Bid4Assets.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'San Mateo',
    state: 'CA',
    listUrl: 'https://www.smcgov.org/tax/excess-proceeds',
    source: 'Dedicated excess proceeds page',
    notes: 'Excess must exceed $150. Contact Tax Collector: 866-220-0308',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Stanislaus',
    state: 'CA',
    listUrl: 'https://www.stancounty.com/tr-tax/auction/excess-proceeds.shtm',
    source: 'Dedicated page with policy PDF, available EP list, rights page',
    notes: 'Policy PDF + available EP list PDF + rights of parties page. Unclaimed goes to taxing agencies after 1 year. Contact: 209-525-6388',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Sonoma',
    state: 'CA',
    listUrl: 'https://sonomacounty.gov/administrative-support-and-fiscal-services/auditor-controller-treasurer-tax-collector/divisions/revenue-accounting/tax-defaulted-property-auctions',
    source: 'Tax auction hub + policy PDF + claim form PDF',
    notes: 'Fiscal Policy T-1 covers EP claims. Distribution via Board agenda items. Contact: taxcollector@sonomacounty.gov, 707-565-2281',
    rulesText: 'CA Rev & Tax Code §4675. Claims processing begins after 1-year holding period.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Napa',
    state: 'CA',
    listUrl: 'https://www.napacounty.gov/2536/Excess-Proceeds',
    source: 'Dedicated excess proceeds page with policy + claim form PDFs',
    notes: 'Contact: Tax Collector 707-253-4311, Treasurer 707-253-4320. 1195 Third St, Suite 108, Napa 94559',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Solano',
    state: 'CA',
    listUrl: 'https://www.solanocounty.com/depts/ttcc/tax_collector/tax_sale/excess_proceeds.asp',
    source: 'Dedicated excess proceeds page',
    notes: 'Under Treasurer-Tax Collector-County Clerk. Next auction May 5-7, 2026',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Butte',
    state: 'CA',
    listUrl: 'https://www.buttecounty.net/1041/Tax-Auction-Excess-Proceeds',
    source: 'Dedicated page with claim form PDF + notice publication PDF',
    notes: '25 County Center Drive, Suite 125, Oroville. Phone: 530-552-3720',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'El Dorado',
    state: 'CA',
    listUrl: 'https://www.eldoradocounty.ca.gov/County-Government/County-Departments/Auditor-Controller/Property-Tax/Tax-Sale-Excess-Proceeds',
    source: 'Dedicated Tax Sale Excess Proceeds page',
    notes: 'Contact Auditor-Controller Property Tax Division: 530-621-5470 ext 4, AuditorPropertyTaxDivision@edcgov.us',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Madera',
    state: 'CA',
    listUrl: 'https://www.maderacounty.com/government/treasurer-tax-collector/property-tax/defaulted-taxes/excess-proceeds',
    source: 'Dedicated excess proceeds page with claim packet',
    notes: 'Has excess proceeds claim packet with deadlines and policy document.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Merced',
    state: 'CA',
    listUrl: 'https://co.merced.ca.us/3964/Excess-Proceeds-Results',
    source: 'Dedicated excess proceeds results page',
    notes: 'Shows results/amounts of excess proceeds distributions.',
    rulesText: 'CA Rev & Tax Code §4675. 1-year claim period.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Sutter',
    state: 'CA',
    listUrl: 'https://www.suttercounty.org/government/county-departments/treasurer-tax-collector/prior-tax-sale-archives',
    source: 'Excess proceeds archive page',
    notes: '463 2nd Street, Suite 112, Yuba City 95991. Phone: 530-822-7117',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Glenn',
    state: 'CA',
    listUrl: 'https://www.countyofglenn.net/resources/property-forms/claim-excess-proceeds',
    source: 'Claim form page + excess proceeds list PDF',
    notes: 'Claim form PDF + March 18 EP list PDF available. Has auction publications page.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Humboldt',
    state: 'CA',
    listUrl: 'https://humboldtgov.org/295/Public-Auction-Information',
    source: 'Auction page with EP notice + claim form PDFs',
    notes: 'Claims processed 1 year after sale, Board of Supervisors approval, then 90-day waiting period.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Siskiyou',
    state: 'CA',
    listUrl: 'https://www.siskiyoucounty.gov/treasurer-taxcollector/page/tax-sale-auction',
    source: 'Tax sale page with 2025 excess proceeds list PDF',
    notes: 'Jennifer Taylor, Treasurer-Tax Collector. 311 Fourth Street, Room 104, Yreka 96097. Phone: 530-842-8340',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'San Luis Obispo',
    state: 'CA',
    listUrl: 'https://www.slocounty.ca.gov/departments/auditor-controller-treasurer-tax-collector-public/forms-documents/legal-notices-and-press-releases/notice-of-right-to-claim-excess-proceeds',
    source: 'Notice of Right to Claim page + PDF + auction page',
    notes: 'Under Auditor-Controller-Treasurer-Tax Collector',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Santa Cruz',
    state: 'CA',
    listUrl: 'https://www.santacruzcountyca.gov/Departments/TaxCollector/PropertyTaxSale.aspx',
    source: 'Tax sale page with EP amounts PDF + notice PDF',
    notes: 'Multiple PDF lists under Public Notices section.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Lake',
    state: 'CA',
    listUrl: 'https://publicworks.lakecountyca.gov/1109/Tax-Collector',
    source: 'Tax collector page with excess proceeds notice PDFs',
    notes: 'Multiple auction publication PDFs available.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Lassen',
    state: 'CA',
    listUrl: 'https://www.lassencounty.org/dept/treasurertax-collector/treasurertax-collector-main',
    source: 'Treasurer/Tax Collector main page with EP PDF',
    notes: 'May 2025 Tax Sale EP PDF available. Taya Short, Treasurer/Tax Collector. 220 S. Lassen St, Suite 3, Susanville 96130',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Imperial',
    state: 'CA',
    listUrl: 'https://treasurer-taxcollector.imperialcounty.org/tax-collector/',
    source: 'Tax collector page with claim form + instructions PDF',
    notes: '$200 fee for administering claims per R&T Code 4674. Contact: 442-265-1250, taxcollector@co.imperial.ca.us',
    rulesText: 'CA Rev & Tax Code §4675. $200 admin fee per claim.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Nevada',
    state: 'CA',
    listUrl: 'https://www.nevadacountyca.gov/957/Auction-Property-Tax-Sale',
    source: 'Auction page with published EP notice PDFs by year',
    notes: 'Nov 2023, Nov 2022 published notices available.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Tehama',
    state: 'CA',
    listUrl: 'https://www.tehama.gov/government/departments/treasurer-tax-collector/tax-sale-auctions/',
    source: 'Tax sale auctions page with claim form + notice PDFs',
    notes: 'Excess Proceeds List and Blank Claim Form & Instructions available.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Tuolumne',
    state: 'CA',
    listUrl: 'https://www.tuolumnecounty.ca.gov/850/Tax-Sales',
    source: 'Tax sales page with estimated proceeds 2025 PDF',
    notes: 'Claim Form for Excess Proceeds available. Claims within 1 year of recording.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Yuba',
    state: 'CA',
    listUrl: 'https://www.yuba.gov/departments/treasurer-tax_collector/auction_information.php',
    source: 'Auction info page + EP policy & procedures PDF',
    notes: 'R&T Code 4675.1 authorized TTC + County Counsel to make determinations. 1-year deadline.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Alameda',
    state: 'CA',
    listUrl: 'https://treasurer.acgov.org/tax-defaulted-land/',
    source: 'Tax-defaulted land page + claim form PDF',
    notes: 'Claim form PDF at acgov.org/clerk/forms/claimexcess.pdf (filed through Clerk of Board). 1221 Oak St, Room 131, Oakland 94612. Phone: 510-272-6800',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'San Francisco',
    state: 'CA',
    listUrl: 'https://sftreasurer.org/property/auction',
    source: 'Tax auction page (EP info embedded)',
    notes: 'Excess must exceed $150. 1-year claim window. Also has Unclaimed Funds page at sftreasurer.org/unclaimed-funds.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Marin',
    state: 'CA',
    listUrl: 'https://www.marincounty.gov/departments/finance/property-tax/tax-defaulted-land-sales',
    source: 'Tax defaulted land sales page + EP notice PDFs',
    notes: 'Contact: 415-473-6133',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Monterey',
    state: 'CA',
    listUrl: 'https://www.countyofmonterey.gov/government/departments-i-z/treasurer-tax-collector/public-notices',
    source: 'Public notices page with EP listings + auction page',
    notes: '168 W. Alisal Street, 1st Floor, Salinas. Phone: 831-755-5057',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Placer',
    state: 'CA',
    listUrl: 'https://www.placer.ca.gov/1427/Tax-Land-Sale',
    source: 'Tax Land Sale page + EP FAQ + unclaimed funds page',
    notes: 'Distribution docs posted to Board of Supervisors agendas. Also: placer.ca.gov/1486/Unclaimed-Funds. Contact: 530-889-4120',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Plumas',
    state: 'CA',
    listUrl: 'https://www.plumascounty.us/3055/Property-Tax-Sale',
    source: 'Property Tax Sale page',
    notes: '520 Main Street Room 203, Quincy 95971. Phone: 530-283-6260',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Del Norte',
    state: 'CA',
    listUrl: 'https://www.co.del-norte.ca.us/departments/TaxCollector/TaxSale',
    source: 'Tax sale page (EP info embedded)',
    notes: '981 H Street, Suite 150, Crescent City. Phone: 707-464-7283',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Kings',
    state: 'CA',
    listUrl: 'https://www.countyofkingsca.gov/departments/administration/finance-department/tax-collector/delinquent-taxes/tax-sale',
    source: 'Tax sale page (EP forms at TTC office)',
    notes: 'Claim forms at countyofkings.com or at Tax Collector Office, 1400 W. Lacey Blvd',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Mendocino',
    state: 'CA',
    listUrl: 'https://www.mendocinocounty.gov/government/collections/treasurer-tax-collector/tax-defaulted-property-auction',
    source: 'Tax-defaulted property auction page',
    notes: 'EP forms released with auctions. Under Treasurer-Tax Collector / Collections',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Santa Barbara',
    state: 'CA',
    listUrl: 'https://www.countyofsb.org/820/Defaulted-Tax-Sales',
    source: 'Defaulted Tax Sales page',
    notes: 'Forms page at countyofsb.org/2573/Forms may contain EP claim forms.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Ventura',
    state: 'CA',
    listUrl: 'https://venturacounty.gov/ttc/current-auction/',
    source: 'Tax auction page (no dedicated EP page)',
    notes: 'Prior auctions at venturacounty.gov/ttc/prior-auctions/. Contact: 805-654-3744, Tax.Collector@venturacounty.gov',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Yolo',
    state: 'CA',
    listUrl: 'https://www.yolocounty.gov/government/general-government-departments/financial-services/property-tax',
    source: 'Property tax page (EP via tax collector)',
    notes: 'Uses Premium Bid Method. Contact Tax Collector: 530-666-8625',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'San Benito',
    state: 'CA',
    listUrl: 'https://www.sanbenitocountyca.gov/departments/treasurer-tax-collector-and-public-administrator/tax-collector/internet-auction-of-tax-defaulted-property/schedule-of-upcoming-auctions/notice-of-auction-or-sale-copy',
    source: 'Notice of excess proceeds page',
    notes: 'TTC Melinda L. Casillas. 1131 San Felipe Road, Hollister 95023. Phone: 831-636-4043',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },

  // --- Already-tracked CA counties with updated data ---
  {
    name: 'Tulare',
    state: 'CA',
    listUrl: 'https://tularecounty.ca.gov/treasurertaxcollector/tax-collector/tax-auction',
    source: 'Tax auction hub with per-year EP sub-pages',
    notes: 'Sub-pages per year. Unclaimed monies: /treasurer/unclaimed-monies. Contact: Taxhelp@tularecounty.ca.gov, 877-736-9055',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Kern',
    state: 'CA',
    listUrl: 'https://www.kerncounty.com/services/property-land-and-taxes/property-tax-portal/tax-defaulted-property-sales',
    source: 'Report of Sale + claim form PDF',
    notes: 'Claim form at kcttc.co.kern.ca.us/Forms/. Treasurer-Tax Collector: Jordan Kaufman',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Colusa',
    state: 'CA',
    listUrl: 'https://www.countyofcolusaca.gov/753/Sale-of-Tax-Defaulted-Property',
    source: 'Tax defaulted property sale page with claim instructions',
    notes: 'Instructions doc available. Contact: 530-458-0440, 547 Market St Suite 111, Colusa 95932',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Amador',
    state: 'CA',
    listUrl: 'https://www.amadorcounty.gov/government/treasurer-tax-collector/publications',
    source: 'Publications page with notices + claim form/checklist',
    notes: 'Uses Bid4Assets. Contact: 209-223-6364, 810 Court St, Jackson 95642',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Riverside',
    state: 'CA',
    listUrl: 'https://countytreasurer.org/tax-collector/tax-sale-information',
    source: 'Tax sale info via countytreasurer.org',
    notes: 'Tax sale results at /tax-sale-results. EP via Board of Supervisors. Contact: 951-955-3900',
    rulesText: 'CA Rev & Tax Code §4675 (tax), CA Civil Code §2924k (foreclosure)',
    claimDeadline: '1 year from deed recording (tax), 30 days post-notice (foreclosure)',
  },
  {
    name: 'Alpine',
    state: 'CA',
    listUrl: 'https://alpinecountyca.gov/353/Treasurer-Tax-Collector',
    source: 'Treasurer-Tax Collector (contact only)',
    notes: 'No dedicated EP page. Pop ~1100. Contact: 530-694-2286, 99 Water St, Markleeville 96120',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Sierra',
    state: 'CA',
    listUrl: 'https://www.sierracounty.ca.gov/314/Property-Tax-Sales',
    source: 'Tax sales page (no dedicated EP page)',
    notes: 'Auction via GovEase. Pop ~3200',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },
  {
    name: 'Calaveras',
    state: 'CA',
    listUrl: 'https://taxcollector.calaverasgov.us/Auctions',
    source: 'Auctions page (EP published post-sale)',
    notes: 'Contact CalaverasTaxSales@gmail.com. Uses Bid4Assets.',
    rulesText: 'CA Rev & Tax Code §4675.',
    claimDeadline: '1 year from deed recording',
  },

  // ═══════════════════════════════════════════════════════════════
  // FLORIDA (FL) — 9 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sumter',
    state: 'FL',
    listUrl: 'https://www.sumterclerk.com/surplus-funds-list',
    source: 'Clerk of Courts surplus funds list (two PDFs)',
    notes: 'Registry & Foreclosure Sales Surplus + Tax Deed Sales Surplus. Contact Finance: 352-569-6600',
    rulesText: 'FL Statute §45.032 (foreclosure) and §197.582 (tax deed).',
    claimDeadline: '90 days after auction',
  },
  {
    name: 'Osceola',
    state: 'FL',
    listUrl: 'https://courts.osceolaclerk.com/reports/TaxDeedsSurplusFundsAvailableWeb.pdf',
    source: 'Clerk of Court live PDF report (updated 3/11/2026)',
    notes: 'Tax deed surplus. Per FL Stat 197.582, 120-day claim window from notice; 1-year hold then escheats to state.',
    rulesText: 'FL Statute §197.582. 120-day claim window from notice.',
    claimDeadline: '120 days from notice; 1 year hold',
  },
  {
    name: 'Polk',
    state: 'FL',
    listUrl: 'https://www.polkclerkfl.gov/280/Surplus-Funds-List',
    source: 'Clerk of Court surplus funds web page',
    notes: 'Report dated 1/30/2026. Tax deed surplus list.',
    rulesText: 'FL Statute §197.582.',
    claimDeadline: '120 days from notice',
  },
  {
    name: 'Volusia',
    state: 'FL',
    listUrl: 'https://www.clerk.org/pdf/user_publish/TaxDeeds/Tax_Deed_Surplus_List.pdf',
    source: 'Clerk of Court 30-page PDF (updated 2/28/2026)',
    notes: 'Includes certificate #, deposit amount, fees (3% or 1.5%), balance. Contact: 386-736-5919',
    rulesText: 'FL Statute §197.582.',
    claimDeadline: '120 days from notice',
  },
  {
    name: 'Brevard',
    state: 'FL',
    listUrl: 'https://www.brevardclerk.us/tax-deed-surplus',
    source: 'Clerk of Court tax deed surplus web page',
    notes: 'Pre-12/17/2020 (TributeWeb) and post-12/17/2020 (RealTDM) separate lists. Contact: 321-637-2007, taxdeedclerks@brevardclerk.us',
    rulesText: 'FL Statute §197.582.',
    claimDeadline: '120 days from notice',
  },
  {
    name: 'Highlands',
    state: 'FL',
    listUrl: 'https://www.highlandsclerkfl.gov/clerk_to_the_board/tax_deeds/surplus.php',
    source: 'Clerk of Court surplus web page',
    notes: 'Pre-Jan 2026 at TributeWeb; post-Jan 2026 at highlands.realtdm.com. Contact: 863-402-6586',
    rulesText: 'FL Statute §197.582.',
    claimDeadline: '120 days from notice',
  },
  {
    name: 'Collier',
    state: 'FL',
    listUrl: 'https://www.collierclerk.com/finance/accounting/unclaimed-monies/',
    source: 'Clerk of Court unclaimed monies web page',
    notes: 'Combined list (Clerk, Board of County Commissioners, Tax Deed). Over $8.9M outstanding. Searchable at apps.collierclerk.com. Contact: 239-252-2646',
    rulesText: 'FL Statute §45.032 and §197.582.',
    claimDeadline: '120 days from notice',
  },
  {
    name: 'Sarasota',
    state: 'FL',
    listUrl: 'https://www.sarasotaclerk.com/e-services/online-property-auctions/tax-deed-services/surplus-tax-deed-funds',
    source: 'Clerk of Court surplus tax deed funds page',
    notes: 'Search via sarasota.realtdm.com for "Surplus Balance" type. 120-day claim window; 1-year hold.',
    rulesText: 'FL Statute §197.582.',
    claimDeadline: '120 days from notice',
  },
  {
    name: 'Marion',
    state: 'FL',
    listUrl: 'https://www.marioncountyclerk.org/departments/records-recording/tax-deeds-and-lands-available-for-taxes/unclaimed-funds/',
    source: 'Clerk of Court unclaimed funds web page',
    notes: 'Tax deed surplus list updated weekly. Surplus not posted until ~30 days after sale.',
    rulesText: 'FL Statute §197.582.',
    claimDeadline: '120 days from notice',
  },
  {
    name: 'Okaloosa',
    state: 'FL',
    listUrl: 'https://okaloosaclerk.com/board-services/tax-deed-sales/tax-deed-surplus/',
    source: 'Clerk of Court tax deed surplus page',
    notes: 'Updated after each sale date. Contact: taxdeeds@okaloosaclerk.com',
    rulesText: 'FL Statute §197.582.',
    claimDeadline: '120 days from notice',
  },

  // ═══════════════════════════════════════════════════════════════
  // TEXAS (TX) — 4 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Loving',
    state: 'TX',
    listUrl: 'https://www.claimittexas.gov/',
    source: 'TX state unclaimed property portal (no county website)',
    notes: 'Pop ~120, smallest TX county. No county website exists.',
    rulesText: 'TX Tax Code §34.04. Excess held by district clerk court registry for 2 years.',
    claimDeadline: '2 years from tax sale',
  },
  {
    name: 'Galveston',
    state: 'TX',
    listUrl: 'https://www.galvestoncountytx.gov/our-county/district-clerk/excess-proceeds',
    source: 'District Clerk excess proceeds page with monthly lists',
    notes: 'Monthly EP lists organized by month/year. Must file petition within 2 years. Contact: 409-770-5230',
    rulesText: 'TX Tax Code §34.04. Must file petition within 2 years of sale date.',
    claimDeadline: '2 years from tax sale',
  },
  {
    name: 'Fort Bend',
    state: 'TX',
    listUrl: 'https://www.fortbendcountytx.gov/government/departments/fort-bend-county-district-clerks-office/research-resource-information/excess-proceeds-report',
    source: 'District Clerk excess proceeds report page',
    notes: 'Downloadable PDF report includes receipt date, case #, style.',
    rulesText: 'TX Tax Code §34.04.',
    claimDeadline: '2 years from tax sale',
  },
  {
    name: 'Tarrant',
    state: 'TX',
    listUrl: 'https://www.tarrantcountytx.gov/content/dam/main/law-library/pdfs/updated-forms-2024/Excess_Funds.pdf',
    source: 'Law Library form PDF (must request list via open records)',
    notes: 'Email openrecords@tarrantcountytx.gov specifying month/year. Motion to Distribute Excess Funds form available.',
    rulesText: 'TX Tax Code §34.04.',
    claimDeadline: '2 years from tax sale',
  },

  // ═══════════════════════════════════════════════════════════════
  // GEORGIA (GA) — 7 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'DeKalb',
    state: 'GA',
    listUrl: 'https://dekalbtax.org/wp-content/uploads/Excess-Funds-List.pdf',
    source: 'Tax Commissioner PDF (updated 3/6/2026)',
    notes: 'Includes parcel ID, excess amount, sale date, owner name. 5-year hold before escheat to GA DOR.',
    rulesText: 'GA O.C.G.A. §48-4-5. 5-year hold before transfer to GA DOR Unclaimed Property.',
    claimDeadline: '5 years from tax sale',
  },
  {
    name: 'Gwinnett',
    state: 'GA',
    listUrl: 'https://www.gwinnetttaxcommissioner.com/property-tax/tax-sale-excess-funds',
    source: 'Tax Commissioner excess funds page with claim packet',
    notes: 'Mail claims to Robin Cook, PO Box 372, Lawrenceville, GA 30046.',
    rulesText: 'GA O.C.G.A. §48-4-5.',
    claimDeadline: '5 years from tax sale',
  },
  {
    name: 'Chatham',
    state: 'GA',
    listUrl: 'https://tax.chathamcountyga.gov/ExcessFunds',
    source: 'Tax Commissioner excess funds page',
    notes: 'Savannah area. Email: excessfunds@chathamcounty.org. 5-year deadline then goes to GA DOR.',
    rulesText: 'GA O.C.G.A. §48-4-5.',
    claimDeadline: '5 years from tax sale',
  },
  {
    name: 'Hall',
    state: 'GA',
    listUrl: 'https://hallcountytax.org/property/excess-funds/',
    source: 'Tax Commissioner excess funds page with PDF list',
    notes: 'PDF list (most recent 11/7/2025) includes sale date, buyer, map code, original owner, address, excess amount.',
    rulesText: 'GA O.C.G.A. §48-4-5.',
    claimDeadline: '5 years from tax sale',
  },
  {
    name: 'Henry',
    state: 'GA',
    listUrl: 'https://henrycountytax.com/239/EXCESS-FUNDS',
    source: 'Tax Collector excess funds page',
    notes: 'Must file motion in Civil Court to claim. PDF list available.',
    rulesText: 'GA O.C.G.A. §48-4-5.',
    claimDeadline: '5 years from tax sale',
  },
  {
    name: 'Athens-Clarke',
    state: 'GA',
    listUrl: 'https://www.accgov.com/3910/Excess-Funds',
    source: 'Tax Commissioner excess funds page',
    notes: 'Written claim via Excess Funds Request Form mailed to PO Box 1768, Athens, GA 30603.',
    rulesText: 'GA O.C.G.A. §48-4-5.',
    claimDeadline: '5 years from tax sale',
  },

  // ═══════════════════════════════════════════════════════════════
  // ARIZONA (AZ) — 3 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Maricopa',
    state: 'AZ',
    listUrl: 'https://treasurer.maricopa.gov/',
    source: 'Treasurer / Superior Court',
    notes: 'List includes trustor name, deposit date, case #, balance. Application at superiorcourt.maricopa.gov/llrc/civil_cvep1/. Presumed abandoned after 2 years.',
    rulesText: 'ARS §33-812. Presumed abandoned after 2 years with no pending application.',
    claimDeadline: '2 years from sale',
  },
  {
    name: 'Mohave',
    state: 'AZ',
    listUrl: 'https://www.mohave.gov/departments/treasurer/general-use/excess-proceeds-list/',
    source: 'Treasurer excess proceeds list page with direct PDF',
    notes: 'Phone: 928-753-0737. Abandoned after 2 years with no pending application.',
    rulesText: 'ARS §33-812.',
    claimDeadline: '2 years from sale',
  },
  {
    name: 'Pima',
    state: 'AZ',
    listUrl: 'https://www.to.pima.gov/excessProceeds/',
    source: 'Treasurer excess proceeds page with application packet PDF',
    notes: 'Tucson area. Application packet available.',
    rulesText: 'ARS §33-812.',
    claimDeadline: '2 years from sale',
  },

  // ═══════════════════════════════════════════════════════════════
  // OHIO (OH) — 4 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Montgomery',
    state: 'OH',
    listUrl: 'https://mcclerkofcourts.org/Downloads/Excess-Funds.pdf',
    source: 'Clerk of Courts PDF (updated 2/1/2026)',
    notes: 'Lists foreclosure cases with excess funds from sheriff sales.',
    rulesText: 'ORC §2329.44. Surplus payable to judgment debtor.',
    claimDeadline: 'Contact Clerk of Courts',
  },
  {
    name: 'Franklin',
    state: 'OH',
    listUrl: 'https://clerk.franklincountyohio.gov/onlineResources/Obtain-Excess-Funds-in-Foreclosure-Cases',
    source: 'Clerk of Courts excess funds page',
    notes: 'Columbus area. Must contact assigned judge staff. Phone: 614-525-3600',
    rulesText: 'ORC §2329.44.',
    claimDeadline: 'Contact Clerk of Courts',
  },
  {
    name: 'Cuyahoga',
    state: 'OH',
    listUrl: 'https://cuyahogacounty.gov/coc/excess-funds',
    source: 'Clerk of Courts excess funds page',
    notes: 'Cleveland area. Also unclaimed funds at cuyahogacounty.gov/sheriff/unclaimed-funds. Phone: 216-443-7982',
    rulesText: 'ORC §2329.44.',
    claimDeadline: 'Contact Clerk of Courts',
  },
  {
    name: 'Butler',
    state: 'OH',
    listUrl: 'https://auditor.bcohio.gov/finance/excess_proceeds_unclaimed_funds/index.php',
    source: 'County Auditor excess proceeds + unclaimed funds page',
    notes: 'Separate EP List and Unclaimed Funds List. 130 High St, 4th Floor, Hamilton, OH 45011',
    rulesText: 'ORC §2329.44.',
    claimDeadline: 'Contact County Auditor',
  },

  // ═══════════════════════════════════════════════════════════════
  // MICHIGAN (MI) — 3 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Oakland',
    state: 'MI',
    listUrl: 'https://www.oakgov.com/government/oakland-county-treasurer-s-office/property-taxes/property-tax-foreclosure-surplus-claims',
    source: 'Treasurer surplus claims page',
    notes: 'Rafaeli v Oakland County (2020) ruling. Submit notarized Intent to Claim form. Phone: 248-858-0611. Also oakgov.com/claims.',
    rulesText: 'MCL §211.78t. File motion Feb 1 - May 15.',
    claimDeadline: 'Feb 1 - May 15 (Circuit Court motion)',
  },
  {
    name: 'Wayne',
    state: 'MI',
    listUrl: 'https://www.waynecountymi.gov/Government/Elected-Officials/Treasurer/Property-Tax-Information/Forfeited-Property-List-with-Interested-Parties',
    source: 'Treasurer forfeited property page',
    notes: 'Detroit area. $3.8M+ returned as of Jan 2026. ~5,600 properties eligible from 2015-2020. Claim via WayneCountyForeclosureClaims.com or 833-421-8123.',
    rulesText: 'MCL §211.78t. File motion Feb 1 - May 15 in Circuit Court.',
    claimDeadline: 'Feb 1 - May 15 (Circuit Court motion)',
  },
  {
    name: 'Macomb',
    state: 'MI',
    listUrl: 'https://www.macombgov.org/departments/treasurers-office/tax-foreclosure/auction-and-claims',
    source: 'Treasurer auction and claims page',
    notes: 'Must file Form 5743 (Notice of Intention) with Treasurer by July 1 post-foreclosure.',
    rulesText: 'MCL §211.78t. Form 5743 by July 1, then motion Feb 1 - May 15.',
    claimDeadline: 'Form 5743 by July 1; motion Feb 1 - May 15',
  },

  // ═══════════════════════════════════════════════════════════════
  // MARYLAND (MD) — 2 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Carroll',
    state: 'MD',
    listUrl: 'https://www.carrollcountymd.gov/government/directory/comptroller/collectionstaxes/surplus-funds-list/',
    source: 'Comptroller HTML table of surplus funds',
    notes: '40 property entries totaling $67,983.98. 225 N Center St, Westminster 21157. Phone: 410-386-2400',
    rulesText: 'MD Tax-Property Article §14-820.',
    claimDeadline: 'Contact Comptroller',
  },
  {
    name: 'Montgomery',
    state: 'MD',
    listUrl: 'https://www.montgomerycountymd.gov/Finance/Resources/Files/Tax_Sale_Surplus_Funds.pdf',
    source: 'Finance Dept PDF (updated 2/26/2026)',
    notes: 'Excel export includes parcel #, address, tax sale date, surplus amount. Request via MC311 or 240-777-0311. 27 Courthouse Square, Suite 200, Rockville 20850',
    rulesText: 'MD Tax-Property Article §14-820.',
    claimDeadline: 'Contact Finance Dept',
  },

  // ═══════════════════════════════════════════════════════════════
  // NEW YORK (NY) — 2 counties
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sullivan',
    state: 'NY',
    listUrl: 'https://www.sullivanny.gov/Departments/Treasurer/Foreclosures',
    source: 'Treasurer foreclosures + surplus forms page',
    notes: 'Annual surplus forms at /SurplusForms. Claim packet PDF available.',
    rulesText: 'NY RPTL Article 11, Title 6, §1197.',
    claimDeadline: 'Per county surplus forms',
  },
  {
    name: 'Chemung',
    state: 'NY',
    listUrl: 'https://www.chemungcountyny.gov/1372/Claiming-Foreclosure-Surplus-Funds',
    source: 'County foreclosure surplus funds page',
    notes: 'Claim form packet and required legal documents available. Must have correct Lien Year and Index Number.',
    rulesText: 'NY RPTL Article 11, Title 6, §1197.',
    claimDeadline: 'Per county process',
  },

  // ═══════════════════════════════════════════════════════════════
  // COLORADO (CO) — 1 county
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Douglas',
    state: 'CO',
    listUrl: 'https://www.douglas.co.us/treasurer/unclaimed-funds/',
    source: 'Treasurer unclaimed funds page',
    notes: 'Tax overpayments and Public Trustee overages. $5.5M in unclaimed overbids since 2017. 3-year claim window.',
    rulesText: 'CO law: 1 year for tax overpayments to Great Colorado Payback; 6 months for Public Trustee overages.',
    claimDeadline: '3 years (no fee cap)',
  },
];

async function main() {
  console.log(`Updating ${COUNTY_URLS.length} counties with verified URLs...`);

  let updated = 0;
  let created = 0;
  let errors = 0;
  for (const county of COUNTY_URLS) {
    try {
      const result = await prisma.county.upsert({
        where: { name_state: { name: county.name, state: county.state } },
        update: {
          listUrl: county.listUrl,
          source: county.source,
          notes: county.notes,
          rulesText: county.rulesText,
          claimDeadline: county.claimDeadline,
        },
        create: {
          rank: 99,
          name: county.name,
          state: county.state,
          population: 0,
          listUrl: county.listUrl,
          source: county.source,
          notes: county.notes,
          rulesText: county.rulesText,
          claimDeadline: county.claimDeadline,
        },
      });
      console.log(`  ✓ ${result.name}, ${result.state}`);
      updated++;
    } catch (e) {
      console.error(`  ✗ ${county.name}, ${county.state}: ${e}`);
      errors++;
    }
  }

  console.log(`\nDone! Updated ${updated} counties. Errors: ${errors}`);

  // Summary by state
  const states = new Map<string, number>();
  for (const c of COUNTY_URLS) {
    states.set(c.state, (states.get(c.state) || 0) + 1);
  }
  console.log('\nBy state:');
  for (const [state, count] of [...states.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${state}: ${count} counties`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
