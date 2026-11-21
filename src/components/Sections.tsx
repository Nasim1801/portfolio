import { lazy, Suspense, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { content, type SelectedProject, type TeamProject } from '../data/content';
import { assetUrl, pageUrl } from '../utils/links';
import { DeviceFrame, MediaImage } from './Media';
import { GithubIcon, GlobeIcon, LinkedinIcon } from './Icons';
import styles from '../styles/site.module.css';

const HeroMotionVisual = lazy(() =>
  import('./HeroMotionVisual').then((module) => ({ default: module.HeroMotionVisual })),
);

const accentStyle = (accent: string, soft: string) =>
  ({ '--project-accent': accent, '--project-soft': soft }) as CSSProperties;

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function Stack({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className={styles.stack} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className={styles.sectionHeading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </header>
  );
}

export function Hero() {
  const { hero, links } = content;

  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className={styles.status}>
          <span aria-hidden="true" />
          {hero.status}
        </p>
        <p className={styles.heroName}>{hero.name}</p>
        <p className={styles.heroKicker}>{hero.kicker}</p>
        <h1 id="hero-title">{hero.headline}</h1>
        <p className={styles.heroIntro}>{hero.intro}</p>
        <p className={styles.heroProof}>{hero.proof}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </a>
          <a className={styles.secondaryButton} href={assetUrl(hero.secondaryCta.href)} download>
            {hero.secondaryCta.label}
          </a>
          <a className={styles.textButton} href="#contact">
            Contact me
          </a>
        </div>
        <div className={styles.heroSocials} aria-label="Professional profiles">
          <ExternalLink href={links.github} className={styles.iconLink}>
            <GithubIcon />
            <span>GitHub</span>
          </ExternalLink>
          <ExternalLink href={links.linkedin} className={styles.iconLink}>
            <LinkedinIcon />
            <span>LinkedIn</span>
          </ExternalLink>
        </div>
      </div>
      <ProgressiveHeroVisual />
    </section>
  );
}

function ProgressiveHeroVisual() {
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const browserWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const fallbackTimer = window.setTimeout(() => setMotionReady(true), 1800);
    const idleId = browserWindow.requestIdleCallback?.(
      () => {
        window.clearTimeout(fallbackTimer);
        setMotionReady(true);
      },
      { timeout: 1400 },
    );
    return () => {
      window.clearTimeout(fallbackTimer);
      if (idleId !== undefined) browserWindow.cancelIdleCallback?.(idleId);
    };
  }, []);

  return motionReady ? (
    <Suspense fallback={<HeroVisualStatic />}>
      <HeroMotionVisual />
    </Suspense>
  ) : (
    <HeroVisualStatic />
  );
}

function HeroVisualStatic() {
  const { hero } = content;
  return (
    <div className={styles.heroVisual} aria-label="Selected project screenshots">
      <div className={styles.heroPose}>
        <div className={styles.heroSignalCard}>
          <span>Physio-AI</span>
          <strong>96.23%</strong>
          <small>pose classifier accuracy</small>
        </div>
      </div>
      <div className={styles.heroPhoneOne}>
        <DeviceFrame item={hero.visual.sumlume} frame="phone" compact priority />
      </div>
      <div className={styles.heroPhoneTwo}>
        <DeviceFrame item={hero.visual.pathlife} frame="phone" compact priority />
      </div>
      <div className={styles.accuracyChip}>
        <span>Published products</span>
        <strong>2 live on iOS</strong>
      </div>
    </div>
  );
}

