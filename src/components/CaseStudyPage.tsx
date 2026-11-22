import { content, type CaseStudy, type CaseStudySection } from '../data/content';
import { homeUrl, pageUrl } from '../utils/links';
import { Gallery, MediaImage } from './Media';
import { PoseTracker } from './PoseTracker';
import styles from '../styles/site.module.css';

function StudySection({ section }: { section: CaseStudySection }) {
  return (
    <section id={section.id}>
      <p className={styles.eyebrow}>{section.eyebrow.replace(/^\d+ · /, '')}</p>
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
  );
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const current = content.caseStudies.findIndex((item) => item.slug === study.slug);
  const next = content.caseStudies[(current + 1) % content.caseStudies.length];
  const isPortrait = study.frame === 'phone' || study.frame === 'print';

  return (
    <main
      id="main-content"
      className={styles.casePage}
      data-project={study.slug}
      data-layout={isPortrait ? 'portrait' : 'landscape'}
    >
      <div className={styles.caseShell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <a href={homeUrl('#work')}>Selected work</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{study.name}</span>
        </nav>

        <header className={styles.caseHero}>
          <div className={styles.caseHeroCopy}>
            <p className={styles.eyebrow}>{study.eyebrow}</p>
            <div className={styles.caseIdentity}>
              {study.icon && (
                <MediaImage item={study.icon} className={styles.caseIcon} decorative sizes="72px" />
              )}
              <h1>{study.name}</h1>
            </div>
            <p className={styles.caseStatus}>{study.status}</p>
            <p className={styles.caseSummary}>{study.summary}</p>
            {study.links.length > 0 && (
              <div className={styles.caseActions}>
                {study.links.map(({ label, href }, index) => (
                  <a
                    className={index === 0 ? styles.primaryButton : styles.secondaryButton}
                    key={href}
                    href={href}
                    target={href.startsWith('https:') ? '_blank' : undefined}
                    rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <section
            className={styles.caseHeroMedia}
            id="evidence"
            aria-label={`${study.name} screenshot gallery`}
          >
            <Gallery
              media={study.media}
              frame={study.frame}
              projectName={study.name}
              title={study.name}
              priority
            />
          </section>
        </header>

        <section className={styles.caseFacts} aria-label="Project facts">
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </section>

        <div className={styles.caseBody}>
          <aside className={styles.caseNav} aria-label="Case study sections">
            <p>In this case study</p>
            <ol>
              <li>
                <a href="#responsibilities">Responsibilities</a>
              </li>
              <li>
                <a href="#architecture">Architecture</a>
              </li>
              {study.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </aside>
          <article className={styles.caseArticle}>
            <section id="responsibilities" className={styles.rolePanel}>
              <p className={styles.eyebrow}>My role</p>
              <h2>Responsibilities</h2>
              <p>{study.role}</p>
              <ul className={styles.stack} aria-label="Technology stack">
                {study.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section id="architecture" className={styles.architectureSection}>
              <p className={styles.eyebrow}>System design</p>
              <h2>Architecture</h2>
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

            {study.sections.map((section) => (
              <StudySection section={section} key={section.id} />
            ))}
          </article>
        </div>

        <section className={styles.nextStudy} aria-label="Next case study">
          <div>
            <p className={styles.eyebrow}>Next case study</p>
            <h2>{next.name}</h2>
            <p>{next.summary}</p>
          </div>
          <a className={styles.primaryButton} href={pageUrl(`projects/${next.slug}/`)}>
            Read case study
          </a>
        </section>
      </div>
    </main>
  );
}
