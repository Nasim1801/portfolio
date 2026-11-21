import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDirectory = resolve('dist');
const source = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
const siteUrl = 'https://nasim1801.github.io/portfolio/';

const routes = [
  {
    slug: 'sumlume',
    title: 'Sumlume Case Study | Nasim Mosayebi',
    description:
      'How Nasim Mosayebi built and released Sumlume, a native SwiftUI number puzzle for iPhone and iPad, with an Android version in Kotlin in development.',
    image: 'assets/sumlume/gameplay.webp',
    type: 'VideoGame',
  },
  {
    slug: 'pathlife',
    title: 'PathLife Case Study | Nasim Mosayebi',
    description:
      'Engineering case study for PathLife, a live iOS life simulation with a React Native Android rebuild and supporting Node.js infrastructure.',
    image: 'assets/pathlife/01-main.webp',
    type: 'VideoGame',
  },
  {
    slug: 'physio-ai',
    title: 'Physio-AI Case Study | Nasim Mosayebi',
    description:
      'A Grade A real-time physiotherapy system using MediaPipe Pose and a Random Forest classifier with 96.23% accuracy.',
    image: 'assets/physio-ai/01-live-squat.webp',
    type: 'SoftwareApplication',
  },
  {
    slug: 'pawlife',
    title: 'PawLife Case Study | Nasim Mosayebi',
    description:
      'Engineering case study for PawLife, an in-development React Native pet-life simulation with a custom event engine and persistent progression.',
    image: 'assets/pawlife/01-home.webp',
    type: 'VideoGame',
  },
];

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<meta[^>]+${escaped}[^>]+content=")[^"]*(")`, 'i');
  return html.replace(pattern, `$1${value}$2`);
}

for (const route of routes) {
  const routeUrl = `${siteUrl}projects/${route.slug}/`;
  const imageUrl = `${siteUrl}${route.image}`;
  let html = source.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);
  html = replaceMeta(html, 'name="description"', route.description);
  html = replaceMeta(html, 'property="og:title"', route.title);
  html = replaceMeta(html, 'property="og:description"', route.description);
  html = replaceMeta(html, 'property="og:url"', routeUrl);
  html = replaceMeta(html, 'property="og:image"', imageUrl);
  html = replaceMeta(html, 'name="twitter:title"', route.title);
  html = replaceMeta(html, 'name="twitter:description"', route.description);
  html = replaceMeta(html, 'name="twitter:image"', imageUrl);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${routeUrl}" />`,
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': route.type,
    name: route.title.replace(' Case Study | Nasim Mosayebi', ''),
    url: routeUrl,
    image: imageUrl,
    description: route.description,
    author: {
      '@type': 'Person',
      name: 'Nasim Mosayebi',
      url: siteUrl,
    },
  };
  html = html.replace(
    '</head>',
    `    <script id="static-page-schema" type="application/ld+json">${JSON.stringify(schema)}</script>\n  </head>`,
  );

  const directory = resolve(outputDirectory, 'projects', route.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), html);
}

await copyFile(resolve(outputDirectory, 'index.html'), resolve(outputDirectory, '404.html'));
