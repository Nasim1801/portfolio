import { lazy, Suspense, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About, Contact, Experience, Footer, SelectedWork, Skills } from './components/Sections';
import { content, findCaseStudy, type CaseStudy } from './data/content';
import { confettiRain, initKonami, initReveals, initWorlds } from './fx/effects';
import { initRouter, useRoute } from './fx/router';
import { ScrollMap } from './fx/ScrollMap';
import { pageUrl, scrollToHash } from './utils/links';
import styles from './styles/site.module.css';

const CaseStudyPage = lazy(() =>
  import('./components/CaseStudyPage').then(({ CaseStudyPage }) => ({ default: CaseStudyPage })),
);
const EngineeringLabPage = lazy(() =>
  import('./components/EngineeringLabPage').then(({ EngineeringLabPage }) => ({
    default: EngineeringLabPage,
  })),
);

const siteUrl = 'https://nasim1801.github.io/portfolio/';

function setMeta(selector: string, contentValue: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', contentValue);
}

function PageMetadata({ study }: { study?: CaseStudy }) {
  useEffect(() => {
    const title = study ? `${study.name} Case Study | Nasim Mosayebi` : content.identity.title;
    const description = study
      ? `${study.name}: ${study.summary} A case study by London software engineer Nasim Mosayebi.`
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
  }, [study]);

  return null;
}

/** Scrolls to the URL fragment after the route has rendered. */
function HashTarget() {
  useEffect(() => scrollToHash(), []);
  return null;
}

function HomePage() {
  return (
    <>
      <PageMetadata />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <SelectedWork />
        <Skills />
        <About />
        <Experience />
        <Contact />
      </main>
      <HashTarget />
    </>
  );
}

function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.notFound}>
      <h1>This page isn’t part of the portfolio.</h1>
      <p>The link may be out of date. The home page lists all of my work.</p>
      <a className={styles.buttonPrimary} href={pageUrl()}>
        Go to the home page
      </a>
    </main>
  );
}

/** Ambient colour behind the whole page. It tweens into each project's world. */
function Atmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}

export default function App() {
  const route = useRoute();
  const [toast, setToast] = useState('');
  const projectMatch = /^projects\/([^/]+)$/.exec(route);
  const study = projectMatch ? findCaseStudy(projectMatch[1]) : undefined;
  const knownHomeRoute = route === '' || route === 'index.html';
  const labRoute = route === 'lab';

  useEffect(() => {
    const stopRouter = initRouter();
    const stopReveals = initReveals();
    const stopWorlds = initWorlds();
    let timer = 0;
    const stopKonami = initKonami(() => {
      confettiRain(120);
      setToast('Cheat code accepted. Extra lives granted. The CV is still worth reading.');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setToast(''), 6000);
    });
    return () => {
      stopRouter();
      stopReveals();
      stopWorlds();
      stopKonami();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <Atmosphere />
      <Header isHome={knownHomeRoute} />
      {knownHomeRoute && <ScrollMap />}
      <Suspense
        key={route}
        fallback={
          <main id="main-content" tabIndex={-1} className={styles.routeLoading} aria-busy="true" />
        }
      >
        {study ? (
          <>
            <PageMetadata study={study} />
            <CaseStudyPage study={study} />
            <HashTarget />
          </>
        ) : labRoute ? (
          <EngineeringLabPage />
        ) : knownHomeRoute ? (
          <HomePage />
        ) : (
          <NotFoundPage />
        )}
      </Suspense>
      <Footer />
      <p className={styles.toast} role="status" data-on={toast ? '' : undefined}>
        {toast}
      </p>
    </>
  );
}
