import { chromium, Browser } from "playwright";

let browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    console.log("🚀 Launching browser...");
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    console.log("🛑 Browser closed");
  }
}
