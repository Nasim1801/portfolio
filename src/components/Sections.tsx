import { useState } from 'react';
import { content, findCaseStudy, type CaseStudy } from '../data/content';
import { assetUrl, pageUrl } from '../utils/links';
import { DocumentIcon, GithubIcon, LinkedinIcon, MailIcon } from './Icons';
import { MediaImage } from './Media';
import { ProjectLink, StatusChip, Tags } from './ProjectDetails';
import styles from '../styles/site.module.css';

function FeatureCard({
  project,
  study,
}: {
  project: (typeof content.featured)[number];
  study: CaseStudy;
}) {
  const landscape = study.frame === 'browser';
  const href = pageUrl(`projects/${study.slug}/`);
  return (
    <article
      id={study.slug}
      tabIndex={-1}
      className={styles.featureCard}
      data-project={study.slug}
      data-wide={landscape || undefined}
    >
      <a
        className={styles.cover}
        href={`${href}#screenshots`}
        data-project-artwork
        aria-label={`Open ${study.name} screenshot gallery`}
      >
        <MediaImage
          item={project.preview[0]}
          sizes={landscape ? '(max-width: 760px) 90vw, 560px' : '(max-width: 460px) 45vw, 196px'}
        />
        {project.preview[1] && (
          <MediaImage item={project.preview[1]} decorative sizes="(max-width: 460px) 37vw, 160px" />
        )}
      </a>
      <div className={styles.cardBody}>
        <StatusChip status={study.status} tone={study.tone} />
        <h3>
          <a href={href}>{study.name}</a>
        </h3>
        <p className={styles.cardSummary}>{project.summary}</p>
        <p className={styles.cardRole}>
          <strong>My role</strong> {project.role}
        </p>
        <Tags items={project.stack} label={`${study.name} technology`} />
        <div className={styles.cardLinks}>
          <a
            href={href}
            className={styles.buttonSecondary}
            aria-label={`Read the case study for ${study.name}`}
          >
            Case study
          </a>
          {project.links.map((link) => (
            <ProjectLink key={link.href} link={link} className={styles.textLink} />
          ))}
        </div>
      </div>
    </article>
  );
}

function SupportingCard({ study }: { study: CaseStudy }) {
  const project = content.more.find(({ slug }) => slug === study.slug);
  const thumbnail = project?.thumbnail ?? study.media[0];
  const icon = study.slug === 'pawlife' ? study.icon : undefined;
  const href = pageUrl(`projects/${study.slug}/`);
  const link = study.links[0];
  return (
    <article id={study.slug} tabIndex={-1} className={styles.supportCard} data-project={study.slug}>
      <a
        className={styles.supportImage}
        href={`${href}#screenshots`}
        data-project-artwork
        aria-label={`Open ${study.name} screenshot gallery`}
      >
        <MediaImage item={thumbnail} sizes={icon ? '120px' : '(max-width: 760px) 84vw, 410px'} />
        {icon && <MediaImage item={icon} className={styles.supportIcon} decorative sizes="72px" />}
      </a>
      <div className={styles.supportBody}>
        <StatusChip status={study.status} tone={study.tone} />
        <h4>{project?.name ?? study.name}</h4>
        <p>{project?.summary ?? study.summary}</p>
        <p>
          <strong>My role</strong> {project?.role ?? study.role}
        </p>
        <Tags
          items={project?.stack ?? study.stack.slice(0, 3)}
          label={`${study.name} technology`}
        />
        <div className={styles.supportLinks}>
          <a
            className={styles.textLink}
            href={href}
            aria-label={`Read the case study for ${study.name}`}
          >
            Case study
          </a>
          {link && <ProjectLink link={link} className={styles.textLink} />}
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section className={styles.section} id="work" tabIndex={-1} aria-labelledby="work-title">
      <div className={styles.sectionHead}>
        <h2 id="work-title">Selected work</h2>
        <p>
          Shipped iOS apps and a real-time computer vision system, with the decisions and checks
          behind each project.
        </p>
      </div>
      <div className={styles.featureGrid}>
        {content.featured.map((project) => {
          const study = findCaseStudy(project.slug);
          return study && <FeatureCard key={study.slug} project={project} study={study} />;
        })}
      </div>
      <div className={styles.moreWork}>
        <h3>More engineering work</h3>
        <div className={styles.supportGrid}>
          {['portfolio', 'co2-tracker', 'pawlife', 'hospital-appointment-system'].map((slug) => {
            const study = findCaseStudy(slug);
            return study && <SupportingCard key={slug} study={study} />;
          })}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const [active, setActive] = useState<string>();
  const activeProof = content.skills
    .map(({ items }) => items.find(({ name }) => name === active)?.proof)
    .find((proof): proof is NonNullable<typeof proof> => proof !== undefined);
  return (
    <section className={styles.section} id="skills" tabIndex={-1} aria-labelledby="skills-title">
      <div className={styles.sectionHead}>
        <h2 id="skills-title">Skills in practice</h2>
        <p>
          Select a skill to highlight related work. Every skill links to the projects where I used
          it.
        </p>
      </div>
      <ul className={styles.skillIndex}>
        {content.caseStudies.map((study) => (
          <li key={study.slug}>
            <a
              href={pageUrl(`projects/${study.slug}/`)}
              data-lit={
                (activeProof as readonly string[] | undefined)?.includes(study.slug) || undefined
              }
            >
              {study.name}
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.skillGroups}>
        {content.skills.map((group) => (
          <section className={styles.skillGroup} key={group.group}>
            <h3>{group.group}</h3>
            <ul>
              {group.items.map(({ name, proof }) => (
                <li key={name}>
                  <button
                    type="button"
                    data-enhanced
                    aria-pressed={active === name}
                    onClick={() => setActive(active === name ? undefined : name)}
                  >
                    {name}
                  </button>
                  <strong className={styles.staticSkill}>{name}</strong>
                  <p>
                    {proof.map((slug, index) => (
                      <span key={slug}>
                        {index > 0 && ', '}
                        <a href={pageUrl(`projects/${slug}/`)}>{findCaseStudy(slug)?.name}</a>
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section
      className={`${styles.section} ${styles.about}`}
      id="about"
      tabIndex={-1}
      aria-labelledby="about-title"
    >
      <h2 id="about-title">About me</h2>
      <div>
        {content.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section
      className={styles.section}
      id="experience"
      tabIndex={-1}
      aria-labelledby="experience-title"
    >
      <div className={styles.sectionHead}>
        <h2 id="experience-title">Experience and education</h2>
      </div>
      <ol className={styles.timeline}>
        {content.experience.map(({ title, date, place, description }) => (
          <li key={title}>
            <p className={styles.timelineDate}>{date}</p>
            <div>
              <h3>{title}</h3>
              <p className={styles.timelinePlace}>{place}</p>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Contact() {
  const { links, contact } = content;
  return (
    <section className={styles.contact} id="contact" tabIndex={-1} aria-labelledby="contact-title">
      <div>
        <h2 id="contact-title">Let’s talk.</h2>
        <p>{contact.text}</p>
      </div>
      <div className={styles.contactActions}>
        <a className={styles.buttonPrimary} href={`mailto:${links.email}`}>
          <MailIcon /> Email me
        </a>
        <a className={styles.buttonSecondary} href={assetUrl(links.cv)} download>
          <DocumentIcon /> Download CV
        </a>
      </div>
      <ul>
        <li>
          <a href={links.linkedin}>
            <LinkedinIcon /> LinkedIn
          </a>
        </li>
        <li>
          <a href={links.github}>
            <GithubIcon /> GitHub
          </a>
        </li>
      </ul>
    </section>
  );
}
