import { useState, type ReactNode } from 'react';
import { content, findCaseStudy, type SelectedProject, type TeamProject } from '../data/content';
import { assetUrl, pageUrl } from '../utils/links';
import { DeviceFrame, Gallery, MediaImage } from './Media';
import { GithubIcon, GlobeIcon, LinkedinIcon } from './Icons';
import { SkillAtlas } from './SkillAtlas';
import styles from '../styles/site.module.css';

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

export function ProofStrip() {
  return (
    <section className={styles.proofStrip} id="proof" aria-label="Career highlights">
      {content.proof.map((item) => (
        <div key={item.label}>
          <strong>{item.value}</strong>
          <p>{item.label}</p>
        </div>
      ))}
    </section>
  );
}

function ProjectChapter({ project }: { project: SelectedProject }) {
  const study = findCaseStudy(project.slug);
  return (
    <article className={styles.projectChapter} data-project={project.slug} id={project.slug}>
      <div className={styles.projectChapterCopy}>
        <p className={styles.eyebrow}>{project.label}</p>
        <div className={styles.projectTitleRow}>
          {project.icon && (
            <MediaImage
              item={project.icon}
              className={styles.projectTitleIcon}
              decorative
              sizes="62px"
            />
          )}
          <h3>{project.name}</h3>
        </div>
        <p className={styles.projectStatus}>{project.status}</p>
        <p className={styles.projectSummary}>{project.summary}</p>
        <p className={styles.projectOutcome}>{project.evidence}</p>
        <Stack items={project.stack} label={`${project.name} technology stack`} />
        <div className={styles.projectLinks}>
          <a className={styles.caseStudyLink} href={pageUrl(`projects/${project.slug}/`)}>
            Read case study
          </a>
          {study?.links[0] && (
            <ExternalLink className={styles.projectExternalLink} href={study.links[0].href}>
              {study.links[0].label}
            </ExternalLink>
          )}
        </div>
      </div>
      <div className={styles.projectChapterMedia}>
        <Gallery
          media={study?.media ?? [project.media]}
          frame={project.frame}
          projectName={project.name}
          title={project.name}
        />
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section className={styles.workSection} id="work" aria-labelledby="work-title">
      <header className={styles.workHeading}>
        <div>
          <p className={styles.eyebrow}>The exhibition</p>
          <h2 id="work-title">
            Selected <em>work</em>
          </h2>
        </div>
        <nav aria-label="Jump to a project">
          {content.selectedWork.map((project) => (
            <a key={project.slug} href={`#${project.slug}`}>
              {project.name}
            </a>
          ))}
        </nav>
      </header>
      <div className={styles.projectExhibition}>
        {content.selectedWork.map((project) => (
          <ProjectChapter key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

export function LabInvitation() {
  return (
    <section className={styles.labInvitation} aria-labelledby="lab-invitation-title">
      <div>
        <p className={styles.eyebrow}>Built for the browser</p>
        <h2 id="lab-invitation-title">
          Engineering <em>Lab</em>
        </h2>
      </div>
      <p>
        Play a round of number matching or trace the steps from pose landmarks to live feedback.
      </p>
      <a className={styles.primaryButton} href={pageUrl('lab/')}>
        Try the demos
      </a>
    </section>
  );
}

export function About() {
  const { about } = content;
  return (
    <section className={styles.aboutSection} id="about" aria-labelledby="about-title">
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
    </section>
  );
}

function TeamProjectFeature({ project }: { project: TeamProject }) {
  return (
    <article className={styles.teamFeature}>
      <div className={styles.teamMedia}>
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
          <a className={styles.caseStudyLink} href={pageUrl(`projects/${project.slug}/`)}>
            Read case study
          </a>
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
    <section className={styles.teamSection} id="team-work" aria-label="Team projects">
      <div className={styles.shell}>
        <SectionHeading
          eyebrow="Full-stack and team systems"
          title="Built in teams"
          intro="Two university projects with clear ownership across React, Spring Boot, Java and testing."
        />
        <div className={styles.teamFeatures}>
          {content.teamProjects.map((project) => (
            <TeamProjectFeature key={project.name} project={project} />
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
      aria-label="Experience and education"
    >
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
  return (
    <section className={styles.skillsSection} id="skills" aria-label="Technical skills">
      <div className={styles.shell}>
        <SectionHeading
          eyebrow="Technical evidence map"
          title="Technical practice"
          intro="Explore the technologies I used and the projects they helped me build."
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
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.getSelection()?.selectAllChildren(document.getElementById('contact-email')!);
    }
  };
  return (
    <section className={styles.contactSection} id="contact" aria-labelledby="contact-title">
      <div className={styles.contactPanel}>
        <div className={styles.contactCopy}>
          <p className={styles.eyebrow}>{contact.eyebrow} · London</p>
          <h2 id="contact-title">{contact.title}</h2>
          <p>{contact.text}</p>
          <Stack items={contact.roles} label="Roles sought" />
          <a className={styles.primaryButton} href={assetUrl(links.cv)} download>
            Download CV
          </a>
        </div>
        <div className={styles.contactLinks}>
          <div>
            <span>Email</span>
            <a id="contact-email" href={`mailto:${links.email}`}>
              {links.email}
            </a>
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
    <footer id="site-footer" className={styles.footer}>
      <a className={styles.footerWordmark} href={pageUrl()}>
        <span>NASIM</span>
        <strong>MOSAYEBI</strong>
      </a>
      <p>© 2026 · Software Engineer & Creative Developer · London</p>
      <div>
        <ExternalLink href={links.github} className={styles.footerIcon}>
          <GithubIcon />
          <span className={styles.srOnly}>GitHub</span>
        </ExternalLink>
        <ExternalLink href={links.linkedin} className={styles.footerIcon}>
          <LinkedinIcon />
          <span className={styles.srOnly}>LinkedIn</span>
        </ExternalLink>
        <a href="#">Back to top</a>
      </div>
    </footer>
  );
}
