import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, type Page } from 'playwright';

const site = process.env.PORTFOLIO_QA_URL ?? 'http://127.0.0.1:4173/portfolio/';
const output = process.env.PORTFOLIO_QA_OUTPUT ?? 'review/qa';
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
  { width: 320, height: 680 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
];
const failures: string[] = [];
const require = createRequire(import.meta.url);
const axePath = process.env.PORTFOLIO_AXE_PATH ?? require.resolve('axe-core/axe.min.js');
const internalPages = new Map<string, { ids: string[]; links: string[] }>();
let internalLinksChecked = 0;
let axeScans = 0;
const cvName = 'Nasim-Mosayebi-CV.pdf';
const cvUrl = new URL(cvName, site).href;
// Uses Playwright's bundled Chromium unless PORTFOLIO_CHROME points at another browser.
const browser = await chromium.launch({ executablePath: process.env.PORTFOLIO_CHROME });
const result: { route: string; width: number; theme: string; images: number; resources: number }[] =
  [];

async function visit(page: Page, route = '') {
  const url = new URL(route, site).href;
  assert.ok((await page.goto(url, { waitUntil: 'load' }))?.ok(), url);
  await page.locator('main h1').waitFor();
  await page.locator('html[data-ready]').waitFor({ state: 'attached' });
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
        page.on('console', (message) => {
          if (message.type() === 'error') failures.push(`${label}: ${message.text()}`);
        });
        page.on('response', (response) => {
          if (response.status() >= 400 && response.url().startsWith(site)) {
            failures.push(`${label}: HTTP ${response.status()} for ${response.url()}`);
          }
        });
        await visit(page, route);
        assert.equal(
          await page.getByRole('link', { name: 'Nasim Mosayebi home', exact: true }).count(),
          1,
          `${label}: header home link must have an accessible name`,
        );
        const headerCv = await page
          .locator('header a[download]')
          .evaluate((link) => (link as HTMLAnchorElement).href);
        assert.equal(headerCv, cvUrl, `${label}: header CV URL`);
        const metrics = await page.evaluate(async () => {
          const images = [...document.images].filter((image) => image.getClientRects().length);
          await Promise.all(
            images.map(async (image) => {
              image.loading = 'eager';
              await image.decode().catch(() => undefined);
            }),
          );
          const brand = document
            .querySelector('header a[aria-label="Nasim Mosayebi home"]')
            ?.getBoundingClientRect();
          const menu = document
            .querySelector('header button[aria-controls]')
            ?.getBoundingClientRect();
          const covers = [...document.querySelectorAll('[data-project-artwork]')];
          const pipeline = document.querySelector('[aria-label="Physio-AI pipeline stages"]');
          const croppedArtwork = covers.flatMap((cover) => {
            const frame = cover.getBoundingClientRect();
            return [...cover.querySelectorAll('img')]
              .filter((image) => {
                const box = image.getBoundingClientRect();
                const original = image.naturalWidth / image.naturalHeight;
                const distorted = Math.abs(Math.log(box.width / box.height / original)) > 0.02;
                return (
                  distorted ||
                  box.top < frame.top - 1 ||
                  box.bottom > frame.bottom + 1 ||
                  box.left < frame.left - 1 ||
                  box.right > frame.right + 1
                );
              })
              .map((image) => image.getAttribute('src'));
          });
          return {
            mastheadSingleRow:
              !brand ||
              !menu ||
              !menu.height ||
              (menu.top < brand.bottom && brand.top < menu.bottom),
            images: images.length,
            missingImages: images
              .filter((image) => !image.naturalWidth || !image.hasAttribute('alt'))
              .map((image) => image.src),
            overflow: document.documentElement.scrollWidth - innerWidth,
            headings: document.querySelectorAll('h1').length,
            resources: performance.getEntriesByType('resource').length,
            covers: covers.length,
            croppedArtwork,
            pipelineOverflow: pipeline ? pipeline.scrollWidth - pipeline.clientWidth : 0,
          };
        });
        if (
          metrics.overflow > 0 ||
          metrics.headings !== 1 ||
          metrics.missingImages.length ||
          metrics.croppedArtwork.length ||
          metrics.pipelineOverflow > 1 ||
          (!route && metrics.covers !== 7) ||
          !metrics.mastheadSingleRow
        ) {
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
        if (theme === 'light' && viewport.width === 1440) {
          internalPages.set(
            page.url(),
            await page.evaluate(() => ({
              ids: Array.from(document.querySelectorAll('[id]'), ({ id }) => id),
              links: Array.from(
                document.querySelectorAll<HTMLAnchorElement>('a[href]'),
                ({ href }) => href,
              ),
            })),
          );
        }
        if (viewport.width === 390 || viewport.width === 1440) {
          await page.addScriptTag({ path: axePath });
          const violations = await page.evaluate(async () => {
            const api = (
              window as unknown as {
                axe: {
                  run: (options: { rules: Record<string, { enabled: boolean }> }) => Promise<{
                    violations: { id: string; nodes: { target: string[] }[] }[];
                  }>;
                };
              }
            ).axe;
            return (await api.run({ rules: { 'target-size': { enabled: true } } })).violations.map(
              ({ id, nodes }) => ({
                id,
                elements: nodes.map((node) => node.target),
              }),
            );
          });
          axeScans += 1;
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
  const origin = new URL(site).origin;
  const staticLinks = new Set<string>();
  for (const [source, { links }] of internalPages) {
    for (const href of new Set(links)) {
      const target = new URL(href);
      if (target.origin !== origin) continue;
      const fragment = target.hash.slice(1);
      target.hash = '';
      internalLinksChecked += 1;
      const destination = internalPages.get(target.href);
      if (destination) {
        if (fragment && !destination.ids.includes(decodeURIComponent(fragment))) {
          failures.push(`${source}: missing link target ${href}`);
        }
      } else if (target.href.startsWith(site) && /\.[a-z0-9]+$/i.test(target.pathname)) {
        staticLinks.add(target.href);
      } else {
        failures.push(`${source}: unknown internal page ${href}`);
      }
    }
  }
  for (const url of staticLinks) {
    const response = await context.request.get(url);
    if (!response.ok()) failures.push(`HTTP ${response.status()} for ${url}`);
    await response.dispose();
  }
  await visit(page);
  await page.keyboard.press('Tab');
  assert.equal(
    await page
      .getByRole('link', { name: 'Skip to content' })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Enter');
  assert.equal(
    await page.locator('#main-content').evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Tab');
  assert.equal(
    await page
      .getByRole('link', { name: 'View work', exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );

  const menu = page.locator('button[aria-controls="main-navigation"]');
  await menu.focus();
  await page.keyboard.press('Enter');
  const nav = page.getByRole('navigation', { name: 'Main' });
  assert.equal(await nav.isVisible(), true);
  assert.equal(
    await nav
      .getByRole('link', { name: 'Work', exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Tab');
  assert.equal(
    await nav
      .getByRole('link', { name: 'About', exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await menu.evaluate((el) => el === document.activeElement), true);

  // The evidence index exposes three stable, keyboard-operable case-study links.
  const projectIndex = page.getByRole('navigation', { name: 'Project index' });
  const projects = projectIndex.getByRole('list').getByRole('link');
  assert.deepEqual(
    await projects.evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    [
      '/portfolio/projects/pathlife/',
      '/portfolio/projects/sumlume/',
      '/portfolio/projects/physio-ai/',
    ],
  );
  await projects.first().focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/projects/pathlife/');
  assert.equal(await page.title(), 'PathLife Case Study | Nasim Mosayebi');
  await page.goBack();
  await page.getByRole('heading', { level: 1, name: 'Software engineer' }).waitFor();

  // Disclosure links route and move focus to the destination when staying on the home page.
  await menu.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#work');
  assert.ok(await page.locator('#work').evaluate((element) => element === document.activeElement));
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');

  // Skills link to the projects that prove them.
  assert.ok(
    (await page.locator('#skills a[href$="projects/physio-ai/"]').count()) > 0,
    'skills should link to Physio-AI',
  );

  // Skills inventory: locking a skill lights up the projects that prove it.
  const skill = page.getByRole('button', { name: 'React Native', exact: true });
  await skill.click();
  assert.equal(await skill.getAttribute('aria-pressed'), 'true');
  assert.equal(
    await page.locator('#skills a[data-lit]').evaluateAll((links) => links.length),
    2,
    'React Native should light up PathLife and PawLife',
  );
  await skill.click();
  assert.equal(await skill.getAttribute('aria-pressed'), 'false');

  const cvLinks = page.locator('a[download]');
  assert.equal(await cvLinks.count(), 3, 'header, hero and contact CV downloads');
  const expectedPdf = await readFile(new URL(`../public/${cvName}`, import.meta.url));
  const cvResponse = await context.request.get(cvUrl);
  assert.ok(cvResponse.ok());
  assert.match(cvResponse.headers()['content-type'] ?? '', /^application\/pdf\b/);
  assert.deepEqual(await cvResponse.body(), expectedPdf, 'served CV matches the working-tree PDF');
  for (const link of await cvLinks.all()) {
    assert.equal(await link.evaluate((anchor) => (anchor as HTMLAnchorElement).href), cvUrl);
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    assert.equal(download.suggestedFilename(), cvName);
    const saved = await download.path();
    assert.ok(saved);
    assert.deepEqual(await readFile(saved), expectedPdf);
  }
  const withoutJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await withoutJS.newPage();
  const published = 'https://nasim1801.github.io/portfolio/';
  const sitemap = await withoutJS.request.get(new URL('sitemap.xml', site).href);
  assert.ok(sitemap.ok());
  const sitemapUrls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    sitemapUrls.sort(),
    routes.map((route) => new URL(route, published).href).sort(),
  );
  for (const route of routes) {
    const canonical = new URL(route, published).href;
    assert.ok((await fallback.goto(new URL(route, site).href))?.ok());
    assert.equal(await fallback.locator('main h1:visible').count(), 1);
    assert.ok((await fallback.locator('main').innerText()).length > 200);
    assert.equal(await fallback.locator('link[rel="canonical"]').getAttribute('href'), canonical);
    assert.equal(
      await fallback.locator('meta[property="og:url"]').getAttribute('content'),
      canonical,
    );
    const image = await fallback.locator('meta[property="og:image"]').getAttribute('content');
    assert.ok(image?.startsWith(published));
    assert.equal(
      await fallback.locator('meta[name="twitter:image"]').getAttribute('content'),
      image,
    );
    const imageResponse = await withoutJS.request.get(
      new URL(image!.slice(published.length), site).href,
    );
    assert.ok(imageResponse.ok());
    assert.match(imageResponse.headers()['content-type'] ?? '', /^image\/png/);
    const imageBytes = await imageResponse.body();
    assert.equal(imageBytes.readUInt32BE(16), 1200);
    assert.equal(imageBytes.readUInt32BE(20), 630);
    const schema = JSON.parse(
      (await fallback.locator('script[type="application/ld+json"]').textContent()) ?? '',
    );
    assert.equal(schema.url, canonical);
    assert.ok((await fallback.locator('meta[name="description"]').getAttribute('content'))?.length);
    assert.equal(await fallback.getByRole('navigation', { name: 'Main' }).isVisible(), true);
    assert.equal(
      await fallback
        .locator('header a[download]')
        .evaluate((anchor) => (anchor as HTMLAnchorElement).href),
      cvUrl,
    );
    if (route.startsWith('projects/')) {
      const original = fallback.getByRole('link', { name: /^View full size/ });
      assert.match((await original.getAttribute('href')) ?? '', /\.webp$/);
      assert.ok(await fallback.locator('#architecture').isVisible());
    }
  }
  await fallback.goto(new URL('lab/', site).href);
  assert.equal(
    await fallback.getByText('The live controls require JavaScript.', { exact: false }).isVisible(),
    true,
  );
  assert.equal(await fallback.getByRole('button', { name: 'Reset board' }).isVisible(), false);
  await fallback.goto(new URL('404.html', site).href);
  assert.equal(await fallback.getByRole('heading', { name: 'Page unavailable' }).count(), 1);
  assert.equal(await fallback.locator('meta[name="robots"]').getAttribute('content'), 'noindex');
  await withoutJS.close();

  const interrupted = await context.newPage();
  await interrupted.route(/\/assets\/index-[^/]+\.js$/, (route) => route.abort());
  assert.ok((await interrupted.goto(site))?.ok());
  await interrupted.locator('html:not([data-js])').waitFor({ state: 'attached' });
  const staticNav = interrupted.getByRole('navigation', { name: 'Main' });
  assert.ok(await staticNav.isVisible(), 'failed entry module leaves mobile navigation visible');
  assert.equal(await interrupted.getByRole('button', { name: 'Open navigation' }).count(), 0);
  await staticNav.getByRole('link', { name: 'Work', exact: true }).click();
  assert.equal(new URL(interrupted.url()).hash, '#work');
  await interrupted.close();

  const publicCo2Source = 'https://github.com/Nasim1801/co2-tracker';
  const co2Link = (p: Page) => p.getByRole('link', { name: /^React prototype on GitHub/ });
  assert.equal(await co2Link(page).getAttribute('href'), publicCo2Source);
  await visit(page, 'projects/co2-tracker/');
  assert.equal(await co2Link(page).getAttribute('href'), publicCo2Source);
  for (const project of ['pathlife', 'sumlume', 'physio-ai', 'co2-tracker']) {
    await visit(page, `projects/${project}/`);
    await page.getByRole('link', { name: 'Engineering evidence', exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#architecture');
    assert.equal(
      await page.getByRole('heading', { name: 'Implementation evidence', exact: true }).count(),
      1,
    );
  }
  const academicResultContext = /one participant.*training and test rows.*same source rows/i;
  await visit(page, 'projects/physio-ai/');
  const physioSummary = page.locator('dl[aria-label="At a glance"]').getByText(/96\.23%/);
  await physioSummary.waitFor();
  assert.match(await physioSummary.innerText(), academicResultContext);
  assert.match(await page.locator('#verification').innerText(), /3,390.*7,153|7,153.*3,390/);
  const evaluationNote = page
    .getByRole('region', { name: 'Implementation evidence' })
    .getByText('96.23%', { exact: true })
    .locator('..');
  assert.match(await evaluationNote.innerText(), /reported academic frame accuracy/i);
  assert.match(await evaluationNote.innerText(), academicResultContext);
  await visit(page);
  await page.getByRole('button', { name: 'Toggle colour theme' }).click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');

  // Deep links use browser navigation and stay below the sticky masthead.
  for (const id of ['pathlife', 'work', 'contact']) {
    const deep = await context.newPage();
    await deep.goto(new URL(`#${id}`, site).href, { waitUntil: 'load' });
    const landing = await deep.evaluate((target) => {
      const section = document.getElementById(target);
      const heading = section?.querySelector('h2, h3')?.getBoundingClientRect();
      return {
        top: section?.getBoundingClientRect().top ?? -1,
        headingBottom: heading?.bottom ?? Infinity,
        screen: innerHeight,
        atBottom: Math.abs(scrollY + innerHeight - document.documentElement.scrollHeight) <= 2,
      };
    }, id);
    assert.ok(
      landing.top >= 64 &&
        (landing.top < 160 || (landing.atBottom && landing.headingBottom < landing.screen)),
      `#${id} deep link landed at ${JSON.stringify(landing)}`,
    );
    await deep.close();
  }

  await visit(page, 'projects/sumlume/');
  await page.getByRole('button', { name: 'Next screenshot' }).click();
  assert.equal(
    await page
      .getByRole('link', { name: 'Show Home and progression' })
      .getAttribute('aria-current'),
    'true',
  );
  const viewerTrigger = page.getByRole('link', { name: /view full size/i });
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

  await visit(page, 'projects/physio-ai/');
  await page.getByRole('link', { name: /view full size/i }).focus();
  await page.keyboard.press('Enter');
  const landscape = page.getByRole('dialog');
  await landscape.getByRole('button', { name: 'Zoom in' }).click();
  const screenshot = landscape.getByRole('region', { name: 'Screenshot' });
  assert.equal(await screenshot.getAttribute('data-zoomed'), 'true');
  await screenshot.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => (document.querySelector('[data-zoomed]')?.scrollLeft ?? 0) > 0);
  await landscape.getByRole('button', { name: 'Fit image' }).click();
  assert.equal(await screenshot.getAttribute('data-zoomed'), null);
  await page.keyboard.press('Escape');

  await visit(page);
  await page.getByRole('link', { name: 'Open PathLife screenshot gallery' }).press('Enter');
  await page.waitForURL('**/projects/pathlife/#screenshots');
  const pathGallery = page.getByRole('region', { name: 'PathLife screenshots' });
  await pathGallery.getByRole('link', { name: /View full size/ }).press('Enter');
  const portrait = page.getByRole('dialog');
  await portrait.getByRole('button', { name: 'Zoom in' }).click();
  assert.match(
    (await portrait.getByRole('link', { name: 'Open original' }).getAttribute('href')) ?? '',
    /dashboard\.webp$/,
  );
  const printViewport = portrait.getByRole('region', { name: 'Screenshot' });
  await printViewport.focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => (document.querySelector('[data-zoomed]')?.scrollTop ?? 0) > 0);
  await page.keyboard.press('Escape');
  assert.ok(
    await pathGallery
      .getByRole('link', { name: /View full size/ })
      .evaluate((el) => el === document.activeElement),
  );

  await visit(page, 'lab/');
  const demoPicker = page.getByRole('navigation', { name: 'Choose a demo' });
  await demoPicker.getByRole('link', { name: /PathLife/ }).press('Enter');
  await page.waitForURL('**/lab/#pathlife-demo');
  const life = page.getByRole('region', { name: 'PathLife', exact: true });
  await life.getByRole('button', { name: 'Start life' }).press('Enter');
  assert.ok(
    await life
      .getByRole('heading', { name: 'Your first step' })
      .evaluate((el) => el === document.activeElement),
  );
  await life.getByRole('button', { name: 'Enrol in training' }).click();
  assert.match(await life.getByRole('status').innerText(), /£400 for training/);
  await life.getByRole('button', { name: /Age Up/ }).click();
  assert.ok(await life.getByRole('heading', { name: 'The rent goes up' }).isVisible());
  await life.getByRole('button', { name: 'Move in with a friend' }).click();
  await life.getByRole('button', { name: /Age Up/ }).click();
  await life.getByRole('button', { name: 'Apply for the skilled role' }).click();
  assert.ok(await life.getByText(/Skilled employee.*Age 20/).isVisible());
  await life.getByRole('button', { name: /Age Up/ }).click();
  assert.ok(await life.getByRole('heading', { name: 'Three years complete' }).isVisible());
  await life.locator('summary').filter({ hasText: 'Life log' }).click();
  assert.ok(await life.getByText('Move in with a friend', { exact: false }).isVisible());
  await life.getByRole('button', { name: 'Restart PathLife' }).click();
  assert.ok(await life.getByRole('button', { name: 'Start life' }).isVisible());
  assert.ok(await life.getByText('£1,200', { exact: true }).isVisible());

  await demoPicker.getByRole('link', { name: /PawLife/ }).tap();
  await page.waitForURL('**/lab/#pawlife-demo');
  const paw = page.getByRole('region', { name: 'PawLife', exact: true });
  const care = (name: string) => paw.getByRole('button', { name, exact: true }).tap();
  assert.ok(await paw.getByRole('img', { name: /Bella on the rug/ }).isVisible());
  await care('Start care');
  await care('Feed');
  await care('Serve a warm meal');
  assert.ok(await paw.getByText('74%', { exact: true }).isVisible());
  assert.ok(await paw.getByText('Eating', { exact: true }).isVisible());
  await care('Next moment');
  await care('Play');
  await care('Throw the ball');
  assert.match(await paw.getByRole('status').innerText(), /bounds after the ball/);
  await care('Next moment');
  await care('Groom');
  await care('Gentle brush');
  assert.ok(await paw.getByText('Freshly groomed', { exact: true }).isVisible());
  await care('See the evening event');
  assert.ok(await paw.getByRole('heading', { name: 'A sudden thunderstorm' }).isVisible());
  await care('Sit with Bella');
  assert.match(await paw.getByRole('status').innerText(), /comes straight to you/);
  assert.ok(await paw.getByRole('heading', { name: 'Time to settle in' }).isVisible());
  await care('Restart PawLife');
  assert.ok(
    await paw
      .getByRole('heading', { name: 'Meet Bella' })
      .evaluate((el) => el === document.activeElement),
  );
  assert.ok(await paw.getByText('38%', { exact: true }).isVisible());
  await care('Start care');
  await care('Play');
  await care('Throw the ball');
  assert.ok(await paw.getByText('Tired', { exact: true }).isVisible());
  await care('Restart PawLife');

  await demoPicker.getByRole('link', { name: /Sumlume/ }).press('Enter');
  await page.waitForURL('**/lab/#sumlume-demo');
  const firstTile = page.getByRole('button', { name: 'Tile 1, number 4' });
  const secondTile = page.getByRole('button', { name: 'Tile 2, number 6' });
  await firstTile.focus();
  await page.keyboard.press('ArrowRight');
  assert.ok(await secondTile.evaluate((tile) => tile === document.activeElement));
  await secondTile.click();
  await page.getByRole('button', { name: 'Tile 3, number 7' }).click();
  assert.equal(await page.getByText(/That pair is not adjacent/).isVisible(), true);
  await page.getByRole('button', { name: 'Reset board' }).click();
  await firstTile.click();
  await secondTile.click();
  assert.equal(await page.getByText(/4 and 6 cleared/i).isVisible(), true);
  await page.waitForFunction(
    () => document.activeElement?.getAttribute('aria-label') === 'Tile 3, number 7',
  );
  await page.getByRole('button', { name: 'Reset board' }).click();
  assert.equal(await page.getByRole('button', { name: 'Tile 1, number 4' }).isVisible(), true);
  assert.equal(await page.getByRole('button', { name: 'Tile 2, number 6' }).isVisible(), true);
  await page.waitForFunction(
    () => document.activeElement?.getAttribute('aria-label') === 'Tile 1, number 4',
  );
  await demoPicker.getByRole('link', { name: /Physio-AI/ }).press('Enter');
  await page.waitForURL('**/lab/#physio-ai-demo');
  await page.getByRole('tab', { name: /random forest/i }).click();
  assert.equal(
    await page.getByRole('tab', { name: /random forest/i }).getAttribute('aria-selected'),
    'true',
  );
  const labAcademicResult = page.getByRole('tabpanel').getByText(/96\.23%/);
  assert.match(await labAcademicResult.innerText(), academicResultContext);
  await page.locator('input[type="range"]').fill('74');
  assert.equal(await page.locator('input[type="range"]').inputValue(), '74');
  await page.getByRole('button', { name: 'Reset pose demo' }).press('Enter');
  assert.equal(await page.locator('input[type="range"]').inputValue(), '58');
  assert.equal(await page.getByRole('tab', { selected: true }).getAttribute('id'), 'pose-stage-1');
  await context.close();
} finally {
  await browser.close();
  const coverage = { axeScans, internalLinksChecked };
  await writeFile(
    `${output}/checks.json`,
    JSON.stringify({ checks: result, ...coverage, failures }, null, 2),
  );
  console.log(JSON.stringify({ checks: result.length, ...coverage, failures }, null, 2));
}

assert.deepEqual(failures, []);
