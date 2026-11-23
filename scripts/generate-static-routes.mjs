import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { build } from 'vite';

const output = resolve('dist');
const serverOutput = resolve('node_modules/.portfolio-prerender');
const source = await readFile(resolve(output, 'index.html'), 'utf8');
await build({
  build: {
    ssr: 'src/entry-static.tsx',
    outDir: serverOutput,
    emptyOutDir: true,
    manifest: false,
    ssrManifest: false,
  },
  configFile: resolve('vite.config.ts'),
});

const { profile, render, routes, siteUrl } = await import(
  pathToFileURL(resolve(serverOutput, 'entry-static.js')).href
);
const manifest = JSON.parse(await readFile(resolve(output, '.vite/manifest.json'), 'utf8'));
const base = new URL(siteUrl).pathname;
const labCss = manifest['src/components/EngineeringLabPage.tsx']?.css ?? [];

function escape(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );
}

function metadata(route, url) {
  const image = new URL(route.socialImage, siteUrl).href;
  const alt = `${route.name} · ${route.label}`;
  const schema = route.path
    ? {
        '@context': 'https://schema.org',
        '@type': route.type,
        name: route.name,
        url,
        image,
        description: route.description,
        author: profile,
      }
    : { '@context': 'https://schema.org', '@type': route.type, url, mainEntity: profile };

  const tag = (attribute, name, content) =>
    `<meta ${attribute}="${name}" content="${escape(content)}">`;
  const shared = {
    title: route.title,
    description: route.description,
    image,
    'image:alt': alt,
  };
  return [
    `<link rel="canonical" href="${escape(url)}">`,
    tag('name', 'description', route.description),
    tag('property', 'og:type', route.path ? 'website' : 'profile'),
    tag('property', 'og:url', url),
    tag('property', 'og:locale', 'en_GB'),
    tag('property', 'og:site_name', profile.name),
    tag('property', 'og:image:width', '1200'),
    tag('property', 'og:image:height', '630'),
    tag('name', 'twitter:card', 'summary_large_image'),
    ...Object.entries(shared).flatMap(([key, value]) => [
      tag('property', `og:${key}`, value),
      tag('name', `twitter:${key}`, value),
    ]),
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n    ');
}

function page(title, head, body) {
  return source
    .replace(/<title>[^<]*<\/title>/, () => `<title>${escape(title)}</title>`)
    .replace('<!--page-metadata-->', () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}

async function write(path, data) {
  const destination = resolve(output, path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, data);
}

async function socialCard(route) {
  const words = route.name.split(' ');
  const lines = [];
  for (const word of words) {
    const previous = lines.at(-1);
    if (previous && previous.length + word.length < 21) lines[lines.length - 1] += ` ${word}`;
    else lines.push(word);
  }
  const title = lines
    .map(
      (line, index) =>
        `<text x="74" y="${268 + index * 68}" fill="#f6fcf2" font-size="59" font-weight="700">${escape(line)}</text>`,
    )
    .join('');
  const graphic = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M28 0H0V28" fill="none" stroke="#446455" stroke-width="1"/>
      </pattern></defs>
      <rect width="1200" height="630" fill="#152b23"/>
      <rect x="700" width="500" height="630" fill="url(#grid)"/>
      <path d="M74 140H643M74 493H643" stroke="#648674"/>
      <g font-family="sans-serif">
        <text x="74" y="108" fill="#d3facb" font-size="22" font-weight="700">NASIM MOSAYEBI / PORTFOLIO</text>
        ${title}
        <text x="74" y="451" fill="#d3facb" font-size="24">${escape(route.label)}</text>
        ${route.preview ? '' : '<text x="870" y="355" fill="#d3facb" font-size="130" font-weight="700">NM</text>'}
      </g>
    </svg>`);
  const overlays = [];
  if (route.preview) {
    const image = await sharp(resolve(output, route.preview))
      .resize(400, 400, { fit: 'inside' })
      .png()
      .toBuffer({ resolveWithObject: true });
    overlays.push({
      input: image.data,
      left: Math.round(950 - image.info.width / 2),
      top: Math.round(315 - image.info.height / 2),
    });
  }
  await write(route.socialImage, await sharp(graphic).composite(overlays).png().toBuffer());
}

for (const route of routes) {
  const url = route.path ? `${siteUrl}${route.path}/` : siteUrl;
  const extraHead = [
    ...(route.path === 'lab'
      ? labCss.map((file) => `<link rel="stylesheet" href="${base}${file}">`)
      : []),
    ...(!route.path
      ? [
          `<link rel="preload" href="${base}fonts/instrument-serif-italic-latin.woff2" as="font" type="font/woff2" crossorigin>`,
        ]
      : []),
  ].join('\n    ');
  const html = page(
    route.title,
    `${metadata(route, url)}\n    ${extraHead}`,
    await render(route.path),
  );
  await write(route.path ? `${route.path}/index.html` : 'index.html', html);
  await socialCard(route);
}

await write(
  '404.html',
  page(
    'Page unavailable | Nasim Mosayebi',
    '<meta name="robots" content="noindex">',
    await render('404.html'),
  ),
);
await write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(({ path }) => `  <url><loc>${siteUrl}${path ? `${path}/` : ''}</loc></url>`).join('\n')}\n</urlset>\n`,
);
