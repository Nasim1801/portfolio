import { useEffect, useState, type CSSProperties } from 'react';
import { content, type CaseStudy, type CaseStudySection } from '../data/content';
import { homeUrl, pageUrl } from '../utils/links';
import { Gallery, MediaImage } from './Media';
import { PoseTracker } from './PoseTracker';
import { ExternalLink, StatusChip, Tags } from './Sections';
import styles from '../styles/site.module.css';

function StudySection({ section, study }: { section: CaseStudySection; study: CaseStudy }) {
  return (
    <section id={section.id} className={styles.studySection} aria-labelledby={`${section.id}-h`}>
      <h2 id={`${section.id}-h`} data-reveal="left">
        {section.heading}
      </h2>
      <div className={styles.studyText} data-reveal="up" style={{ '--d': 1 } as CSSProperties}>
        {section.lead && <p className={styles.studyLead}>{section.lead}</p>}
        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.bullets && (
          <ul>
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
        {section.id === 'architecture' && (
          <>
            <ol className={styles.flow} aria-label={`${study.name} system flow`}>
              {study.architecture.map((item, index) => (
                <li key={item} data-reveal="left" style={{ '--d': index * 2 } as CSSProperties}>
                  {item}
                </li>
              ))}
            </ol>
            {study.slug === 'physio-ai' && (
              <div className={styles.casePose}>
                <PoseTracker />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const studies = content.caseStudies;
  const current = studies.findIndex((item) => item.slug === study.slug);
  const next = studies[(current + 1) % studies.length];
  const hasArchitectureSection = study.sections.some((section) => section.id === 'architecture');
  const sections: CaseStudySection[] = hasArchitectureSection
    ? study.sections
    : [...study.sections, { id: 'architecture', heading: 'Architecture' }];

  // Highlight the section being read in the side navigation.
  const [reading, setReading] = useState(sections[0]?.id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setReading(entry.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    document
      .querySelectorAll(`.${styles.studySection}`)
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [study.slug]);

  return (
    <main
      id="main-content"
      className={styles.study}
      data-project={study.slug}
      data-world={study.slug}
    >
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol>
          <li>
            <a href={homeUrl('#work')}>Work</a>
          </li>
          <li aria-current="page">{study.name}</li>
        </ol>
      </nav>

      <header className={styles.studyHero}>
        <div className={styles.studyIntro}>
          <div className={styles.projectTitle}>
            {study.icon && (
              <MediaImage
                item={study.icon}
                className={styles.projectIcon}
                decorative
                sizes="56px"
              />
            )}
            <div>
              <h1 style={{ viewTransitionName: `title-${study.slug}` } as CSSProperties}>
                {study.name}
              </h1>
              <p className={styles.projectKind}>{study.kind}</p>
            </div>
          </div>
          <StatusChip status={study.status} tone={study.tone} />
          <p className={styles.studySummary}>{study.summary}</p>
          {study.links.length > 0 && (
            <div className={styles.projectLinks}>
              {study.links.map(({ label, href }, index) =>
                href.startsWith('https:') ? (
                  <ExternalLink
                    key={href}
                    href={href}
                    className={index === 0 ? styles.buttonPrimary : styles.buttonSecondary}
                  >
                    {label}
                  </ExternalLink>
                ) : (
                  <a
                    key={href}
                    href={pageUrl(href)}
                    className={index === 0 ? styles.buttonPrimary : styles.buttonSecondary}
                  >
                    {label}
                  </a>
                ),
              )}
            </div>
          )}
        </div>

        <dl className={styles.glance} aria-label="At a glance" data-reveal="tilt">
          <div>
            <dt>My role</dt>
            <dd>{study.role}</dd>
          </div>
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
          <div>
            <dt>Built with</dt>
            <dd>
              <Tags items={study.stack} label={`${study.name} technology`} />
            </dd>
          </div>
        </dl>
      </header>

      <section
        className={styles.studyMedia}
        aria-label={`${study.name} screenshots`}
        data-reveal="up"
        data-world={study.slug}
      >
        <Gallery
          media={study.media}
          frame={study.frame}
          projectName={study.name}
          title={study.name}
          priority
        />
      </section>

      <div className={styles.studyBody}>
        <nav className={styles.studyNav} aria-label="Sections">
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} aria-current={reading === section.id || undefined}>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.studySections}>
          {sections.map((section) => (
            <StudySection key={section.id} section={section} study={study} />
          ))}
        </div>
      </div>

      <nav className={styles.nextStudy} aria-label="Next project">
        <p>Next project</p>
        <a href={pageUrl(`projects/${next.slug}/`)}>
          <strong>{next.name}</strong>
          <span>{next.kind}</span>
        </a>
      </nav>
    </main>
  );
}
