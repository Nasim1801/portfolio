import type { CSSProperties } from 'react';
import { content, type CaseStudy } from '../data/content';
import { homeUrl, pageUrl } from '../utils/links';
import { DeviceFrame, Gallery, MediaImage } from './Media';
import { PoseTracker } from './PoseTracker';
import styles from '../styles/site.module.css';

const studyStyle = (study: CaseStudy) =>
  ({ '--project-accent': study.accent, '--project-soft': study.accentSoft }) as CSSProperties;

function ExternalAction({ label, href }: { label: string; href: string }) {
  return (
    <a className={styles.secondaryButton} href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const currentIndex = content.caseStudies.findIndex((item) => item.slug === study.slug);
  const nextStudy = content.caseStudies[(currentIndex + 1) % content.caseStudies.length];

  return (
    <main id="main-content" className={styles.casePage} style={studyStyle(study)}>
      <div className={styles.caseShell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <a href={pageUrl()}>Portfolio</a>
          <span aria-hidden="true">/</span>
          <a href={homeUrl('#work')}>Selected work</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{study.name}</span>
        </nav>

        <section className={styles.caseHero} aria-labelledby="case-title">
          <div className={styles.caseHeroCopy}>
            <p className={styles.eyebrow}>{study.eyebrow}</p>
            <div className={styles.caseIdentity}>
              {study.icon && <MediaImage item={study.icon} className={styles.caseIcon} />}
              <h1 id="case-title">{study.name}</h1>
            </div>
            <p className={styles.caseStatus}>{study.status}</p>
            <p className={styles.caseSummary}>{study.summary}</p>
            <div className={styles.rolePanel}>
              <span>My role</span>
              <p>{study.role}</p>
            </div>
            <ul className={styles.stack} aria-label={`${study.name} technology stack`}>
              {study.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {study.links.length > 0 && (
              <div className={styles.caseActions}>
                {study.links.map((link, index) =>
                  index === 0 ? (
                    <a
                      className={styles.primaryButton}
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <ExternalAction key={link.href} {...link} />
                  ),
                )}
              </div>
            )}
          </div>
          <div className={styles.caseHeroMedia}>
            <DeviceFrame
              item={study.media[0]}
              frame={study.frame}
              address={study.slug === 'physio-ai' ? 'physio-ai / live session' : undefined}
              title={study.name}
              priority
            />
          </div>
        </section>

        <section className={styles.caseFacts} aria-label={`${study.name} project facts`}>
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </section>

        <div className={styles.caseBody}>
          <aside className={styles.caseNav} aria-label="Case study sections">
            <p>Case study</p>
            <ol>
              {study.sections.slice(0, 2).map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
              <li>
                <a href="#architecture">Architecture</a>
              </li>
              {study.sections.slice(2).map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
              <li>
                <a href="#evidence">Product evidence</a>
              </li>
            </ol>
          </aside>
          <article className={styles.caseArticle}>
            {study.sections.slice(0, 2).map((section) => (
              <section id={section.id} key={section.id}>
                <p className={styles.eyebrow}>{section.eyebrow}</p>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section id="architecture" className={styles.architectureSection}>
              <p className={styles.eyebrow}>System view</p>
              <h2>{study.name} architecture</h2>
              <ol className={styles.architectureFlow}>
                {study.architecture.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              {study.slug === 'physio-ai' && (
                <div className={styles.casePose}>
                  <PoseTracker />
                </div>
              )}
            </section>

            {study.sections.slice(2).map((section) => (
              <section id={section.id} key={section.id}>
                <p className={styles.eyebrow}>{section.eyebrow}</p>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>

        <section className={styles.caseEvidence} id="evidence" aria-labelledby="evidence-title">
          <header>
            <p className={styles.eyebrow}>Real product evidence</p>
            <h2 id="evidence-title">Screens from {study.name}.</h2>
            <p>Every image below comes from the actual product or its published store material.</p>
          </header>
          <Gallery
            media={study.media}
            frame={study.frame}
            projectName={study.name}
            address={study.slug === 'physio-ai' ? 'physio-ai / product interface' : undefined}
            title={study.name}
          />
        </section>

        <section className={styles.nextStudy} aria-label="Next case study">
          <div>
            <span>Next case study</span>
            <h2>{nextStudy.name}</h2>
            <p>{nextStudy.summary}</p>
          </div>
          <a className={styles.primaryButton} href={pageUrl(`projects/${nextStudy.slug}/`)}>
            Read {nextStudy.name}
          </a>
        </section>

        <section className={styles.caseContact}>
          <p className={styles.eyebrow}>Available in London</p>
          <h2>Looking for an engineer who already knows how to own the whole product?</h2>
          <a className={styles.primaryButton} href={homeUrl('#contact')}>
            Contact Nasim
          </a>
        </section>
      </div>
    </main>
  );
}
