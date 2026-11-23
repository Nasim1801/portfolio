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
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
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

  // Hero level select with reduced motion: first project, no rotation control, arrow keys work.
  assert.equal(
    await page.getByRole('tab', { name: 'PathLife', exact: true }).getAttribute('aria-selected'),
    'true',
  );
  assert.equal(await page.getByRole('button', { name: 'Pause project rotation' }).count(), 0);
  const ambientSet = () => page.locator('#top canvas').getAttribute('data-set');
  assert.equal(await ambientSet(), 'pathlife', 'reduced motion starts on the PathLife objects');
  await page.getByRole('tab', { name: 'PathLife', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(
    await page.getByRole('tab', { name: 'PawLife', exact: true }).getAttribute('aria-selected'),
    'true',
  );
  const selectedProject = page.getByRole('tabpanel').getByRole('link');
  await page.keyboard.press('Tab');
  assert.equal(await selectedProject.evaluate((el) => el === document.activeElement), true);
  assert.equal(await selectedProject.getAttribute('href'), '#pawlife');
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#pawlife');
  assert.equal(
    await page.locator('#pawlife').evaluate((el) => el === document.activeElement),
    true,
  );
  assert.equal(
    await ambientSet(),
    'pathlife',
    'reduced motion keeps the drifting objects fixed when the level changes',
  );
  assert.equal(
    await page.locator('#top button[aria-label^="Tile"]').count(),
    0,
    'the Make 10 board no longer lives in the hero',
  );

  // Make 10 demo inside the Sumlume project: 7 and 3 clear, 7 and 2 do not.
  await page.getByRole('button', { name: 'Tile 1, number 7' }).click();
  await page.getByRole('button', { name: 'Tile 2, number 2' }).click();
  assert.match(
    (await page.locator('#sumlume [aria-live="polite"]').textContent()) ?? '',
    /don’t match/,
  );
  await page.getByRole('button', { name: 'Tile 1, number 7' }).click();
  await page.getByRole('button', { name: 'Tile 9, number 3' }).click();
  assert.match(
    (await page.locator('#sumlume [aria-live="polite"]').textContent()) ?? '',
    /7 and 3 cleared/,
  );
  assert.equal(await page.getByRole('button', { name: 'Tile 1, cleared' }).count(), 1);
  await page.getByRole('button', { name: 'Tile 2, number 2' }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(
    await page.evaluate(() => document.activeElement?.getAttribute('aria-label')),
    'Tile 3, number 5',
  );

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
  const withoutJS = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await withoutJS.newPage();
  await fallback.goto(site);
  assert.equal(
    await fallback
      .getByRole('link', { name: 'Download CV (PDF)' })
      .evaluate((anchor) => (anchor as HTMLAnchorElement).href),
    cvUrl,
  );
  await withoutJS.close();

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
  const poseAnimation = page
    .getByRole('region', { name: 'Implementation evidence' })
    .getByText('96.23%', { exact: true })
    .locator('..');
  assert.match(await poseAnimation.innerText(), /reported academic frame accuracy/i);
  assert.match(await poseAnimation.innerText(), academicResultContext);
  await visit(page);
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');

  // Deep links must land on their section after the app renders.
  for (const id of ['pathlife', 'work', 'contact']) {
    const deep = await context.newPage();
    await deep.goto(new URL(`#${id}`, site).href, { waitUntil: 'load' });
    await deep.waitForTimeout(900);
    const top = await deep.evaluate(
      (target) => document.getElementById(target)?.getBoundingClientRect().top ?? -1,
      id,
    );
    assert.ok(top >= 0 && top < 160, `#${id} deep link landed at ${top}px`);
    await deep.close();
  }

  // With motion on: screenshots cycle and can be paused, nothing stays hidden after a jump
  // to the end of the page, and internal links change route in place.
  const lively = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const live = await lively.newPage();
  const liveErrors: string[] = [];
  live.on('pageerror', (error) => liveErrors.push(error.message));
  await visit(live);
  await live.waitForTimeout(1800);
  assert.equal(
    await live.evaluate(
      () => getComputedStyle(document.querySelector('main h1 span span')!).opacity,
    ),
    '1',
    'hero name should be visible after its entrance',
  );
  // The hero stage rotates on its own, can be paused, and its link lands on the project.
  await live.waitForFunction(
    () =>
      document
        .querySelector('[role="tab"][aria-selected="true"]')
        ?.textContent?.includes('Sumlume'),
    undefined,
    { timeout: 9000 },
  );
  // The drifting objects follow the level on the stage.
  await live.waitForFunction(
    () => document.querySelector('#top canvas')?.getAttribute('data-set') === 'sumlume',
    undefined,
    { timeout: 3000 },
  );
  await live.getByRole('button', { name: 'Pause project rotation' }).click();
  assert.equal(await live.getByRole('button', { name: 'Play project rotation' }).count(), 1);
  await live.getByRole('tab', { name: 'Sumlume', exact: true }).focus();
  await live.keyboard.press('ArrowRight');
  assert.equal(
    await live.getByRole('tab', { name: 'Physio-AI', exact: true }).getAttribute('aria-selected'),
    'true',
  );
  // The canvas follows a render later, so wait for it instead of reading it at once.
  await live.waitForFunction(
    () => document.querySelector('#top canvas')?.getAttribute('data-set') === 'physio-ai',
    undefined,
    { timeout: 3000 },
  );
  assert.equal(
    await live.locator('#contact canvas').getAttribute('data-set'),
    'mix',
    'the contact finale mixes all four sets',
  );
  const liveProject = live.getByRole('tabpanel').getByRole('link');
  await live.keyboard.press('Tab');
  assert.equal(await liveProject.evaluate((el) => el === document.activeElement), true);
  await live.keyboard.press('Enter');
  await live.waitForFunction(() => {
    const top = document.getElementById('physio-ai')?.getBoundingClientRect().top ?? -1;
    return top >= 0 && top < 160;
  });
  await live.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

  const pause = live.getByRole('button', { name: 'Pause PathLife screenshots' });
  await pause.scrollIntoViewIfNeeded();
  await pause.click();
  assert.equal(await live.getByRole('button', { name: 'Play PathLife screenshots' }).count(), 1);
  await live.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await live.waitForTimeout(1800);
  const hidden = await live.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter(
        (element) =>
          element.getBoundingClientRect().top < innerHeight &&
          getComputedStyle(element).opacity === '0',
      ).length,
  );
  assert.equal(hidden, 0, 'no revealed content may stay hidden at or above the viewport');
  await live.evaluate(() => {
    (window as unknown as { __sameDocument: boolean }).__sameDocument = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await live.getByRole('link', { name: /Read the case study for PathLife/ }).click();
  await live.getByRole('heading', { level: 1, name: 'PathLife' }).waitFor();
  assert.match(live.url(), /projects\/pathlife\/$/);
  assert.equal(
    await live.evaluate(() => (window as unknown as { __sameDocument?: boolean }).__sameDocument),
    true,
    'case study should open without a full page load',
  );
  assert.equal(await live.title(), 'PathLife Case Study | Nasim Mosayebi');
  await live.goBack();
  await live.getByRole('heading', { level: 1, name: 'Nasim Mosayebi' }).waitFor();
  assert.deepEqual(liveErrors, []);
  await lively.close();

  // Ambient objects: never overlapping, never inside a protected zone, and capped in number,
  // at a laptop width and on a very wide screen, in the hero and the contact section.
  for (const size of [
    { width: 1440, height: 900 },
    { width: 2560, height: 1440 },
  ]) {
    const wide = await browser.newContext({ viewport: size });
    // tsx keeps function names with a __name helper; provide it inside the page.
    await wide.addInitScript('window.__name = (fn) => fn;');
    const view = await wide.newPage();
    await visit(view);
    await view.waitForTimeout(1500);
    await view.mouse.move(size.width * 0.3, 120);
    await view.waitForTimeout(600);
    for (const section of ['#top', '#contact']) {
      const state = await view.evaluate((selector) => {
        type Box = { left: number; top: number; right: number; bottom: number };
        const canvas = document.querySelector(`${selector} canvas`) as HTMLCanvasElement & {
          ambient: { objects: () => Box[]; zones: () => Box[] };
        };
        const objects = canvas.ambient.objects();
        const zones = canvas.ambient.zones();
        const hit = (a: Box, b: Box) =>
          a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        let overlaps = 0;
        let inZone = 0;
        objects.forEach((object, index) => {
          if (objects.some((other, at) => at > index && hit(object, other))) overlaps += 1;
          if (zones.some((zone) => hit(object, zone))) inZone += 1;
        });
        return { count: objects.length, zones: zones.length, overlaps, inZone };
      }, section);
      const label = `${section} ambient objects at ${size.width}px`;
      assert.ok(state.count >= 6 && state.count <= 16, `${label}: ${state.count} objects`);
      assert.ok(state.zones > 4, `${label}: protected zones measured`);
      assert.equal(state.overlaps, 0, `${label}: objects must not overlap`);
      assert.equal(state.inZone, 0, `${label}: objects must stay out of protected zones`);
    }
    await wide.close();
  }

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
  await page.getByRole('button', { name: 'Reset board' }).click();
  assert.equal(await page.getByRole('button', { name: 'Tile 1, number 4' }).isVisible(), true);
  assert.equal(await page.getByRole('button', { name: 'Tile 2, number 6' }).isVisible(), true);
  await page.getByRole('tab', { name: /random forest/i }).click();
  assert.equal(
    await page.getByRole('tab', { name: /random forest/i }).getAttribute('aria-selected'),
    'true',
  );
  const labAcademicResult = page.getByRole('tabpanel').getByText(/96\.23%/);
  assert.match(await labAcademicResult.innerText(), academicResultContext);
  await page.locator('input[type="range"]').fill('74');
  assert.equal(await page.locator('input[type="range"]').inputValue(), '74');
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
