import { chromium, type Page } from 'playwright';

const origin = 'http://127.0.0.1:4173';
const base = '/portfolio/';
const routes = [
  '',
  'lab/',
  'projects/sumlume/',
  'projects/pathlife/',
  'projects/physio-ai/',
  'projects/pawlife/',
  'projects/portfolio/',
];
const viewports = [
  { name: 'small-mobile', width: 360, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'wide', width: 1920, height: 1080 },
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
  emptyAlt: string[];
  insecureBlankLinks: string[];
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
};

async function settle(page: Page) {
  await page.evaluate(async () => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 28));
    }
  });
  await page.waitForTimeout(180);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
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

      const response = await page.goto(`${origin}${base}${route}`, { waitUntil: 'networkidle' });
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
          emptyAlt: images.filter((image) => !image.hasAttribute('alt')).map((image) => image.src),
          insecureBlankLinks: [
            ...document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'),
          ]
            .filter((link) => !link.rel.includes('noopener'))
            .map((link) => link.href),
        };
      });

      results.push({
        route: route || 'home',
        viewport: `${viewport.name}-${viewport.width}`,
        theme,
        ...report,
        consoleErrors,
        pageErrors,
        failedRequests,
      });

      if (theme === 'dark' && route === '' && (viewport.width === 390 || viewport.width === 1440)) {
        await page.screenshot({ path: `review/v3-after-${viewport.width}.png`, fullPage: false });
      }
      await page.close();
    }
    await context.close();
  }
}

const interactionContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
await interactionContext.addInitScript(() => localStorage.setItem('nm-theme', 'dark'));
const interactionPage = await interactionContext.newPage();

await interactionPage.goto(`${origin}${base}`, { waitUntil: 'networkidle' });
await interactionPage.getByRole('button', { name: /open navigation/i }).click();
const menuOpened = await interactionPage
  .getByRole('navigation', { name: /main navigation/i })
  .isVisible();
await interactionPage.keyboard.press('Escape');
const menuClosed =
  (await interactionPage
    .getByRole('button', { name: /open navigation/i })
    .getAttribute('aria-expanded')) === 'false';

const selectedProject = interactionPage.getByRole('tab', { name: /sumlume/i });
await selectedProject.focus();
await interactionPage.keyboard.press('ArrowRight');
const constellationKeyboard = await interactionPage
  .getByRole('tab', { name: /pathlife/i })
  .getAttribute('aria-selected');

await interactionPage.locator('#skills').scrollIntoViewIfNeeded();
await interactionPage.getByRole('button', { name: 'TypeScript', exact: true }).click();
const skillEvidenceUpdated = await interactionPage
  .getByRole('heading', { name: 'TypeScript', exact: true })
  .isVisible();

await interactionPage.goto(`${origin}${base}projects/sumlume/`, { waitUntil: 'networkidle' });
await interactionPage
  .getByRole('button', { name: /open .* full size/i })
  .first()
  .click();
const lightboxOpened = await interactionPage.getByRole('dialog').isVisible();
await interactionPage.keyboard.press('ArrowRight');
await interactionPage.keyboard.press('Escape');
const lightboxClosed = (await interactionPage.getByRole('dialog').count()) === 0;

await interactionPage.goto(`${origin}${base}lab/`, { waitUntil: 'networkidle' });
await interactionPage.getByRole('button', { name: 'Tile 1, number 4' }).click();
await interactionPage.getByRole('button', { name: 'Tile 2, number 6' }).click();
const puzzleMatch = await interactionPage.getByText(/4 and 6 cleared/i).isVisible();
await interactionPage.getByRole('tab', { name: /random forest/i }).click();
const pipelineSelection = await interactionPage
  .getByRole('tab', { name: /random forest/i })
  .getAttribute('aria-selected');
await interactionPage.locator('input[type="range"]').fill('74');
const poseRange = await interactionPage.locator('input[type="range"]').inputValue();

await interactionContext.close();
await browser.close();

const failures = results.filter(
  (result) =>
    result.overflow > 0 ||
    result.brokenImages.length > 0 ||
    result.h1 !== 1 ||
    result.emptyAlt.length > 0 ||
    result.insecureBlankLinks.length > 0 ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedRequests.length > 0,
);

const interactions = {
  menuOpened,
  menuClosed,
  constellationKeyboard: constellationKeyboard === 'true',
  skillEvidenceUpdated,
  lightboxOpened,
  lightboxClosed,
  puzzleMatch,
  pipelineSelection: pipelineSelection === 'true',
  poseRange: poseRange === '74',
};

console.log(
  JSON.stringify(
    {
      checks: results.length,
      failures,
      interactions,
      titles: [...new Set(results.map((result) => result.title))],
    },
    null,
    2,
  ),
);

if (failures.length > 0 || Object.values(interactions).some((value) => !value)) {
  process.exitCode = 1;
}
