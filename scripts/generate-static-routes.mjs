import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDirectory = resolve('dist');
const source = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
const siteUrl = 'https://nasim1801.github.io/portfolio/';

const routes = [
  {
    slug: 'sumlume',
    path: 'projects/sumlume',
    name: 'Sumlume',
    title: 'Sumlume Case Study | Nasim Mosayebi',
    description:
      'How Nasim Mosayebi built and released Sumlume, a native SwiftUI number puzzle for iPhone and iPad that is live on the App Store.',
    image: 'assets/sumlume/classic.webp',
    type: 'VideoGame',
  },
  {
    slug: 'pathlife',
    path: 'projects/pathlife',
    name: 'PathLife',
    title: 'PathLife Case Study | Nasim Mosayebi',
    description:
      'PathLife case study: problem, constraints, architecture, key decisions and outcome for a live iOS life simulation, its React Native Android rebuild and its Node.js support platform.',
    image: 'assets/pathlife/dashboard.webp',
    type: 'VideoGame',
  },
  {
    slug: 'physio-ai',
    path: 'projects/physio-ai',
    name: 'Physio-AI',
    title: 'Physio-AI Case Study | Nasim Mosayebi',
    description:
      'Physio-AI case study: a Grade A real-time physiotherapy feedback system using MediaPipe Pose and a Random Forest classifier with 96.23% accuracy.',
    image: 'assets/physio-ai/01-live-squat.webp',
    type: 'SoftwareApplication',
  },
  {
    slug: 'pawlife',
    path: 'projects/pawlife',
    name: 'PawLife',
    title: 'PawLife Case Study | Nasim Mosayebi',
    description:
      'Engineering case study for PawLife, an in-development React Native pet-life simulation with a custom event engine and persistent progression.',
    image: 'assets/pawlife/home.webp',
    type: 'VideoGame',
  },
  {
    slug: 'portfolio',
    path: 'projects/portfolio',
    name: 'This Portfolio',
    title: 'This Portfolio Case Study | Nasim Mosayebi',
    description:
      'How Nasim Mosayebi designed and built this static React and TypeScript portfolio: typed content, a tested puzzle engine, an image pipeline, route metadata and automated browser checks.',
    image: 'assets/portfolio/01-home.webp',
    type: 'SoftwareApplication',
  },
  {
    slug: 'co2-tracker',
    path: 'projects/co2-tracker',
    name: 'CO2 Tracker',
    title: 'CO2 Tracker Case Study | Nasim Mosayebi',
    description:
      'A React and Spring Boot team project for looking up product carbon-footprint data.',
    image: 'assets/co2-tracker/01-customer-page.webp',
    type: 'SoftwareApplication',
  },
  {
    slug: 'hospital-appointment-system',
    path: 'projects/hospital-appointment-system',
    name: 'Hospital Appointment System',
    title: 'Hospital Appointment System Case Study | Nasim Mosayebi',
    description:
      'A Java Swing booking module with JUnit evidence from a Brunel University London team project.',
    image: 'assets/hospital/01-login.webp',
    type: 'SoftwareApplication',
  },
  {
    slug: 'lab',
    path: 'lab',
    name: 'Engineering Lab',
    title: 'Engineering Lab | Nasim Mosayebi',
    description:
      'Playable React and interactive system demonstrations by London software engineer Nasim Mosayebi.',
    image: 'og-cover.png',
    type: 'WebPage',
  },
];

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<meta[^>]+${escaped}[^>]+content=")[^"]*(")`, 'i');
  return html.replace(pattern, `$1${value}$2`);
}

for (const route of routes) {
  const routeUrl = `${siteUrl}${route.path}/`;
  const imageUrl = `${siteUrl}${route.image}`;
  let html = source
    .replace(/<link\s+data-home-preload[^>]*>\s*/g, '')
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);
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
    name: route.name,
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

  const directory = resolve(outputDirectory, route.path);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), html);
}

await copyFile(resolve(outputDirectory, 'index.html'), resolve(outputDirectory, '404.html'));
