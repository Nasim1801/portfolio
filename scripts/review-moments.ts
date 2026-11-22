/**
 * Review moments: captures the site mid-interaction and records a scroll video,
 * because motion is the point of this version.
 *
 * Usage (with `npm run preview` running):
 *   REVIEW_VERSION=v8 PORTFOLIO_CHROME=/usr/bin/google-chrome npm run review:moments
 * Writes review/<version>-moment-*.png and review/<version>-scroll.webm (convert with ffmpeg).
 */
import { mkdir, rename, rm } from 'node:fs/promises';
import { chromium, type Page } from 'playwright';

const site = process.env.PORTFOLIO_QA_URL ?? 'http://127.0.0.1:4173/portfolio/';
const out = process.env.REVIEW_OUTPUT ?? 'review';
const version = process.env.REVIEW_VERSION ?? 'v8';
const browser = await chromium.launch({ executablePath: process.env.PORTFOLIO_CHROME });
await mkdir(out, { recursive: true });

async function open(width: number, theme: 'light' | 'dark', route = '') {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 900 },
    colorScheme: theme,
    hasTouch: width < 500,
  });
  const page = await context.newPage();
  await page.goto(new URL(route, site).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
const settle = (page: Page, ms = 900) => page.waitForTimeout(ms);
async function scrollTo(page: Page, selector: string, offset = 110) {
  await page.evaluate(
    ([target, gap]) => {
      const element = document.querySelector(target as string)!;
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - (gap as number),
        behavior: 'instant',
      });
    },
    [selector, offset],
  );
  await settle(page, 1300);
}
const shot = (page: Page, name: string) =>
  page.screenshot({ path: `${out}/${version}-moment-${name}.png` });

try {
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 390]) {
      const tag = `${width}-${theme}`;
      const page = await open(width, theme);
      if (theme === 'light' && width === 1440) {
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(520);
        await shot(page, `hero-entrance-${tag}`);
      }
      await settle(page, 2600);
      await shot(page, `hero-${tag}`);

      // Hero stage on each level, with that level's drifting objects.
      const pickLevel = async (name: string) => {
        await page.getByRole('tab', { name, exact: true }).click({ force: true });
        // On a phone the stage sits below the intro, so bring it into view.
        if (width === 1440) {
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.mouse.move(700, 892);
        } else {
          await page.evaluate(() => {
            const panel = document.getElementById('level-panel')!;
            window.scrollTo({
              top: panel.getBoundingClientRect().top + window.scrollY - 380,
              behavior: 'instant',
            });
          });
        }
      };
      if (width === 1440 || theme === 'light') {
        for (const [name, slug] of [
          ['PathLife', 'pathlife'],
          ['Sumlume', 'sumlume'],
          ['Physio-AI', 'physio'],
          ['PawLife', 'pawlife'],
        ]) {
          await pickLevel(name);
          if (name === 'Physio-AI' && width === 1440 && theme === 'light') {
            await page.waitForTimeout(330);
            await shot(page, `hero-transition-${tag}`);
          }
          await settle(page, 1500);
          await shot(page, `hero-level-${slug}-${tag}`);
        }
        await pickLevel('PathLife');
      }

      // Make 10 inside the Sumlume project: idle, mid-play, win.
      await scrollTo(page, '#sumlume');
      await page.locator('#board-title').scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'instant' }));
      await settle(page, 1200);
      await shot(page, `sumlume-board-idle-${tag}`);
      await page.getByRole('button', { name: 'Tile 1, number 7' }).click();
      await page.getByRole('button', { name: 'Tile 9, number 3' }).click();
      await page.getByRole('button', { name: 'Tile 2, number 2' }).click();
      await page.getByRole('button', { name: 'Tile 6, number 8' }).click();
      await page.waitForTimeout(140);
      await page.getByRole('button', { name: 'Tile 4, number 9' }).click();
      await page.waitForTimeout(160);
      await shot(page, `sumlume-board-play-${tag}`);
      await page.getByRole('button', { name: 'Tile 7, number 1' }).click({ force: true });
      for (const [a, b] of [
        [5, 8],
        [3, 11],
        [10, 14],
        [12, 13],
        [15, 16],
      ]) {
        await page.locator(`button[aria-label^="Tile ${a},"]`).click({ force: true });
        await page.locator(`button[aria-label^="Tile ${b},"]`).click({ force: true });
      }
      await page.waitForTimeout(700);
      if (width === 1440 || theme === 'light') await shot(page, `sumlume-board-win-${tag}`);

      // Project cards in their own worlds.
      await scrollTo(page, '#pathlife');
      if (width === 1440) {
        const stage = await page.locator('#pathlife > div').first().boundingBox();
        if (stage)
          await page.mouse.move(stage.x + stage.width * 0.82, stage.y + stage.height * 0.22);
        await settle(page, 600);
      }
      await shot(page, `project-pathlife-${tag}`);
      if (width === 1440) {
        await page.waitForTimeout(3600);
        await shot(page, `project-pathlife-next-screen-${tag}`);
        await scrollTo(page, '#sumlume');
        await shot(page, `project-sumlume-${tag}`);
        await scrollTo(page, '#physio-ai');
        await shot(page, `project-physio-${tag}`);
      }
      await scrollTo(page, '#pawlife');
      await shot(page, `project-pawlife-${tag}`);

      // Skills inventory with a skill active.
      await scrollTo(page, '#skills');
      const skill = page.getByRole('button', { name: 'React Native', exact: true });
      if (width === 1440) await skill.hover();
      else await skill.click();
      await settle(page, 500);
      await shot(page, `skills-active-${tag}`);

      await scrollTo(page, '#about');
      if (width === 1440) await shot(page, `about-${tag}`);
      await scrollTo(page, '#experience', 200);
      await page.evaluate(() => window.scrollBy({ top: 260, behavior: 'instant' }));
      await settle(page, 900);
      await shot(page, `timeline-${tag}`);

      // The finale.
      await scrollTo(page, '#contact', 0);
      if (width === 1440) await page.locator('#contact-email').hover();
      await settle(page, 700);
      await shot(page, `contact-${tag}`);
      await page.context().close();

      // Case study.
      const study = await open(width, theme, 'projects/pathlife/');
      await settle(study, 1500);
      await shot(study, `case-study-${tag}`);
      if (width === 1440) {
        await scrollTo(study, '#architecture');
        await shot(study, `case-study-architecture-${tag}`);
      }
      await study.context().close();
    }
  }

  // Scroll video at 1440.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    recordVideo: { dir: `${out}/video-tmp`, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(site, { waitUntil: 'networkidle' });
  await page.mouse.move(380, 640);
  // About twenty seconds on the hero so all four levels and object sets are visible.
  await page.waitForTimeout(19500);
  await page.mouse.move(400, 500, { steps: 20 });
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y < total; y += 14) {
    await page.mouse.wheel(0, 14);
    await page.waitForTimeout(16);
    if (y > 800 && y < 830) await page.mouse.move(500, 380, { steps: 12 });
    if (y > 1000 && y < 1030) await page.mouse.move(250, 560, { steps: 12 });
  }
  await page.waitForTimeout(600);
  await page.locator('#contact-email').hover();
  await page.waitForTimeout(1200);
  const video = page.video();
  await context.close();
  if (video) await rename(await video.path(), `${out}/${version}-scroll.webm`);
  await rm(`${out}/video-tmp`, { recursive: true, force: true });
} finally {
  await browser.close();
}
console.log(`Wrote ${version} moments and scroll video.`);
