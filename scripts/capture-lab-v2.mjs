import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const site = process.env.PORTFOLIO_QA_URL ?? 'http://127.0.0.1:4173/portfolio/';
const output = process.env.REVIEW_OUTPUT ?? 'review/engineering-lab-v2';
const browser = await chromium.launch({ executablePath: process.env.PORTFOLIO_CHROME });
await mkdir(output, { recursive: true });

async function open(page, project) {
  await page.goto(new URL(`lab/#${project}-demo`, site).href);
  await page.locator('html[data-ready]').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts.ready);
  // Stop the portfolio masthead from crossing unusually tall element captures.
  await page.addStyleTag({
    content: 'header:has(#main-navigation) { position: static !important }',
  });
  return page.locator(`#${project}-demo`);
}

const button = (section, name) => section.getByRole('button', { name, exact: true });
const activate = (section, name, touch = false) => {
  const target = button(section, name);
  return touch ? target.tap() : target.click();
};

async function save(section, name) {
  await section.scrollIntoViewIfNeeded();
  await section
    .locator('img:visible')
    .evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  const capture = await section.screenshot({ animations: 'disabled' });
  await sharp(capture).webp({ quality: 90 }).toFile(`${output}/${name}.webp`);
}

async function compare(project, source, target) {
  const browser = await sharp(`${output}/${project}-1440.webp`)
    .resize(850)
    .toBuffer({ resolveWithObject: true });
  const height = browser.info.height;
  const reference = await sharp(source)
    .resize({ height })
    .webp()
    .toBuffer({ resolveWithObject: true });
  await sharp({
    create: {
      width: reference.info.width + 18 + browser.info.width,
      height,
      channels: 3,
      background: '#dddfd3',
    },
  })
    .composite([
      { input: reference.data, left: 0, top: 0 },
      { input: browser.data, left: reference.info.width + 18, top: 0 },
    ])
    .webp({ quality: 88 })
    .toFile(`${output}/${target}.webp`);
}

async function record(project, actions, finalText) {
  const context = await browser.newContext({
    viewport: { width: 900, height: 810 },
    colorScheme: 'light',
    recordVideo: { dir: 'work/lab-v2-recordings', size: { width: 900, height: 810 } },
  });
  const page = await context.newPage();
  const video = page.video();
  try {
    const section = await open(page, project);
    await section.locator(':scope > div > div').evaluate((board) => {
      window.scrollTo(0, board.getBoundingClientRect().top + scrollY - 18);
    });
    await page.waitForTimeout(900);
    for (const [name, pause] of actions) {
      await activate(section, name);
      await page.waitForTimeout(pause);
    }
    assert.ok(await section.getByRole('heading', { name: finalText }).isVisible());
    await page.waitForTimeout(1400);
  } finally {
    await context.close();
  }
  assert.ok(video);
  await video.saveAs(`${output}/${project}-gameplay.webm`);
  await video.delete();
}

try {
  for (const width of [1440, 390]) {
    const mobile = width === 390;
    const context = await browser.newContext({
      viewport: { width, height: mobile ? 844 : 1000 },
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    for (const project of ['pathlife', 'pawlife']) {
      const page = await context.newPage();
      const section = await open(page, project);
      if (project === 'pathlife') {
        await activate(section, 'Start life', mobile);
        await save(section, `${project}-${width}`);
        await activate(section, 'Enrol in training', mobile);
      } else {
        await activate(section, 'Start care', mobile);
        await save(section, `${project}-${width}`);
        await activate(section, 'Feed', mobile);
        await activate(section, 'Serve a warm meal', mobile);
      }
      await save(section, `${project}-feedback-${width}`);
      await page.close();
    }
    await context.close();
  }
  await compare('pathlife', 'public/assets/pathlife/decisions.webp', 'pathlife-native-comparison');
  await compare('pawlife', 'public/assets/pawlife/home.webp', 'pawlife-native-comparison');
  if (process.env.REVIEW_RECORD !== '0') {
    await record(
      'pathlife',
      [
        ['Start life', 1350],
        ['Enrol in training', 1300],
        ['Age Up +1 year', 1200],
        ['Move in with a friend', 1300],
        ['Age Up +1 year', 1050],
        ['Apply for the skilled role', 1550],
        ['Age Up +1 year', 500],
      ],
      'Three years complete',
    );
    await record(
      'pawlife',
      [
        ['Start care', 800],
        ['Feed', 650],
        ['Serve a warm meal', 1250],
        ['Next moment', 450],
        ['Play', 650],
        ['Throw the ball', 1250],
        ['Next moment', 450],
        ['Groom', 600],
        ['Gentle brush', 1050],
        ['See the evening event', 1250],
        ['Sit with Bella', 800],
      ],
      'Time to settle in',
    );
  }
} finally {
  await browser.close();
}
