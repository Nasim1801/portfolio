import { useEffect, useRef, useState } from 'react';
import { content } from '../data/content';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';
import { assetUrl, homeUrl, pageUrl } from '../utils/links';
import styles from '../styles/site.module.css';

type Theme = 'light' | 'dark';

function navHref(href: string) {
  return href.startsWith('#') ? homeUrl(href) : pageUrl(href);
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('nm-theme', nextTheme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', nextTheme === 'dark' ? '#080b12' : '#f1f3f7');
  };

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <a className={styles.logo} href={pageUrl()}>
        <span className={styles.logoMark} aria-hidden="true">
          N<span>/</span>M
        </span>
        <strong>
          <span>Nasim</span>
          <span>Mosayebi</span>
        </strong>
        <small>
          Software Engineer
          <br />
          London
        </small>
      </a>

      <div className={styles.headerActions}>
        <a className={styles.headerCv} href={assetUrl(content.links.cv)} download>
          CV ↓
        </a>
        <button
          className={styles.themeButton}
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav
        id="main-navigation"
        className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
        aria-label="Main navigation"
      >
        {content.nav.map((item, index) => (
          <a key={item.href} href={navHref(item.href)} onClick={() => setMenuOpen(false)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.label}
          </a>
        ))}
        <a
          className={styles.navContact}
          href={homeUrl('#contact')}
          onClick={() => setMenuOpen(false)}
        >
          Start a conversation ↗
        </a>
      </nav>
    </header>
  );
}
