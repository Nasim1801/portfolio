import { content } from '../data/content';
import { pageUrl } from '../utils/links';
import styles from '../styles/site.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a href={pageUrl()}>{content.identity.name}</a>
      <span>London, UK</span>
      <nav aria-label="Footer">
        <a href={pageUrl('projects/portfolio/')}>About this site</a>
        <a href={pageUrl('lab/')}>Engineering Lab</a>
        <a href={content.links.github}>GitHub</a>
      </nav>
    </footer>
  );
}
