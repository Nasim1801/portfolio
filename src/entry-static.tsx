import { renderToString } from 'react-dom/server';
import { content } from './data/content';
import { renderRoute } from './routes';

const owner = content.identity.name;
export const siteUrl = 'https://nasim1801.github.io/portfolio/';
export const routes = [
  {
    path: '',
    title: content.identity.title,
    description: content.identity.description,
    name: owner,
    type: 'ProfilePage',
    socialImage: 'og-cover.png',
    preview: content.caseStudies[0].icon?.src,
    label: 'Graduate software engineer',
  },
  ...content.caseStudies.map((study) => ({
    path: `projects/${study.slug}`,
    title: `${study.slug === 'portfolio' ? 'This Portfolio' : study.name} Case Study | ${owner}`,
    description: study.summary,
    name: study.name,
    type: study.schemaType,
    socialImage: `social/${study.slug}.png`,
    preview: study.icon?.src ?? study.media[0].src,
    label: study.kind,
  })),
  {
    path: 'lab',
    title: `Engineering Lab | ${owner}`,
    description:
      'Play PathLife, Sumlume and PawLife browser demos, and explore the Physio-AI pose pipeline.',
    name: 'Engineering Lab',
    type: 'WebPage',
    socialImage: 'social/lab.png',
    preview: undefined,
    label: 'Interactive demonstrations',
  },
];

export const profile = {
  '@type': 'Person',
  '@id': `${siteUrl}#nasim`,
  name: owner,
  url: siteUrl,
  jobTitle: 'Software Engineer',
  address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
  sameAs: [content.links.github, content.links.linkedin],
  worksFor: { '@type': 'Organization', name: 'PathLife Studio Ltd', url: content.links.studio },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Brunel University London' },
};

export async function render(path: string) {
  return renderToString(await renderRoute(path));
}
