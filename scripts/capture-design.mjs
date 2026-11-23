import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const site = process.env.PORTFOLIO_QA_URL ?? 'http://127.0.0.1:4173/portfolio/';
const stage = process.env.REVIEW_PREFIX ?? 'after';
const output = process.env.REVIEW_OUTPUT ?? 'review/portfolio-v4';
const theme = process.env.REVIEW_THEME === 'dark' ? 'dark' : 'light';
const routes = (
  process.env.REVIEW_ROUTES ??
  ',projects/pathlife/,projects/sumlume/,projects/physio-ai/,projects/pawlife/,projects/portfolio/,projects/co2-tracker/,projects/hospital-appointment-system/,lab/'
).split(',');
const viewports = [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PORTFOLIO_CHROME });
const pages = [];

try {
  for (const viewport of viewports) {
    const mobile = viewport.width === 390;
    const context = await browser.newContext({
      viewport,
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: 'reduce',
      colorScheme: theme,
    });
    for (const route of routes) {
      const page = await context.newPage();
      const slug = route.split('/').filter(Boolean).at(-1) ?? 'home';
      const response = await page.goto(new URL(route, site).href);
      assert.ok(response?.ok(), `${route}: HTTP ${response?.status()}`);
      await page.locator('main h1').waitFor();
      await page.evaluate(() => document.fonts.ready);

      async function capture(fullPage) {
        await page.evaluate(async (full) => {
          const visible = [...document.images].filter(
            (img) =>
              img.getClientRects().length &&
              (full || img.getBoundingClientRect().top < innerHeight),
          );
          await Promise.race([
            Promise.all(
              visible.map((img) => {
                img.loading = 'eager';
                return img.decode().catch(() => {});
              }),
            ),
            new Promise((resolve) => setTimeout(resolve, 3500)),
          ]);
        }, fullPage);
        const filename = `${stage}-${slug}${fullPage ? '-full' : ''}-${viewport.width}${theme === 'dark' ? '-dark' : ''}.webp`;
        await sharp(await page.screenshot({ animations: 'disabled', fullPage }))
          .webp({ quality: fullPage ? 84 : 88 })
          .toFile(`${output}/${filename}`);
      }

      await capture(false);
      if (!route && theme === 'light') await capture(true);
      const metrics = await page.evaluate(() => ({
        h1: document.querySelector('main h1')?.textContent,
        documentHeight: document.documentElement.scrollHeight,
        workTop: Math.round(document.getElementById('work')?.getBoundingClientRect().top ?? 0),
      }));
      pages.push({ slug, ...viewport, theme, status: response.status(), ...metrics });
      console.log(`${stage} ${viewport.width} ${slug}`);
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  `${output}/${stage}-routes${theme === 'dark' ? '-dark' : ''}.json`,
  JSON.stringify({ site, pages }, null, 2) + '\n',
);
