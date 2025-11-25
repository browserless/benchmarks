import puppeteer from 'puppeteer-core';
import 'dotenv/config';

const URL = process.env.URL;
const TOTAL = +process.env.TOTAL;

const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

export default async (setup, teardown, provider) => {
  let browserVersion = null;
  const stats = {
    connected: [],
    pages: [],
    navigate: [],
  };

  async function benchmark() {
    const params = await setup();
    const { browserWSEndpoint } = params;
    const browserStart = Date.now();
    const browser = await puppeteer.connect({
      browserWSEndpoint,
    });
    stats.connected.push(Date.now() - browserStart);

    // Capture browser version on first run
    if (!browserVersion) {
      browserVersion = await browser.version();
    }

    const pageStart = Date.now();
    const page = await browser.newPage();
    stats.pages.push(Date.now() - pageStart);

    const navigateStart = Date.now();
    await page.goto(URL);
    stats.navigate.push(Date.now() - navigateStart);

    await page.close();
    await browser.close();
    await teardown(params);
  }

  for (let i = 0; i < TOTAL; i++) {
    await benchmark();
  }

  // Log provider and browser version
  console.log('\n=== Test Configuration ===');
  console.log(`Provider: ${provider}`);
  console.log(`Browser Version: ${browserVersion}`);
  console.log(`Total Executions : ${TOTAL}`);
  console.log(`URL: "${URL}"`);
  console.log('==========================\n');

  console.table([
    {
      Metrics: 'Connection',
      Average: average(stats.connected),
      Fastest: Math.min(...stats.connected),
      Slowest: Math.max(...stats.connected),
    },
    {
      Metrics: 'Page Creation',
      Average: average(stats.pages),
      Fastest: Math.min(...stats.pages),
      Slowest: Math.max(...stats.pages),
    },
    {
      Metrics: 'Navigation',
      Average: average(stats.navigate),
      Fastest: Math.min(...stats.navigate),
      Slowest: Math.max(...stats.navigate),
    },
  ]);
}
