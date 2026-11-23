import { useEffect, useRef, useState } from 'react';
import { content } from '../data/content';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';
import { assetUrl, homeUrl, pageUrl } from '../utils/links';
import styles from '../styles/site.module.css';

const themeColours = { light: '#f5f6f0', dark: '#18211e' } as const;

export function Header({ route }: { route: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColours[next]);
    try {
      localStorage.setItem('nm-theme', next);
    } catch {
      // Keep the active theme when storage is unavailable.
    }
  }

  useEffect(() => {
    if (!menuOpen) return;
    navigation.current?.querySelector('a')?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  function followLink(event: React.MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    if (!menuOpen) return;
    const href = event.currentTarget.getAttribute('href');
    if (href?.startsWith('#'))
      document.getElementById(href.slice(1))?.focus({ preventScroll: true });
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a className={styles.logo} href={pageUrl()} aria-label="Nasim Mosayebi home">
          <span className={styles.logoMark} aria-hidden="true">
            NM
          </span>
          <span className={styles.logoName}>{content.identity.name}</span>
        </a>
        <nav
          ref={navigation}
          id="main-navigation"
          className={styles.nav}
          data-open={menuOpen || undefined}
          aria-label="Main"
        >
          <ul>
            {content.nav.map(({ label, href }) => (
              <li key={href}>
                <a href={route === '' ? href : homeUrl(href)} onClick={followLink}>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href={pageUrl('lab/')} aria-current={route === 'lab' ? 'page' : undefined}>
                Engineering Lab
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.headerActions}>
          <a className={styles.headerCv} href={assetUrl(content.links.cv)} download>
            CV <span className={styles.srOnly}>(PDF download)</span>
          </a>
          <button
            data-enhanced
            className={`${styles.iconButton} ${styles.themeButton}`}
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
          >
            <MoonIcon className={styles.moon} />
            <SunIcon className={styles.sun} />
          </button>
          <button
            data-enhanced
            ref={menuButton}
            className={`${styles.iconButton} ${styles.menuButton}`}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
