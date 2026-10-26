import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type Page } from 'playwright';
import sharp from 'sharp';

const pawLifeUrl = process.env.PAWLIFE_URL ?? 'http://127.0.0.1:8085';
const outputDirectory = path.resolve('public/assets/pawlife');

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
  await page.waitForTimeout(900);
}

async function capture(page: Page, filename: string) {
  await settle(page);
  const pngPath = path.join(outputDirectory, filename);
  await page.screenshot({ path: pngPath, animations: 'disabled' });

  const webpPath = pngPath.replace(/\.png$/i, '.webp');
  await sharp(pngPath)
    .resize({ width: 1179, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(webpPath);

  const metadata = await sharp(pngPath).metadata();
  console.log(`Captured ${filename} (${metadata.width}×${metadata.height})`);
}

async function click(page: Page, name: string | RegExp) {
  const control = page.getByRole('button', { name }).first();
  await control.scrollIntoViewIfNeeded();
  await control.click();
  await page.waitForTimeout(350);
}

async function createMaple(page: Page) {
  await click(page, /begin a new life/i);

  const goldenRetriever = page.getByRole('radio', { name: /Golden Retriever/i });
  await goldenRetriever.scrollIntoViewIfNeeded();
  await goldenRetriever.click();
  await click(page, /^Continue$/i);

  const nameInput = page.getByRole('textbox', { name: 'Pet name' });
  await nameInput.fill('Maple');
  await click(page, /^Continue$/i);

  const lovedAtHome = page.getByRole('radio', { name: /Loved at home/i });
  await lovedAtHome.scrollIntoViewIfNeeded();
  await lovedAtHome.click();

  const happySoul = page.getByRole('radio', { name: /The Happy Soul/i });
  await happySoul.scrollIntoViewIfNeeded();
  await happySoul.click();

  const loving = page.getByRole('radio', { name: /^Loving\./i });
  await loving.scrollIntoViewIfNeeded();
  await loving.click();

  await click(page, /Open this life story/i);
  await click(page, /Begin Maple's life/i);
  await page.getByText('Maple', { exact: true }).first().waitFor();
}

async function capturePawLife() {
  await mkdir(outputDirectory, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
  });
  const page = await context.newPage();

  try {
    await page.goto(pawLifeUrl, { waitUntil: 'domcontentloaded' });
    await createMaple(page);
    await capture(page, '01-home.png');

    await click(page, /Answer Maple's signal/i);
    await capture(page, '04-event.png');

    // React Native Web does not expose the nested story-card label to Chromium's
    // accessibility tree, so click the first visible choice card in the viewport.
    await page.mouse.click(196, 280);
    await page.waitForTimeout(450);

    await click(page, /Return to Maple and see what changed/i);
    await click(page, /Tug of War/i);
    const timedMode = page.getByRole('button', { name: /Use timed motion mode/i });
    if (await timedMode.isVisible().catch(() => false)) await timedMode.click();
    await click(page, /Start Tug of War/i);
    await page.waitForTimeout(550);
    await capture(page, '02-minigame.png');
    await click(page, /Exit minigame/i);

    await click(page, /Back to Home/i);
    await click(page, /Open Life Album/i);
    // The custom tab row is visual-only in React Native Web's accessibility
    // tree. Select the visible Scores tab at the top of the 393px viewport.
    await page.mouse.click(225, 65);
    await page.waitForTimeout(350);
    await capture(page, '05-achievements.png');
  } finally {
    await browser.close();
  }
}

capturePawLife().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
