import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, type Page } from 'playwright';

const site = process.env.PORTFOLIO_QA_URL ?? 'http://127.0.0.1:4173/portfolio/';
const output = process.env.PORTFOLIO_QA_OUTPUT ?? 'review/v4/after';
const routes = [
  '',
  'lab/',
  'projects/sumlume/',
  'projects/pathlife/',
  'projects/physio-ai/',
  'projects/pawlife/',
  'projects/portfolio/',
  'projects/co2-tracker/',
  'projects/hospital-appointment-system/',
];
const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
];
const failures: string[] = [];
const axePath = process.env.PORTFOLIO_AXE_PATH;
const browser = await chromium.launch({
  executablePath:
    process.env.PORTFOLIO_CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const result: { route: string; width: number; theme: string; images: number; resources: number }[] =
  [];

async function visit(page: Page, route = '') {
  const url = new URL(route, site).href;
  assert.ok((await page.goto(url, { waitUntil: 'load' }))?.ok(), url);
  await page.locator('main h1').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

try {
  await mkdir(output, { recursive: true });
  for (const theme of ['light', 'dark']) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport,
        colorScheme: theme as 'light' | 'dark',
        reducedMotion: 'reduce',
      });
      for (const route of routes) {
        const page = await context.newPage();
        const label = `${route || 'home'} at ${viewport.width}px (${theme})`;
        page.on('pageerror', (error) => failures.push(`${label}: ${error.message}`));
        page.on('response', (response) => {
          if (response.status() >= 400 && response.url().startsWith(site)) {
            failures.push(`${label}: HTTP ${response.status()} for ${response.url()}`);
          }
        });
        await visit(page, route);
        const metrics = await page.evaluate(async () => {
          const images = [...document.images].filter((image) => image.getClientRects().length);
          await Promise.all(
            images.map(async (image) => {
              image.loading = 'eager';
              await image.decode().catch(() => undefined);
            }),
          );
          return {
            images: images.length,
            missingImages: images
              .filter((image) => !image.naturalWidth || !image.hasAttribute('alt'))
              .map((image) => image.src),
            overflow: document.documentElement.scrollWidth - innerWidth,
            headings: document.querySelectorAll('h1').length,
            resources: performance.getEntriesByType('resource').length,
          };
        });
        if (metrics.overflow > 0 || metrics.headings !== 1 || metrics.missingImages.length) {
          failures.push(`${label}: ${JSON.stringify(metrics)}`);
        }
        result.push({
          route: route || 'Home',
          width: viewport.width,
          theme,
          images: metrics.images,
          resources: metrics.resources,
        });
        const slug = route.split('/').filter(Boolean).at(-1) || 'home';
        if (theme === 'light') {
          await page.screenshot({ path: `${output}/${slug}-${viewport.width}.png` });
        }
        if (axePath && (viewport.width === 390 || viewport.width === 1440)) {
          await page.addScriptTag({ path: axePath });
          const violations = await page.evaluate(async () => {
            const api = (
              window as unknown as {
                axe: {
                  run: () => Promise<{
                    violations: { id: string; nodes: { target: string[] }[] }[];
                  }>;
                };
              }
            ).axe;
            return (await api.run()).violations.map(({ id, nodes }) => ({
              id,
              elements: nodes.map((node) => node.target),
            }));
          });
          if (violations.length) failures.push(`${label}: axe ${JSON.stringify(violations)}`);
        }
        await page.close();
      }
      await context.close();
    }
  }

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await visit(page);
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await page.getByRole('tab', { name: 'Sumlume', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(
    await page.getByRole('tab', { name: 'PathLife', exact: true }).getAttribute('aria-selected'),
    'true',
  );
  await page.keyboard.press('End');
  assert.equal(
    await page.getByRole('tab', { name: 'PawLife', exact: true }).getAttribute('aria-selected'),
    'true',
  );
  await page.keyboard.press('Tab');
  assert.match(
    await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? ''),
    /PawLife case study/,
  );
  await page.getByRole('button', { name: 'TypeScript', exact: true }).click();
  assert.equal(
    await page.getByRole('heading', { name: 'TypeScript', exact: true }).isVisible(),
    true,
  );
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download CV', exact: true }).first().click();
  assert.equal((await download).suggestedFilename(), 'Nasim-Mosayebi-CV.pdf');
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');

  await visit(page, 'projects/sumlume/');
  await page.getByRole('button', { name: 'Next screenshot' }).click();
  assert.equal(
    await page
      .getByRole('button', { name: 'Show Home and progression' })
      .getAttribute('aria-current'),
    'true',
  );
  const viewerTrigger = page.getByRole('button', { name: /view full size/i });
  await viewerTrigger.click();
  const viewer = page.getByRole('dialog');
  assert.equal(await viewer.isVisible(), true);
  assert.equal(
    await viewer
      .getByRole('button', { name: 'Close screenshot' })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('ArrowRight');
  assert.match((await viewer.locator('img').getAttribute('alt')) ?? '', /Daily Challenge/);
  await page.keyboard.press('Escape');
  assert.equal(await viewer.isVisible(), false);
  assert.equal(await viewerTrigger.evaluate((el) => el === document.activeElement), true);

  await visit(page, 'lab/');
  await page.getByRole('button', { name: 'Tile 1, number 4' }).click();
  await page.getByRole('button', { name: 'Tile 2, number 6' }).click();
  assert.equal(await page.getByText(/4 and 6 cleared/i).isVisible(), true);
  await page.getByRole('tab', { name: /random forest/i }).click();
  assert.equal(
    await page.getByRole('tab', { name: /random forest/i }).getAttribute('aria-selected'),
    'true',
  );
  await page.locator('input[type="range"]').fill('74');
  assert.equal(await page.locator('input[type="range"]').inputValue(), '74');
  await context.close();
} finally {
  await browser.close();
  await writeFile(`${output}/checks.json`, JSON.stringify({ checks: result, failures }, null, 2));
  console.log(JSON.stringify({ checks: result.length, failures }, null, 2));
}

assert.deepEqual(failures, []);
