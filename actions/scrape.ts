'use server';

import puppeteer from 'puppeteer';
import { PdfReader } from 'pdfreader';

const products = ['LOCAL COMMERCIAL RICE', 'Carrot (Karot)', 'Eggplant (Talong)', 'Corn (White)', 'Corn (Yellow)', 'Tomato'];

export async function scrapeAndExtractPrices() {
  const url = 'https://www.da.gov.ph/price-monitoring/';

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get PDF Links
    const pdfLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#tablepress-65 tbody tr.row-2 td.column-1 a[href$=".pdf"]'))
        .map(link => (link as HTMLAnchorElement).href);
    });

    if (!pdfLinks.length) {
      console.warn("No PDF links found.");
      await browser.close();
      return { success: false, message: 'No PDF links found!' };
    }

    const pdfUrl = pdfLinks[0];
    console.log(`Reading PDF from: ${pdfUrl}`);
    const response = await fetch(pdfUrl);
    console.log(response)
    // Extract date from PDF URL
    const dateMatch = pdfUrl.match(/(\w+)-(\d+)-(\d{4})\.pdf$/);
    let date = '';
    if (dateMatch) {
      const [_, month, day, year] = dateMatch;
      date = `${month} ${day}, ${year}`;
    }
   

    const buffer = Buffer.from(await response.arrayBuffer());
    let items: string[] = [];

    await new Promise((resolve, reject) => {
      new PdfReader().parseBuffer(buffer, (err, item) => {
        if (err) {
          console.error(err);
          reject(err);
        } else if (!item) {
          resolve(true); // End of PDF
        } else if (item.text) {
          items.push(item.text.trim());
        }
      });
    });

    let priceInfoList: { product: string; range: string }[] = [];

    products.forEach(product => {
      if (product === 'LOCAL COMMERCIAL RICE') {
        const riceCategories = ["Special", "Premium", "Well Milled", "Regular Milled"];
        riceCategories.forEach(category => {
          const index = items.findIndex(item => item.includes(category));
          if (index !== -1) {
            const lowPrice = items[index + 1] || '';
            const highPrice = items[index + 3] || '';
            priceInfoList.push({ product: `${category} Rice`, range: `₱ ${lowPrice} - ₱ ${highPrice}` });
          }
        });
      } else {
        const index = items.findIndex(item => item.includes(product));
        if (index !== -1) {
          const lowPrice = items[index + 1] || '';
          const highPrice = items[index + 3] || '';
          priceInfoList.push({ product, range: `₱ ${lowPrice} - ₱ ${highPrice}` });
        }
      }
    });

    console.log(priceInfoList);
    await browser.close();

    return { success: true, pdfLinks, data: priceInfoList, date };

  } catch (error) {
    console.error('Scraping Error:', error);
    return { success: false, message: 'Scraping failed!', error: (error as Error).message };
  }
}
