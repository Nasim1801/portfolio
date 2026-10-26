import { useEffect, useRef, useState } from 'react';
import { content } from '../data/content';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';
import styles from '../styles/site.module.css';

type Theme = 'light' | 'dark';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('nm-theme', nextTheme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', nextTheme === 'dark' ? '#171311' : '#f7f2e8');
  };

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
    <header className={styles.header}>
      <a className={styles.logo} href="#top">
        <span>{content.identity.monogram}</span>
        <strong>{content.identity.name}</strong>
      </a>

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

      <nav
        id="main-navigation"
        className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
        aria-label="Main navigation"
      >
        {content.nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
        <a
          className={styles.hireButton}
          href={content.navCta.href}
          onClick={() => setMenuOpen(false)}
        >
          {content.navCta.label}
        </a>
        <button
          className={styles.themeButton}
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  );
}
