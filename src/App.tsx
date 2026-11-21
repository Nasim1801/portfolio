import { useEffect } from 'react';
import { Header } from './components/Header';
import { CaseStudyPage } from './components/CaseStudyPage';
import { EngineeringLabPage } from './components/EngineeringLabPage';
import {
  About,
  Contact,
  Experience,
  Footer,
  Hero,
  ProofStrip,
  SelectedWork,
  Skills,
  TeamProjects,
} from './components/Sections';
import { content, findCaseStudy, type CaseStudy } from './data/content';
import { pageUrl, routePath } from './utils/links';
import styles from './styles/site.module.css';

const siteUrl = 'https://nasim1801.github.io/portfolio/';

function setMeta(selector: string, contentValue: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', contentValue);
}

function PageMetadata({ study }: { study?: CaseStudy }) {
  useEffect(() => {
    const title = study ? `${study.name} Case Study | Nasim Mosayebi` : content.identity.title;
    const description = study
      ? `${study.name}: ${study.summary} Read the engineering case study by London software engineer Nasim Mosayebi.`
      : content.identity.description;
    const url = study ? `${siteUrl}projects/${study.slug}/` : siteUrl;

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);

    let schema = document.querySelector<HTMLScriptElement>('#page-schema');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'page-schema';
      schema.type = 'application/ld+json';
      document.head.append(schema);
    }
    schema.textContent = JSON.stringify(
      study
        ? {
            '@context': 'https://schema.org',
            '@type': study.schemaType,
            name: study.name,
            description: study.summary,
            url,
            author: { '@type': 'Person', name: content.identity.name, url: siteUrl },
            image: `${siteUrl}${study.media[0].src}`,
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Nasim Mosayebi developer portfolio',
            url: siteUrl,
            author: { '@type': 'Person', name: content.identity.name },
          },
    );
  }, [study]);

  return null;
}

function HomePage() {
  return (
    <>
      <PageMetadata />
      <main id="main-content">
        <Hero />
        <ProofStrip />
        <SelectedWork />
        <About />
        <TeamProjects />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}

function NotFoundPage() {
  return (
    <main id="main-content" className={styles.notFound}>
      <p className={styles.eyebrow}>404</p>
      <h1>That page is not part of this portfolio.</h1>
      <p>Return to the selected work or use the navigation to continue.</p>
      <a className={styles.primaryButton} href={pageUrl()}>
        Portfolio home
      </a>
    </main>
  );
}

export default function App() {
  const route = routePath();
  const projectMatch = /^projects\/([^/]+)$/.exec(route);
  const study = projectMatch ? findCaseStudy(projectMatch[1]) : undefined;
  const knownHomeRoute = route === '' || route === 'index.html';
  const labRoute = route === 'lab';

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <Header />
      <div className={styles.pageEnter} key={route}>
        {study ? (
          <>
            <PageMetadata study={study} />
            <CaseStudyPage study={study} />
          </>
        ) : labRoute ? (
          <EngineeringLabPage />
        ) : knownHomeRoute ? (
          <HomePage />
        ) : (
          <NotFoundPage />
        )}
      </div>
      <Footer />
    </>
  );
}
