import { useEffect, type ReactNode } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { pageUrl } from './utils/links';
import styles from './styles/site.module.css';

export function SiteLayout({ route, children }: { route: string; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.ready = '';
  }, []);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <Header route={route} />
      {children}
      <Footer />
    </>
  );
}

export function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.notFound}>
      <h1>Page unavailable</h1>
      <p>The portfolio home lists all the current projects.</p>
      <a className={styles.buttonPrimary} href={pageUrl()}>
        Portfolio home
      </a>
    </main>
  );
}
