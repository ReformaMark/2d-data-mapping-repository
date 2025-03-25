'use server';

import axios from "axios";
import * as cheerio from "cheerio";
import { PdfReader } from 'pdfreader';

const products = ['LOCAL COMMERCIAL RICE', 'Carrot (Karot)', 'Eggplant (Talong)', 'Corn (White)', 'Corn (Yellow)', 'Tomato'];

export async function scrapeAndExtractPrices() {
  const url = 'https://www.da.gov.ph/price-monitoring/';

  try {
    // Fetch the webpage HTML
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract PDF links from the page
    const pdfLinks = $("#tablepress-65 tbody tr.row-2 td.column-1 a[href$='.pdf']")
      .map((_, el) => $(el).attr("href"))
      .get();

    if (!pdfLinks.length) {
      console.warn("No PDF links found.");
      return { success: false, message: 'No PDF links found!' };
    }

    const pdfUrl = pdfLinks[0]; // Get the latest PDF link
    console.log(`Reading PDF from: ${pdfUrl}`);

    // Extract date from PDF URL
    const dateMatch = pdfUrl.match(/(\w+)-(\d+)-(\d{4})\.pdf$/);
    let date = '';
    if (dateMatch) {
      const [_, month, day, year] = dateMatch;
      date = `${month} ${day}, ${year}`;
    }

    // Fetch the PDF file
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    let items: string[] = [];


    // Parse PDF
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

    // Extract prices
    products.forEach(product => {
      if (product === 'LOCAL COMMERCIAL RICE') {
        const riceCategories = ["Special", "Premium", "Well Milled", "Regular Milled"];
        riceCategories.forEach(category => {
          const index = items.findIndex(item => item.includes(category));
          if (index !== -1) {
            const lowPrice = items[index + 1] || '';
            const highPrice = items[index + 3] || '';
            const validHighPrice = isNaN(Number(highPrice)) ? lowPrice : highPrice;
            priceInfoList.push({ product: `${category} Rice`, range: `₱ ${lowPrice} - ₱ ${validHighPrice}` });
          }
        });
      } else {
        const index = items.findIndex(item => item.includes(product));
        if (index !== -1) {
          const lowPrice = items[index + 1] || '';
          const highPrice = items[index + 3] || '';
          const validHighPrice = isNaN(Number(highPrice)) ? lowPrice : highPrice;
          priceInfoList.push({ product, range: `₱ ${lowPrice} - ₱ ${validHighPrice}` });
        }
      }
    });

    console.log(priceInfoList);
    return { success: true, pdfLinks, data: priceInfoList, date };

  } catch (error) {
    console.error('Scraping Error:', error);
    return { success: false, message: 'Scraping failed!', error: (error as Error).message };
  }
}
