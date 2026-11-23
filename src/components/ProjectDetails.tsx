import type { LinkItem, StatusTone } from '../data/content';
import { pageUrl } from '../utils/links';
import styles from '../styles/site.module.css';

export function StatusChip({ status, tone }: { status: string; tone: StatusTone }) {
  return (
    <span className={styles.status} data-tone={tone}>
      {status}
    </span>
  );
}

export function Tags({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className={styles.tags} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ProjectLink({ link, className }: { link: LinkItem; className?: string }) {
  const href = link.href.startsWith('https:') ? link.href : pageUrl(link.href);
  return (
    <a className={className} href={href}>
      {link.label}
    </a>
  );
}
