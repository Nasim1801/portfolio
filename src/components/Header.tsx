import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { content } from '../data/content';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';
import { withTransition } from '../fx/effects';
import { assetUrl, homeUrl, pageUrl } from '../utils/links';
import styles from '../styles/site.module.css';

type Theme = 'light' | 'dark';
const themeColours: Record<Theme, string> = { light: '#eef4ff', dark: '#0d0b24' };

export function Header({ isHome }: { isHome: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    // The new theme grows out of the toggle button as a circle.
    const rect = themeButtonRef.current?.getBoundingClientRect();
    if (rect) {
      root.style.setProperty('--vt-x', `${rect.left + rect.width / 2}px`);
      root.style.setProperty('--vt-y', `${rect.top + rect.height / 2}px`);
    }
    withTransition(() => {
      flushSync(() => setTheme(nextTheme));
      root.dataset.theme = nextTheme;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', themeColours[nextTheme]);
    }, 'theme');
    try {
      localStorage.setItem('nm-theme', nextTheme);
    } catch {
      // The theme still switches when storage is unavailable.
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    navigationRef.current?.querySelector('a')?.focus({ preventScroll: true });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a className={styles.logo} href={pageUrl()} aria-label="Nasim Mosayebi home">
          <span className={styles.logoMark} aria-hidden="true">
            <i data-tone="1">N</i>
            <i data-tone="3">M</i>
          </span>
          <span className={styles.logoName}>Nasim Mosayebi</span>
        </a>

        <nav
          ref={navigationRef}
          id="main-navigation"
          className={styles.nav}
          data-open={menuOpen || undefined}
          aria-label="Main"
        >
          <ul>
            {content.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={isHome ? item.href : homeUrl(item.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <a className={styles.headerCv} href={assetUrl(content.links.cv)} download>
            CV
            <span className={styles.srOnly}> (PDF download)</span>
          </a>
          <button
            ref={themeButtonRef}
            className={`${styles.iconButton} ${styles.themeButton}`}
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span key={theme}>{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</span>
          </button>
          <button
            ref={menuButtonRef}
            className={`${styles.iconButton} ${styles.menuButton}`}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
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
