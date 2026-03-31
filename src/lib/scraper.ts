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
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { success: false, funds: [], error: `HTTP ${response.status}` };
    }

    const buffer = await response.arrayBuffer();
    // Dynamic import of pdfjs-dist to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    const funds: FundEntry[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const lines = content.items
        .map((item: { str?: string }) => item.str || '')
        .join(' ')
        .split(/\n|\r\n/);

      for (const line of lines) {
        // Heuristic: lines with addresses or amounts
        if (line.match(/\d{3,}/) && line.length > 10) {
          funds.push({ property: line.trim() });
        }
      }
    }

    return { success: true, funds };
  } catch (error) {
    return {
      success: false,
      funds: [],
      error: error instanceof Error ? error.message : 'PDF parse failed',
    };
  }
}
