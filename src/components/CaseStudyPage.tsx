import { content, physioEvaluation, type CaseStudy, type CaseStudySection } from '../data/content';
import { homeUrl, pageUrl } from '../utils/links';
import { Gallery, MediaImage } from './Media';
import { ProjectLink, StatusChip, Tags } from './ProjectDetails';
import styles from '../styles/site.module.css';

function StudySection({ section, study }: { section: CaseStudySection; study: CaseStudy }) {
  return (
    <section id={section.id} className={styles.studySection} aria-labelledby={`${section.id}-h`}>
      <h2 id={`${section.id}-h`}>{section.heading}</h2>
      {section.lead && <p className={styles.studyLead}>{section.lead}</p>}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.id === 'architecture' && (
        <>
          <ol className={styles.flow} aria-label={`${study.name} system flow`}>
            {study.architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          {study.slug === 'physio-ai' && (
            <div className={styles.evidenceNote}>
              <p>
                <strong>{physioEvaluation.academicAccuracy}</strong> reported academic frame
                accuracy (Random Forest). {physioEvaluation.scope}
              </p>
              <a className={styles.textLink} href={pageUrl('lab/#pose-lab-title')}>
                Explore the illustrative pose pipeline
              </a>
            </div>
          )}
        </>
      )}
      {section.bullets && (
        <ul>
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {section.links && (
        <ul className={styles.evidenceLinks}>
          {section.links.map((link) => (
            <li key={link.href}>
              <ProjectLink className={styles.textLink} link={link} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const studies = content.caseStudies;
  const current = studies.findIndex(({ slug }) => slug === study.slug);
  const next = studies[(current + 1) % studies.length];
  const sections: CaseStudySection[] = study.sections.some(({ id }) => id === 'architecture')
    ? study.sections
    : [...study.sections, { id: 'architecture', heading: 'Architecture' }];

  return (
    <main id="main-content" tabIndex={-1} className={styles.study} data-project={study.slug}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol>
          <li>
            <a href={homeUrl('#work')}>Selected work</a>
          </li>
          <li aria-current="page">{study.name}</li>
        </ol>
      </nav>

      <div className={styles.studyHero}>
        <header className={styles.studyIntro}>
          <StatusChip status={study.status} tone={study.tone} />
          <div className={styles.studyTitle}>
            {study.icon && <MediaImage item={study.icon} decorative sizes="64px" eager />}
            <h1>{study.name}</h1>
          </div>
          <p className={styles.studyKind}>{study.kind}</p>
          <p className={styles.studySummary}>{study.summary}</p>
          <div className={styles.projectLinks}>
            {study.links.map((link, index) => (
              <ProjectLink
                key={link.href}
                link={link}
                className={index === 0 ? styles.buttonPrimary : styles.buttonSecondary}
              />
            ))}
            <a className={styles.textLink} href="#architecture">
              Engineering evidence
            </a>
          </div>
        </header>

        <section
          id="screenshots"
          tabIndex={-1}
          className={styles.studyMedia}
          aria-label={`${study.name} screenshots`}
        >
          <Gallery media={study.media} frame={study.frame} projectName={study.name} />
        </section>
        <div className={styles.studyRole}>
          <h2>My contribution</h2>
          <p>{study.role}</p>
        </div>
      </div>

      <dl className={styles.glance} aria-label="At a glance">
        {study.facts.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div>
          <dt>Built with</dt>
          <dd>
            <Tags items={study.stack} label={`${study.name} technology`} />
          </dd>
        </div>
      </dl>

      <div className={styles.studyBody}>
        <nav className={styles.studyNav} aria-label="Sections">
          <p>In this case study</p>
          <ol>
            {sections.map(({ id, heading }) => (
              <li key={id}>
                <a href={`#${id}`}>{heading}</a>
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

      <nav className={styles.nextStudy} aria-label="Related projects">
        <div>
          <p>Next project</p>
          <a href={pageUrl(`projects/${next.slug}/`)}>{next.name}</a>
        </div>
        <a className={styles.buttonSecondary} href={homeUrl('#work')}>
          All projects
        </a>
      </nav>
    </main>
  );
}
