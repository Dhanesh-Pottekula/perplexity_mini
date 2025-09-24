import { getBrowser } from "../configs/playWrite";
import { TaskQueue } from "../configs/pQueue";

const scrapeQueue = new TaskQueue(10); // run max 10 scrapes at once

export async function scrapeWebsite(url: string) {
  const browser = await getBrowser();
  console.log("waiting in queue:", scrapeQueue.size);
  console.log("running in queue:", scrapeQueue.pending);
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const title = await page.title();
    const content = await page.evaluate(() => document.body.innerText);
    const links = await page.$$eval("a", anchors =>
      anchors.map(a => a.href).filter(href => href)
    );
    
    return { content, links, title };


  } finally {
    await page.close(); // Always close the page
  }
}

export function getCleanContent(content: string) {
  return content.replace(/<[^>]*>?/g, '').trim();
}



export async function ScrapeWebsiteEnqueue(url: string) {
  try {
   
    const result = await scrapeQueue.add(() => scrapeWebsite(url));
    return result; // { content, links, title }
  } catch (err) {
    console.error("Failed to scrape", url, err);
    throw err; // rethrow so caller knows it failed
  }
}
