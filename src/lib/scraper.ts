import { FundEntry } from '@/types';

export interface ScraperResult {
  success: boolean;
  funds: FundEntry[];
  error?: string;
}

/**
 * Scrapes a county surplus funds list from a URL.
 * Uses puppeteer-core + @sparticuz/chromium for serverless compatibility.
 * Falls back gracefully if URL is not reachable.
 */
export async function scrapeCounty(url: string): Promise<ScraperResult> {
  // Dynamic imports to avoid bundling issues in Next.js
  let puppeteer: typeof import('puppeteer-core');
  let chromium: typeof import('@sparticuz/chromium').default;

  try {
    puppeteer = await import('puppeteer-core');
    chromium = (await import('@sparticuz/chromium')).default;
  } catch {
    return { success: false, funds: [], error: 'Scraper dependencies not available' };
  }

  const isPdf = url.toLowerCase().includes('.pdf');

  if (isPdf) {
    return scrapePdf(url);
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; SurplusFundsBot/1.0; +https://surplusfunds.app/bot)'
    );
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const funds = await page.evaluate(() => {
      const results: FundEntry[] = [];

      // Try table rows first
      const rows = Array.from(document.querySelectorAll('table tr'));
      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const entry: FundEntry = {
            property: cells[0]?.textContent?.trim() || '',
            amount: cells[1]?.textContent?.trim() || '',
            claimant: cells[2]?.textContent?.trim() || '',
            date: cells[3]?.textContent?.trim() || '',
          };
          if (entry.property) results.push(entry);
        }
      }

      return results;
    });

    return { success: true, funds };
  } catch (error) {
    return {
      success: false,
      funds: [],
      error: error instanceof Error ? error.message : 'Scrape failed',
    };
  } finally {
    await browser?.close();
  }
}

async function scrapePdf(url: string): Promise<ScraperResult> {
  // For MVP: download PDF and note it for manual review.
  // Full PDF parsing (pdfjs-dist) can be added later for heavier extraction.
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SurplusFundsBot/1.0' },
    });
    if (!response.ok) {
      return { success: false, funds: [], error: `HTTP ${response.status}` };
    }

    // Read as text — some county "PDFs" are actually HTML pages
    const text = await response.text();
    const funds: FundEntry[] = [];

    // If it's HTML disguised as PDF link, try to extract table data
    if (text.includes('<table') || text.includes('<html')) {
      const rows = text.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      for (const row of rows) {
        const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
        if (cells.length >= 2) {
          const strip = (html: string) => html.replace(/<[^>]+>/g, '').trim();
          funds.push({
            property: strip(cells[0]),
            amount: cells[1] ? strip(cells[1]) : undefined,
            claimant: cells[2] ? strip(cells[2]) : undefined,
          });
        }
      }
    }

    if (funds.length > 0) {
      return { success: true, funds };
    }

    // Actual binary PDF — return a placeholder noting download succeeded
    return {
      success: true,
      funds: [{ property: `PDF downloaded from ${url} — manual review needed` }],
    };
  } catch (error) {
    return {
      success: false,
      funds: [],
      error: error instanceof Error ? error.message : 'PDF fetch failed',
    };
  }
}
