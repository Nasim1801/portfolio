import { chromium, type Page } from 'playwright';

const origin = 'http://127.0.0.1:4173';
const base = '/portfolio/';
const routes = [
  '',
  'projects/sumlume/',
  'projects/pathlife/',
  'projects/physio-ai/',
  'projects/pawlife/',
];
const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'wide', width: 1600, height: 1000 },
];
const themes = ['light', 'dark'] as const;

type Check = {
  route: string;
  viewport: string;
  theme: string;
  overflow: number;
  images: number;
  brokenImages: string[];
  title: string;
  h1: number;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
};

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
  });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const results: Check[] = [];

for (const theme of themes) {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript((selectedTheme) => {
      localStorage.setItem('nm-theme', selectedTheme);
    }, theme);

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const failedRequests: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('requestfailed', (request) => {
        if (!request.url().includes('favicon')) {
          failedRequests.push(
            `${request.method()} ${request.url()} ${request.failure()?.errorText}`,
          );
        }
      });

      const response = await page.goto(`${origin}${base}${route}`, {
        waitUntil: 'networkidle',
      });
      if (!response?.ok()) pageErrors.push(`HTTP ${response?.status()} for ${route || 'home'}`);
      await settle(page);

      const report = await page.evaluate(() => {
        const images = [...document.images];
        return {
          overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          images: images.length,
          brokenImages: images
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
          title: document.title,
          h1: document.querySelectorAll('h1').length,
          theme: document.documentElement.dataset.theme,
        };
      });

      results.push({
        route: route || 'home',
        viewport: `${viewport.name}-${viewport.width}`,
        theme,
        overflow: report.overflow,
        images: report.images,
        brokenImages: report.brokenImages,
        title: report.title,
        h1: report.h1,
        consoleErrors,
        pageErrors,
        failedRequests,
      });

      if (route === '' && (viewport.width === 360 || viewport.width === 1280)) {
        await page.screenshot({
          path: `/private/tmp/portfolio-v2-${theme}-${viewport.width}.png`,
          fullPage: true,
        });
      }
      if (route === 'projects/sumlume/' && theme === 'light' && viewport.width === 1280) {
        await page.screenshot({
          path: '/private/tmp/portfolio-v2-sumlume-1280.png',
          fullPage: true,
        });
      }
      await page.close();
    }
    await context.close();
  }
}

const interactionContext = await browser.newContext({ viewport: { width: 360, height: 800 } });
const interactionPage = await interactionContext.newPage();
await interactionPage.goto(`${origin}${base}`, { waitUntil: 'networkidle' });
await interactionPage.getByRole('button', { name: /open navigation/i }).click();
const menuOpened = await interactionPage
  .getByRole('navigation', { name: /main navigation/i })
  .isVisible();
await interactionPage.keyboard.press('Escape');
const menuClosed = !(await interactionPage
  .getByRole('navigation', { name: /main navigation/i })
  .isVisible());
await interactionPage.goto(`${origin}${base}projects/sumlume/`, { waitUntil: 'networkidle' });
await interactionPage
  .locator('main')
  .evaluate((element) => element.scrollTo?.(0, element.scrollHeight));
await interactionPage
  .getByRole('button', { name: /open .* full size/i })
  .first()
  .click();
const lightboxOpened = await interactionPage.getByRole('dialog').isVisible();
await interactionPage.keyboard.press('ArrowRight');
await interactionPage.keyboard.press('Escape');
const lightboxClosed = (await interactionPage.getByRole('dialog').count()) === 0;
await interactionContext.close();
await browser.close();

const failures = results.filter(
  (result) =>
    result.overflow > 0 ||
    result.brokenImages.length > 0 ||
    result.h1 !== 1 ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedRequests.length > 0,
);

console.log(
  JSON.stringify(
    {
      checks: results.length,
      failures,
      interactions: { menuOpened, menuClosed, lightboxOpened, lightboxClosed },
      titles: [...new Set(results.map((result) => result.title))],
    },
    null,
    2,
  ),
);

if (failures.length > 0 || !menuOpened || !menuClosed || !lightboxOpened || !lightboxClosed) {
  process.exitCode = 1;
}
