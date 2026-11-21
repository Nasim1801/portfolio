import { useState, type CSSProperties, type ReactNode } from 'react';
import { content, type SelectedProject, type TeamProject } from '../data/content';
import { assetUrl, pageUrl } from '../utils/links';
import { DeviceFrame, Gallery, MediaImage } from './Media';
import { GithubIcon, GlobeIcon, LinkedinIcon } from './Icons';
import { ProjectConstellation } from './ProjectConstellation';
import { SkillAtlas } from './SkillAtlas';
import styles from '../styles/site.module.css';

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
      <div className={styles.heroRail} aria-hidden="true">
        <span>NM / PORTFOLIO / 2026</span>
        <span>51.5072° N · 0.1276° W</span>
      </div>
      <div className={styles.heroCopy}>
        <p className={styles.status}>
          <span aria-hidden="true" />
          {hero.status}
        </p>
        <p className={styles.heroName}>{hero.name}</p>
        <p className={styles.heroKicker}>{hero.kicker}</p>
        <h1 id="hero-title">
          I design systems.
          <br />
          <em>Then I make them real.</em>
        </h1>
        <p className={styles.heroIntro}>{hero.intro}</p>
        <div className={styles.heroProof}>
          <span>Strongest signal</span>
          <p>{hero.proof}</p>
        </div>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#work">
            Explore the work
          </a>
          <a className={styles.secondaryButton} href={pageUrl('lab/')}>
            Enter Engineering Lab
          </a>
          <a className={styles.textButton} href={assetUrl(links.cv)} download>
            Download CV ↓
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
      <ProjectConstellation />
      <a className={styles.scrollCue} href="#proof">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}

