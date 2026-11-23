/**
 * Review capture: full-page screenshots plus an automated audit of links, anchors,
 * contrast, tap targets, headings, images, layout shift and transferred bytes.
 *
 * Usage (with `npm run preview` running):
 *   REVIEW_PREFIX=v5-after npm run review
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, type Page } from 'playwright';

const site = process.env.PORTFOLIO_QA_URL ?? 'http://127.0.0.1:4173/portfolio/';
const prefix = process.env.REVIEW_PREFIX ?? 'v5-after';
const outputDirectory = process.env.REVIEW_OUTPUT ?? 'review';
const executablePath = process.env.PORTFOLIO_CHROME;
const routes = (
  process.env.REVIEW_ROUTES ??
  ',lab/,projects/sumlume/,projects/pathlife/,projects/physio-ai/,projects/pawlife/,projects/portfolio/,projects/co2-tracker/,projects/hospital-appointment-system/'
).split(',');

type Report = Record<string, unknown>;
const report: Report = { site, generated: new Date().toISOString(), pages: [] as Report[] };

function luminance([r, g, b]: number[]) {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

async function audit(page: Page, mobile: boolean) {
  return page.evaluate(
    async ({ mobile }) => {
      const parse = (value: string) => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) return null;
        const parts = match[1]
          .split(/[ ,/]+/)
          .filter(Boolean)
          .map(Number);
        return { rgb: parts.slice(0, 3), alpha: parts[3] ?? 1 };
      };
      const backgroundOf = (element: Element | null): number[] => {
        const layers: { rgb: number[]; alpha: number }[] = [];
        let node: Element | null = element;
        while (node) {
          const style = getComputedStyle(node);
          if (style.backgroundImage !== 'none') return [-1, -1, -1];
          const colour = parse(style.backgroundColor);
          if (colour && colour.alpha > 0) {
            layers.push(colour);
            if (colour.alpha >= 1) break;
          }
          node = node.parentElement;
        }
        let result = [255, 255, 255];
        for (const layer of layers.reverse()) {
          result = result.map(
            (value, index) => layer.rgb[index] * layer.alpha + value * (1 - layer.alpha),
          );
        }
        return result;
      };
      const textNodes: {
        text: string;
        colour: number[];
        background: number[];
        size: number;
        weight: number;
        selector: string;
      }[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set<Element>();
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        if (!parent || seen.has(parent) || !node.textContent?.trim()) continue;
        seen.add(parent);
        const style = getComputedStyle(parent);
        const rect = parent.getBoundingClientRect();
        if (
          !rect.width ||
          !rect.height ||
          style.visibility === 'hidden' ||
          Number(style.opacity) === 0
        )
          continue;
        if (parent.closest('[aria-hidden="true"], .sr-only, dialog:not([open])')) continue;
        const colour = parse(style.color);
        if (!colour) continue;
        textNodes.push({
          text: node.textContent.trim().slice(0, 50),
          colour: colour.rgb,
          background: backgroundOf(parent),
          size: parseFloat(style.fontSize),
          weight: Number(style.fontWeight),
          selector: `${parent.tagName.toLowerCase()}.${[...parent.classList].join('.')}`,
        });
      }

      const links = [...document.querySelectorAll('a[href]')].map((anchor) => ({
        text: (anchor.textContent ?? anchor.getAttribute('aria-label') ?? '').trim().slice(0, 60),
        href: (anchor as HTMLAnchorElement).href,
        raw: anchor.getAttribute('href'),
        target: anchor.getAttribute('target'),
        rel: anchor.getAttribute('rel'),
        download: anchor.hasAttribute('download'),
      }));

      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((heading) => ({
        level: Number(heading.tagName[1]),
        text: heading.textContent?.trim().slice(0, 60),
      }));
      const skippedHeadings = headings.filter(
        (heading, index) => index > 0 && heading.level - headings[index - 1].level > 1,
      );

      const smallTargets = mobile
        ? [...document.querySelectorAll('a, button, input, [role="tab"]')]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              if (!rect.width || !rect.height) return false;
              if (
                element.closest('p, li, dd') &&
                element.tagName === 'A' &&
                getComputedStyle(element).display === 'inline'
              )
                return false;
              return rect.width < 24 || rect.height < 24;
            })
            .map(
              (element) =>
                `${element.tagName.toLowerCase()} "${(element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(element.getBoundingClientRect().width)}x${Math.round(element.getBoundingClientRect().height)}`,
            )
        : [];

      const images = [...document.images].map((image) => ({
        src: image.currentSrc || image.src,
        alt: image.getAttribute('alt'),
        natural: `${image.naturalWidth}x${image.naturalHeight}`,
        displayed: `${Math.round(image.getBoundingClientRect().width)}x${Math.round(image.getBoundingClientRect().height)}`,
        loading: image.loading,
        hasDimensions: image.hasAttribute('width') && image.hasAttribute('height'),
      }));

      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const bytes = resources.reduce(
        (total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0),
        0,
      );
      const shifts = (window as unknown as { __cls?: number }).__cls ?? 0;

      return {
        title: document.title,
        lang: document.documentElement.lang,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        ogTags: [...document.querySelectorAll('meta[property^="og:"], meta[name^="og:"]')].map(
          (meta) =>
            `${meta.hasAttribute('property') ? 'property' : 'NAME'}=${meta.getAttribute('property') ?? meta.getAttribute('name')}`,
        ),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        h1: headings.filter((heading) => heading.level === 1).length,
        headings,
        skippedHeadings,
        overflow: document.documentElement.scrollWidth - innerWidth,
        textNodes,
        links,
        images,
        imagesWithoutAlt: images.filter((image) => image.alt === null).length,
        smallTargets,
        resourceCount: resources.length,
        transferKB: Math.round(bytes / 1024),
        cls: shifts,
        ids: [...document.querySelectorAll('[id]')].map((element) => element.id),
      };
    },
    { mobile },
  );
}

const browser = await chromium.launch({ executablePath });
try {
  await mkdir(outputDirectory, { recursive: true });
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
        deviceScaleFactor: 1,
        colorScheme: theme,
        isMobile: width === 390,
        hasTouch: width === 390,
      });
      // tsx keeps function names with a __name helper; provide it inside the page.
      await context.addInitScript('window.__name = (fn) => fn;');
      await context.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          })[]) {
            if (!entry.hadRecentInput)
              (window as unknown as { __cls: number }).__cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      for (const route of routes) {
        const page = await context.newPage();
        const errors: string[] = [];
        const failed: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
          if (message.type() === 'error' || message.type() === 'warning')
            errors.push(message.text());
        });
        page.on('response', (response) => {
          if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
        });
        await page.goto(new URL(route, site).href, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        // Scroll through to trigger lazy media and reveal animations.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) {
            scrollTo({ top: y, behavior: 'instant' });
            await new Promise((resolve) => setTimeout(resolve, 220));
          }
          scrollTo({ top: 0, behavior: 'instant' });
          await new Promise((resolve) => setTimeout(resolve, 1600));
        });
        const result = await audit(page, width === 390);
        const lowContrast = result.textNodes
          .filter((node) => node.background[0] >= 0)
          .map((node) => {
            const a = luminance(node.colour);
            const b = luminance(node.background);
            const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            const large = node.size >= 24 || (node.size >= 18.66 && node.weight >= 700);
            return { ...node, ratio: Math.round(ratio * 100) / 100, required: large ? 3 : 4.5 };
          })
          .filter((node) => node.ratio < node.required);
        const slug = route.split('/').filter(Boolean).at(-1) || 'home';
        if (slug === 'home' || process.env.REVIEW_ALL_SCREENSHOTS) {
          await page.screenshot({
            path: `${outputDirectory}/${prefix}-${slug === 'home' ? '' : `${slug}-`}${width}-${theme}.png`,
            fullPage: true,
          });
        }
        (report.pages as Report[]).push({
          route: route || 'home',
          width,
          theme,
          errors,
          failed,
          lowContrast,
          ...result,
          textNodes: undefined,
        });
        await page.close();
      }
      await context.close();
    }
  }

  // Anchor deep-link check: does the target land below the fixed header?
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript('window.__name = (fn) => fn;');
  const anchors: Report[] = [];
  const homeIds =
    ((report.pages as Report[]).find((item) => item.route === 'home')?.ids as string[]) ?? [];
  for (const id of [
    'work',
    'pathlife',
    'sumlume',
    'physio-ai',
    'about',
    'contact',
    'skills',
    'experience',
  ]) {
    // A fresh tab per link, as a visitor would open it.
    const page = await context.newPage();
    await page.goto(`${site}#${id}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const position = await page.evaluate((target) => {
      const element = document.getElementById(target);
      const header = document.querySelector('header');
      return element
        ? {
            top: Math.round(element.getBoundingClientRect().top),
            headerBottom: Math.round(header?.getBoundingClientRect().bottom ?? 0),
          }
        : null;
    }, id);
    anchors.push({
      id,
      exists: homeIds.includes(id),
      ...position,
      ok: !!position && position.top >= position.headerBottom - 2 && position.top < 200,
    });
    await page.close();
  }
  report.anchors = anchors;
  await context.close();
} finally {
  await browser.close();
}

await writeFile(`${outputDirectory}/${prefix}-report.json`, JSON.stringify(report, null, 2));
console.log(`Wrote ${outputDirectory}/${prefix}-report.json`);
