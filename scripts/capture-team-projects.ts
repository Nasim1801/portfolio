import { mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type BrowserContext, type Page } from 'playwright';
import sharp from 'sharp';

const co2TrackerUrl = process.env.CO2_TRACKER_URL ?? 'http://127.0.0.1:4180';
const outputDirectory = path.resolve('public/assets/co2-tracker');

async function settle(page: Page) {
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        });
      }),
    );
  });
  await page.waitForTimeout(750);
}

async function capture(page: Page, filename: string, maxWidth: number) {
  await settle(page);
  const pngPath = path.join(outputDirectory, filename);
  const rawPath = `${pngPath}.raw.png`;
  await page.screenshot({ path: rawPath, animations: 'disabled' });

  await sharp(rawPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(pngPath);
  await sharp(pngPath)
    .webp({ quality: 82, effort: 6 })
    .toFile(pngPath.replace(/\.png$/i, '.webp'));
  await unlink(rawPath);

  const metadata = await sharp(pngPath).metadata();
  console.log(`Captured ${filename} (${metadata.width}×${metadata.height})`);
}

async function createContext(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  options: Parameters<typeof browser.newContext>[0],
): Promise<BrowserContext> {
  return browser.newContext({
    colorScheme: 'light',
    reducedMotion: 'reduce',
    ...options,
  });
}

async function captureCo2Tracker() {
  await mkdir(outputDirectory, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const desktop = await createContext(browser, {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktop.newPage();
    await desktopPage.goto(co2TrackerUrl, { waitUntil: 'domcontentloaded' });
    await capture(desktopPage, '01-home.png', 2000);

    await desktopPage.goto(`${co2TrackerUrl}/customer`, { waitUntil: 'domcontentloaded' });
    await desktopPage.getByPlaceholder('Enter a Product Name').fill('Oat milk');
    await capture(desktopPage, '02-search.png', 2000);
    await desktop.close();

    const mobile = await createContext(browser, {
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(`${co2TrackerUrl}/customer`, { waitUntil: 'domcontentloaded' });
    await mobilePage.getByPlaceholder('Enter a Product Name').fill('Oat milk');
    await settle(mobilePage);
    const mobileFit = await mobilePage.evaluate(() => {
      const mainContent = document.querySelector('.customer-content');
      const bounds = mainContent?.getBoundingClientRect();
      return {
        viewportWidth: window.visualViewport?.width ?? window.innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        contentLeft: bounds?.left ?? 0,
        contentRight: bounds?.right ?? Number.POSITIVE_INFINITY,
        contentWidth: mainContent?.clientWidth ?? 0,
        contentScrollWidth: mainContent?.scrollWidth ?? Number.POSITIVE_INFINITY,
      };
    });
    const isResponsive =
      mobileFit.pageWidth <= mobileFit.viewportWidth + 1 &&
      mobileFit.contentLeft >= 0 &&
      mobileFit.contentRight <= mobileFit.viewportWidth + 1 &&
      mobileFit.contentScrollWidth <= mobileFit.contentWidth + 1;
    if (isResponsive) {
      await capture(mobilePage, '05-mobile.png', 1179);
    } else {
      console.log(
        `Skipped 05-mobile.png: the supplied front end is ${mobileFit.pageWidth}px wide at a ${mobileFit.viewportWidth}px viewport.`,
      );
    }
    await mobile.close();
  } finally {
    await browser.close();
  }
}

captureCo2Tracker().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
