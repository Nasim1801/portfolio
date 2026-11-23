import { content, findCaseStudy } from '../data/content';
import { assetUrl, pageUrl } from '../utils/links';
import { DocumentIcon } from './Icons';
import { MediaImage } from './Media';
import styles from '../styles/site.module.css';

const projectIndex = [
  { slug: 'pathlife', category: 'iOS simulation', evidence: 'App Store' },
  { slug: 'sumlume', category: 'Native SwiftUI puzzle', evidence: 'App Store' },
  { slug: 'physio-ai', category: 'Real-time computer vision', evidence: 'Public code' },
] as const;

export function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>
          {content.identity.name} <span>London, UK</span>
        </p>
        <h1 id="home-title" aria-label="Software engineer">
          Software <em>engineer.</em>
        </h1>
        <p className={styles.heroLead}>
          I ship iOS apps with SwiftUI and build mobile and web software with React and TypeScript.
        </p>
        <p className={styles.availability}>Open to graduate and junior roles</p>
        <div className={styles.heroActions}>
          <a href="#work" className={styles.buttonPrimary}>
            View work
          </a>
          <a href={assetUrl(content.links.cv)} className={styles.buttonSecondary} download>
            <DocumentIcon /> Download CV
          </a>
          <a href="#contact" className={styles.textLink}>
            Contact
          </a>
        </div>
      </div>

      <nav className={styles.projectIndex} aria-labelledby="project-index-title">
        <header>
          <h2 id="project-index-title">Project index</h2>
          <p>Two App Store releases</p>
        </header>
        <ul>
          {projectIndex.map(({ slug, category, evidence }) => {
            const study = findCaseStudy(slug);
            if (!study) return null;
            return (
              <li key={slug}>
                <a href={pageUrl(`projects/${slug}/`)}>
                  {study.icon ? (
                    <MediaImage item={study.icon} decorative sizes="56px" eager />
                  ) : (
                    <MediaImage item={study.media[0]} decorative thumbnail eager />
                  )}
                  <span className={styles.indexTitle}>
                    <strong>{study.name}</strong>
                    <span>{category}</span>
                  </span>
                  <span className={styles.indexEvidence}>{evidence}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <a className={styles.indexLab} href={pageUrl('lab/')}>
          Explore the Engineering Lab
        </a>
      </nav>
    </section>
  );
}