export function ProofStrip() {
  return (
    <section className={styles.proofStrip} id="proof" aria-label="Selected evidence">
      <p className={styles.proofLabel}>Proof, not promises</p>
      <div className={styles.proofGrid}>
        {content.proof.map((item, index) => (
          <div key={item.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectChapter({ project, index }: { project: SelectedProject; index: number }) {
  const study = content.caseStudies.find((item) => item.slug === project.slug);
  const media = study?.media ?? [project.media];
  return (
    <article
      className={styles.projectChapter}
      style={accentStyle(project.accent, project.accentSoft)}
      data-direction={index % 2 === 0 ? 'forward' : 'reverse'}
    >
      <div className={styles.projectChapterIndex} aria-hidden="true">
        <span>PROJECT</span>
        <strong>{String(index + 1).padStart(2, '0')}</strong>
      </div>
      <div className={styles.projectChapterCopy}>
        <p className={styles.eyebrow}>{project.label}</p>
        <div className={styles.projectTitleRow}>
          {project.icon && <MediaImage item={project.icon} className={styles.projectTitleIcon} />}
          <h3>{project.name}</h3>
        </div>
        <p className={styles.projectStatus}>{project.status}</p>
        <p className={styles.projectSummary}>{project.summary}</p>
        <div className={styles.projectOutcome}>
          <span>Verified outcome</span>
          <strong>{project.evidence}</strong>
        </div>
        <Stack items={project.stack} label={`${project.name} technology stack`} />
        <div className={styles.projectLinks}>
          <a className={styles.caseStudyLink} href={pageUrl(`projects/${project.slug}/`)}>
            Read engineering case study
          </a>
          {study?.links[0] && (
            <ExternalLink className={styles.projectExternalLink} href={study.links[0].href}>
              {study.links[0].label} ↗
            </ExternalLink>
          )}
        </div>
      </div>
      <div className={styles.projectChapterMedia}>
        <div className={styles.mediaCoordinate} aria-hidden="true">
          REAL PRODUCT / {project.slug.toUpperCase()}
        </div>
        {media.length > 1 ? (
          <Gallery
            media={media}
            frame={project.frame}
            projectName={project.name}
            title={project.name}
            address={project.slug === 'physio-ai' ? 'physio-ai / live session' : undefined}
          />
        ) : (
          <div className={styles.singleProjectFrame}>
            <DeviceFrame
              item={project.media}
              frame={project.frame}
              title={project.name}
              address="nasim1801.github.io / portfolio"
            />
          </div>
        )}
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section className={styles.workSection} id="work" aria-labelledby="work-title">
      <div className={styles.shell}>
        <SectionHeading
          eyebrow="Selected work · 01–05"
          title="Products, systems and the engineering between them."
          intro="Real interfaces and traceable decisions. Select a screen, inspect the evidence, then open the technical case study."
        />
      </div>
      <div className={styles.projectExhibition}>
        {content.selectedWork.map((project, index) => (
          <ProjectChapter key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

export function About() {
  const { about } = content;
  return (
    <section className={styles.aboutSection} id="about" aria-labelledby="about-title">
      <div className={styles.aboutSignal} aria-hidden="true">
        <span>ABOUT / 001</span>
        <strong>OWN THE WHOLE PATH</strong>
      </div>
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
        {about.principles.map((principle, index) => (
          <article key={principle.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TeamProjectFeature({ project, index }: { project: TeamProject; index: number }) {
  return (
    <article className={styles.teamFeature}>
      <div className={styles.teamMedia}>
        <span className={styles.teamNumber}>{String(index + 1).padStart(2, '0')}</span>
        <DeviceFrame
          item={project.media}
          frame={project.frame}
          title={project.name}
          address={project.name === 'CO2 Tracker' ? 'localhost:5173 / customer' : undefined}
        />
        {project.proof && (
          <div className={styles.testProof}>
            <DeviceFrame item={project.proof} frame="terminal" title="JUnit tests passing" />
          </div>
        )}
      </div>
      <div className={styles.teamCopy}>
        <p className={styles.eyebrow}>{project.label}</p>
        <h3>{project.name}</h3>
        <p className={styles.teamSummary}>{project.summary}</p>
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
    <section className={styles.teamSection} id="team-work" aria-labelledby="team-title">
      <div className={styles.shell}>
        <SectionHeading
          eyebrow="Full-stack and team systems"
          title="The work extends beyond mobile games."
          intro="Two university projects with clear ownership across React, Spring Boot, Java and testing."
        />
        <div className={styles.teamFeatures}>
          {content.teamProjects.map((project, index) => (
            <TeamProjectFeature key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const { experience } = content;
  return (
    <section
      className={styles.experienceSection}
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className={styles.shell}>
        <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />
        <ol className={styles.timeline}>
          {experience.items.map((item, index) => (
            <li
              key={`${item.date}-${item.title}`}
              className={styles.timelineItem}
              data-kind={item.kind}
            >
              <span className={styles.timelineIndex}>{String(index + 1).padStart(2, '0')}</span>
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
  return (
    <section className={styles.skillsSection} id="skills" aria-labelledby="skills-title">
      <div className={styles.shell}>
        <SectionHeading
          eyebrow="Technical evidence map"
          title="Select a technology. See where it shipped."
          intro="No arbitrary percentages. Every item connects to the product or system where I used it."
        />
        <SkillAtlas />
        <p className={styles.languageLine}>
          <GlobeIcon />
          {content.skills.languages}
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
      <div className={styles.contactNumber} aria-hidden="true">
        LET’S
        <br />
        TALK.
      </div>
      <div className={styles.contactPanel}>
        <div className={styles.contactCopy}>
          <p className={styles.eyebrow}>{contact.eyebrow} · London</p>
          <h2 id="contact-title">{contact.title}</h2>
          <p>{contact.text}</p>
          <Stack items={contact.roles} label="Roles sought" />
          <a className={styles.primaryButton} href={assetUrl(links.cv)} download>
            Download verified CV ↓
          </a>
        </div>
        <div className={styles.contactLinks}>
          <div>
            <span>01 · Email</span>
            <a href={`mailto:${links.email}`}>{links.email}</a>
            <button type="button" onClick={copyEmail} aria-live="polite">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div>
            <span>02 · LinkedIn</span>
            <ExternalLink href={links.linkedin}>linkedin.com/in/nasim-mosayebi ↗</ExternalLink>
          </div>
          <div>
            <span>03 · GitHub</span>
            <ExternalLink href={links.github}>github.com/Nasim1801 ↗</ExternalLink>
          </div>
          <div>
            <span>04 · Studio</span>
            <ExternalLink href={links.studio}>pathlifestudio.com ↗</ExternalLink>
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
      <a className={styles.footerWordmark} href={pageUrl()}>
        <span>NASIM</span>
        <strong>MOSAYEBI</strong>
      </a>
      <p>© 2026 · Software Engineer / Creative Developer · London</p>
      <div>
        <ExternalLink href={links.github} className={styles.footerIcon}>
          <GithubIcon />
          <span className={styles.srOnly}>GitHub</span>
        </ExternalLink>
        <ExternalLink href={links.linkedin} className={styles.footerIcon}>
          <LinkedinIcon />
          <span className={styles.srOnly}>LinkedIn</span>
        </ExternalLink>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
