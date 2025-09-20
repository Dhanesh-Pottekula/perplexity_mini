import { getBrowser } from "../configs/playWrite";

export async function scrapeWebsite(url: string) {
  const browser = await getBrowser();
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