export function ProofStrip() {
  return (
    <section className={styles.proofStrip} aria-label="Selected evidence">
      <div className={styles.shell}>
        {content.proof.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectVisual({ project }: { project: SelectedProject }) {
  return (
    <div className={styles.projectVisual}>
      <div className={styles.projectVisualHalo} aria-hidden="true" />
      {project.icon && <MediaImage item={project.icon} className={styles.projectIcon} />}
      <DeviceFrame
        item={project.media}
        frame={project.frame}
        priority={project.slug === 'sumlume'}
      />
    </div>
  );
}

function ProjectCard({ project, index }: { project: SelectedProject; index: number }) {
  return (
    <article
      className={`${styles.projectCard} ${index === 0 ? styles.projectCardFeatured : ''}`}
      style={accentStyle(project.accent, project.accentSoft)}
    >
      <div className={styles.projectCardCopy}>
        <p className={styles.eyebrow}>{project.label}</p>
        <div className={styles.projectTitleRow}>
          {project.icon && <MediaImage item={project.icon} className={styles.projectTitleIcon} />}
          <h3>{project.name}</h3>
        </div>
        <p className={styles.projectStatus}>{project.status}</p>
        <p className={styles.projectSummary}>{project.summary}</p>
        <p className={styles.projectEvidence}>{project.evidence}</p>
        <Stack items={project.stack} label={`${project.name} technology stack`} />
        <a className={styles.caseStudyLink} href={pageUrl(`projects/${project.slug}/`)}>
          Read the case study
        </a>
      </div>
      <ProjectVisual project={project} />
    </article>
  );
}

export function SelectedWork() {
  return (
    <section className={styles.section} id="work" aria-labelledby="work-title">
      <div className={styles.shell}>
        <SectionHeading
          eyebrow="Selected work"
          title="Products with real engineering evidence."
          intro="Published mobile apps, an applied machine-learning system and a product still being built in public view."
        />
        <div className={styles.projectGrid}>
          {content.selectedWork.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  const { about } = content;
  return (
    <section
      className={`${styles.section} ${styles.aboutSection}`}
      id="about"
      aria-labelledby="about-title"
    >
      <div className={styles.shell}>
        <div className={styles.aboutGrid}>
          <div>
            <p className={styles.eyebrow}>{about.eyebrow}</p>
            <h2 id="about-title">{about.title}</h2>
          </div>
          <div className={styles.aboutCopy}>
            <p className={styles.aboutLead}>{about.intro}</p>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className={styles.principleGrid}>
          {about.principles.map((principle) => (
            <article key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ project }: { project: TeamProject }) {
  return (
    <article className={styles.teamCard}>
      <div className={styles.teamMedia}>
        <DeviceFrame
          item={project.media}
          frame={project.frame}
          title={project.name}
          address={project.name.toLowerCase().replaceAll(' ', '-')}
        />
        {project.proof && (
          <div className={styles.testProof}>
            <DeviceFrame item={project.proof} frame="terminal" title="JUnit test run" />
          </div>
        )}
      </div>
      <div className={styles.teamCopy}>
        <p className={styles.eyebrow}>{project.label}</p>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <dl>
          <div>
            <dt>My role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{project.outcome}</dd>
          </div>
        </dl>
        <Stack items={project.stack} label={`${project.name} technology stack`} />
        <div className={styles.teamLinks}>
          {project.links.map((link) => (
            <ExternalLink key={link.href} href={link.href} className={styles.caseStudyLink}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </article>
  );
}

export function TeamProjects() {
  return (
    <section className={`${styles.section} ${styles.teamSection}`} aria-labelledby="team-title">
      <div className={styles.shell}>
        <SectionHeading
          eyebrow="Team projects"
          title="Clear ownership inside collaborative work."
          intro="The project is shared. The contribution is specific."
        />
        <div className={styles.teamGrid}>
          {content.teamProjects.map((project) => (
            <TeamCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const { experience } = content;
  return (
    <section className={styles.section} id="experience" aria-labelledby="experience-title">
      <div className={styles.shell}>
        <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />
        <ol className={styles.timeline}>
          {experience.items.map((item) => (
            <li
              key={`${item.date}-${item.title}`}
              className={styles.timelineItem}
              data-kind={item.kind}
            >
              <time>{item.date}</time>
              <div>
                <h3>{item.title}</h3>
                <p className={styles.timelinePlace}>{item.place}</p>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Skills() {
  const { skills } = content;
  return (
    <section
      className={`${styles.section} ${styles.skillsSection}`}
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className={styles.shell}>
        <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
        <div className={styles.skillGrid}>
          {skills.groups.map((group) => (
            <article key={group.name}>
              <h3>{group.name}</h3>
              <Stack items={group.items} label={group.name} />
            </article>
          ))}
        </div>
        <p className={styles.languageLine}>
          <GlobeIcon />
          {skills.languages}
        </p>
      </div>
    </section>
  );
}

export function Contact() {
  const { contact, links } = content;
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard.writeText(links.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className={styles.contactSection} id="contact" aria-labelledby="contact-title">
      <div className={styles.contactPanel}>
        <div>
          <p className={styles.eyebrow}>{contact.eyebrow}</p>
          <h2 id="contact-title">{contact.title}</h2>
          <p>{contact.text}</p>
          <Stack items={contact.roles} label="Roles sought" />
          <a className={styles.contactCv} href={assetUrl(links.cv)} download>
            Download CV
          </a>
        </div>
        <div className={styles.contactLinks}>
          <div>
            <span>Email</span>
            <a href={`mailto:${links.email}`}>{links.email}</a>
            <button type="button" onClick={copyEmail} aria-live="polite">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div>
            <span>LinkedIn</span>
            <ExternalLink href={links.linkedin}>linkedin.com/in/nasim-mosayebi</ExternalLink>
          </div>
          <div>
            <span>GitHub</span>
            <ExternalLink href={links.github}>github.com/Nasim1801</ExternalLink>
          </div>
          <div>
            <span>Studio</span>
            <ExternalLink href={links.studio}>pathlifestudio.com</ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { links } = content;
  return (
    <footer className={styles.footer}>
      <p>© 2026 Nasim Mosayebi · London</p>
      <div>
        <ExternalLink href={links.github} className={styles.footerIcon}>
          <GithubIcon />
          <span className={styles.srOnly}>GitHub</span>
        </ExternalLink>
        <ExternalLink href={links.linkedin} className={styles.footerIcon}>
          <LinkedinIcon />
          <span className={styles.srOnly}>LinkedIn</span>
        </ExternalLink>
        <ExternalLink href={links.studio} className={styles.footerIcon}>
          <GlobeIcon />
          <span className={styles.srOnly}>PathLife Studio</span>
        </ExternalLink>
      </div>
      <a href="#top">Back to top</a>
    </footer>
  );
}
