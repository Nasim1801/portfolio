import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  content,
  type Co2ProjectData,
  type HospitalProjectData,
  type Project,
} from '../data/content';
import { ArrowRight, ArrowUpRight, GithubIcon, GlobeIcon, LinkedinIcon } from './Icons';
import { DeviceFrame, Gallery, MediaImage, OptionalImage } from './Media';
import { PoseTracker } from './PoseTracker';
import { Reveal } from './Reveal';
import { assetUrl, isPlaceholderLink } from '../utils/links';
import styles from '../styles/site.module.css';

const sectionStyle = (accent: string, accentSoft: string) =>
  ({ '--project-accent': accent, '--project-soft': accentSoft }) as CSSProperties;

const HeroMotionVisual = lazy(() =>
  import('./HeroMotionVisual').then((module) => ({ default: module.HeroMotionVisual })),
);

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function useOnceInView<T extends Element>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className={styles.sectionHeader}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {intro && <p>{intro}</p>}
    </Reveal>
  );
}

function TextLink({ href, label }: { href: string; label: string }) {
  if (isPlaceholderLink(href)) {
    return (
      <span
        className={styles.placeholderLink}
        title="Replace this placeholder in src/data/content.ts"
      >
        {label} <span>TODO</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {label} <ArrowUpRight />
    </a>
  );
}

function CvAction({ className }: { className: string }) {
  if (!content.links.cvAvailable) {
    return (
      <span
        className={`${className} ${styles.cvPlaceholder}`}
        aria-label="Download CV unavailable. TODO: add the CV PDF"
      >
        Download CV <small>[TODO: add PDF]</small>
      </span>
    );
  }

  return (
    <a className={className} href={assetUrl(content.links.cv)} download>
      Download CV <ArrowRight />
    </a>
  );
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  const social = [
    { label: 'GitHub', href: content.links.github, icon: <GithubIcon /> },
    { label: 'LinkedIn', href: content.links.linkedin, icon: <LinkedinIcon /> },
    { label: 'PathLife Studio', href: content.links.studio, icon: <GlobeIcon /> },
  ];

  return (
    <div className={`${styles.socialLinks} ${compact ? styles.socialLinksCompact : ''}`}>
      {social.map((item) =>
        isPlaceholderLink(item.href) ? (
          <span
            key={item.label}
            aria-label={`${item.label} link to be added`}
            title="Add link in content.ts"
          >
            {item.icon}
          </span>
        ) : (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            {item.icon}
          </a>
        ),
      )}
    </div>
  );
}

export function Hero() {
  const { hero } = content;
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMotionReady(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <div>
          <p className={styles.statusBadge}>
            <span aria-hidden="true" />
            {hero.status}
          </p>
          <p className={styles.heroName}>{content.identity.name}</p>
          <p className={styles.heroKicker}>{hero.kicker}</p>
          <h1 id="hero-title">{hero.headline}</h1>
          <p className={styles.heroIntro}>{hero.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href={hero.primaryCta.href}>
              {hero.primaryCta.label} <ArrowRight />
            </a>
            <a className={styles.secondaryButton} href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
            <CvAction className={styles.secondaryButton} />
            <SocialLinks />
          </div>
        </div>
      </div>

      {motionReady ? (
        <Suspense fallback={<HeroVisualFallback />}>
          <HeroMotionVisual />
        </Suspense>
      ) : (
        <HeroVisualFallback />
      )}
    </section>
  );
}

function HeroVisualFallback() {
  const { hero } = content;
  return (
    <div className={styles.heroVisual} aria-label="Selected project screenshots">
      <div className={styles.heroPose}>
        <PoseTracker compact />
      </div>
      <div className={styles.heroPhoneOne}>
        <DeviceFrame item={hero.visual.pathlife} frame="phone" compact priority />
      </div>
      <div className={styles.heroPhoneTwo}>
        <DeviceFrame item={hero.visual.pawlife} frame="phone" compact priority />
      </div>
      <div className={styles.accuracyChip}>
        <span>ML result</span>
        <strong>{hero.accuracy}</strong>
      </div>
    </div>
  );
}

function CountUp({
  target,
  decimals = 0,
  suffix = '',
}: {
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const [ref, inView] = useOnceInView<HTMLSpanElement>();
  const reduceMotion = useReducedMotionPreference();
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let animationFrame = 0;
    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, reduceMotion, target]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  return (
    <section className={styles.statsStrip} aria-label="Project results">
      <div className={styles.statsInner}>
        {content.metrics.map((metric) => (
          <div className={styles.stat} key={metric.label}>
            <strong>
              {metric.count === undefined ? (
                metric.value
              ) : (
                <CountUp target={metric.count} decimals={metric.decimals} suffix={metric.suffix} />
              )}
            </strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Studio() {
  const { studio } = content;
  return (
    <section
      className={`${styles.section} ${styles.studioSection}`}
      id="studio"
      aria-labelledby="studio-title"
    >
      <div className={styles.shell}>
        <div className={styles.studioIntro}>
          <Reveal>
            <p className={styles.eyebrow}>{studio.eyebrow}</p>
            <h2 id="studio-title">{studio.title}</h2>
          </Reveal>
          <Reveal>
            <p className={styles.studioDescription}>{studio.description}</p>
            <TextLink href={studio.link.href} label={studio.link.label} />
          </Reveal>
        </div>
        <div className={styles.gameGrid}>
          {studio.games.map((game) => (
            <a className={styles.gameCard} href={game.href} key={game.name}>
              <div className={styles.gameIconWrap}>
                <MediaImage
                  item={{ src: game.icon, alt: game.alt, width: 512, height: 512 }}
                  placeholderLabel="Screenshot coming soon"
                />
              </div>
              <div>
                <span>{game.status}</span>
                <h3>{game.name}</h3>
              </div>
              <ArrowRight />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShipStory() {
  const { shipStory } = content;
  return (
    <section className={`${styles.section} ${styles.storySection}`} aria-labelledby="story-title">
      <div className={styles.shell}>
        <SectionHeader
          id="story-title"
          eyebrow={shipStory.eyebrow}
          title={shipStory.title}
          intro={shipStory.intro}
        />
        <div className={styles.storyGrid}>
          {shipStory.steps.map((step) => (
            <Reveal className={styles.storyStep} key={step.number}>
              <span className={styles.storyNumber}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <pre aria-label={`${step.title} status`}>
                <code>{step.terminal.join('\n')}</code>
              </pre>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectFeature({ project, reversed }: { project: Project; reversed?: boolean }) {
  return (
    <section
      className={`${styles.projectSection} ${reversed ? styles.projectReversed : ''}`}
      id={project.id}
      style={sectionStyle(project.accent, project.accentSoft)}
      aria-labelledby={`${project.id}-title`}
    >
      <div className={styles.projectBackdrop} aria-hidden="true" />
      <div className={`${styles.shell} ${styles.projectGrid}`}>
        <Reveal className={styles.projectMedia}>
          <Gallery media={project.media} frame={project.frame} projectName={project.name} />
        </Reveal>
        <Reveal className={styles.projectCopy}>
          <p className={styles.eyebrow}>{project.eyebrow}</p>
          <div className={styles.projectHeading}>
            <MediaImage item={project.icon} />
            <h2 id={`${project.id}-title`}>{project.name}</h2>
          </div>
          <p className={styles.projectSummary}>{project.summary}</p>
          <p className={styles.projectRole}>
            <span>My role</span>
            {project.role}
          </p>
          <div className={styles.miniStats}>
            {project.stats.map((stat) => (
              <span key={stat}>{stat}</span>
            ))}
          </div>
          <dl className={styles.projectDetails}>
            {project.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.text}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.stackChips} aria-label={`${project.name} technology stack`}>
            {project.stack.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          {project.links.length > 0 && (
            <div className={styles.projectLinks}>
              {project.links.map((link) => (
                <TextLink key={link.label} href={link.href} label={link.label} />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function AccuracyGauge() {
  const [ref, inView] = useOnceInView<HTMLDivElement>(0.6);
  const reduceMotion = useReducedMotionPreference();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (inView ? content.physio.accuracy : 0) / 100);

  return (
    <div
      className={styles.gauge}
      ref={ref}
      aria-label={`${content.physio.accuracy}% model accuracy`}
    >
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={radius} className={styles.gaugeTrack} />
        <circle
          cx="64"
          cy="64"
          r={radius}
          className={styles.gaugeValue}
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: offset,
            transition: reduceMotion
              ? 'none'
              : 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      <div>
        <strong>{inView ? content.physio.accuracy : 0}%</strong>
        <span>accuracy</span>
      </div>
    </div>
  );
}

export function PhysioProject() {
  const { physio } = content;
  return (
    <section
      className={`${styles.section} ${styles.physioSection}`}
      id={physio.id}
      aria-labelledby="physio-title"
    >
      <div className={styles.shell}>
        <div className={styles.physioTop}>
          <Reveal>
            <p className={styles.eyebrow}>{physio.eyebrow}</p>
            <h2 id="physio-title">{physio.name}</h2>
            <p className={styles.projectSummary}>{physio.summary}</p>
            <p className={styles.projectRole}>
              <span>My role</span>
              {physio.role}
            </p>
            <div className={styles.stackChips} aria-label="Physio-AI technology stack">
              {physio.stack.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <div className={styles.projectLinks}>
              {physio.links.map((link) => (
                <TextLink key={link.label} href={link.href} label={link.label} />
              ))}
            </div>
          </Reveal>
          <Reveal>
            <AccuracyGauge />
          </Reveal>
        </div>
        <Reveal className={styles.physioMedia}>
          <PoseTracker />
          <DeviceFrame
            item={physio.media.screenshot}
            frame="browser"
            address="physio-ai / live feedback"
          />
        </Reveal>
        <div className={styles.pipeline} aria-label="Physio-AI machine learning pipeline">
          {physio.pipeline.map((step, index) => (
            <Reveal className={styles.pipelineStep} key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
              {index < physio.pipeline.length - 1 && <ArrowRight />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Co2Feature({ project }: { project: Co2ProjectData }) {
  return (
    <article
      className={styles.co2Feature}
      id={project.id}
      style={sectionStyle(project.accent, project.accentSoft)}
      aria-labelledby="co2-tracker-title"
    >
      <div className={styles.co2Glow} aria-hidden="true" />
      <Reveal className={styles.co2Header}>
        <div className={styles.co2TitleBlock}>
          <p className={styles.eyebrow}>{project.meta}</p>
          <h3 id="co2-tracker-title">{project.name}</h3>
          <p>{project.description}</p>
          <div className={styles.co2Pills} aria-label="CO2 Tracker project roles">
            {project.pills.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </div>
        </div>
        <div className={styles.co2Stats} aria-label="CO2 Tracker project facts">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className={styles.co2Media}>
        <Gallery
          media={project.media}
          frame="browser"
          projectName={project.name}
          initialIndex={project.media.length > 1 ? 1 : 0}
          address="localhost:5173/customer"
          captions={[undefined, undefined, undefined, 'Simulated recognition in this prototype']}
        />
      </Reveal>

      <Reveal className={styles.co2Process}>
        <div className={styles.co2SectionHeading}>
          <span>01</span>
          <h4>How it works</h4>
        </div>
        <div className={styles.co2Pipeline} aria-label="CO2 Tracker data flow">
          {project.pipeline.map((step, index) => (
            <div className={styles.co2PipelineStep} key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
              {index < project.pipeline.length - 1 && <ArrowRight />}
            </div>
          ))}
        </div>
      </Reveal>

      <div className={styles.co2DetailGrid}>
        <Reveal className={styles.co2Technical}>
          <div className={styles.co2SectionHeading}>
            <span>02</span>
            <h4>Implementation notes</h4>
          </div>
          <dl>
            {project.technicalNotes.map((note) => (
              <div key={note.label}>
                <dt>{note.label}</dt>
                <dd>{note.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className={styles.co2Role}>
          <div className={styles.co2SectionHeading}>
            <span>03</span>
            <h4>My role</h4>
          </div>
          <ul>
            {project.contributions.map((contribution) => (
              <li key={contribution}>{contribution}</li>
            ))}
          </ul>
          <div className={styles.stackChips} aria-label="CO2 Tracker technology stack">
            {project.stack.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          <div className={styles.co2Actions}>
            {project.links.map((link) => (
              <TextLink key={link.label} href={link.href} label={link.label} />
            ))}
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export function TeamProjects() {
  const { teamProjects } = content;
  const co2Project = teamProjects.items.find(
    (project): project is Co2ProjectData => project.id === 'co2-tracker',
  );
  const hospitalProject = teamProjects.items.find(
    (project): project is HospitalProjectData => project.id === 'hospital',
  );

  if (!co2Project || !hospitalProject) return null;

  const hospitalMedia = [...hospitalProject.media, hospitalProject.testMedia];

  return (
    <section className={styles.section} aria-labelledby="team-projects-title">
      <div className={styles.shell}>
        <SectionHeader
          id="team-projects-title"
          eyebrow={teamProjects.eyebrow}
          title={teamProjects.title}
        />
        <Co2Feature project={co2Project} />

        <div className={styles.hospitalCardWrap}>
          <Reveal className={styles.teamCard} style={sectionStyle('#007d83', '#c9eff0')}>
            <div className={styles.teamMedia}>
              <Gallery
                media={hospitalMedia}
                frame="desktop"
                projectName={hospitalProject.name}
                initialIndex={1}
                frameForIndex={['desktop', 'desktop', 'desktop', 'desktop', 'terminal']}
                captions={[
                  undefined,
                  'The booking module I built',
                  undefined,
                  undefined,
                  undefined,
                ]}
                title="Hospital Appointment System"
                proof={{ index: 4, caption: 'JUnit tests passing' }}
              />
            </div>
            <div className={styles.teamBody}>
              <p className={styles.eyebrow}>{hospitalProject.meta}</p>
              <h3>{hospitalProject.name}</h3>
              <p className={styles.teamSummary}>{hospitalProject.summary}</p>
              <dl className={styles.teamFacts}>
                <div>
                  <dt>My role</dt>
                  <dd>{hospitalProject.role}</dd>
                </div>
                <div>
                  <dt>Outcome</dt>
                  <dd>{hospitalProject.outcome}</dd>
                </div>
              </dl>
              <div className={styles.stackChips}>
                {hospitalProject.stack.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
              <a href={hospitalProject.link.href} target="_blank" rel="noopener noreferrer">
                {hospitalProject.link.label} <ArrowUpRight />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const { experience } = content;
  return (
    <section
      className={`${styles.section} ${styles.experienceSection}`}
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className={styles.shell}>
        <SectionHeader
          id="experience-title"
          eyebrow={experience.eyebrow}
          title={experience.title}
        />
        <div className={styles.timeline}>
          {experience.items.map((item) => (
            <Reveal className={styles.timelineItem} key={`${item.date}-${item.title}`}>
              <time>{item.date}</time>
              <div
                className={`${styles.timelineDot} ${styles[`timelineDot${item.kind}`]}`}
                aria-hidden="true"
              />
              <div className={styles.timelineContent}>
                <h3>{item.title}</h3>
                <p className={styles.timelinePlace}>{item.place}</p>
                {item.description && <p>{item.description}</p>}
                {item.tag && <span className={styles.timelineTag}>{item.tag}</span>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const { skills } = content;
  return (
    <section className={styles.section} id="skills" aria-labelledby="skills-title">
      <div className={styles.shell}>
        <SectionHeader id="skills-title" eyebrow={skills.eyebrow} title={skills.title} />
        <div className={styles.skillGrid}>
          {skills.groups.map((group) => (
            <Reveal className={styles.skillGroup} key={group.name}>
              <h3>{group.name}</h3>
              <div>
                {group.items.map((skill) => (
                  <span className={skill.featured ? styles.skillFeatured : ''} key={skill.name}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className={styles.languagesNote}>
          <GlobeIcon />
          <p>{skills.languages}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  const { contact } = content;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(content.links.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className={styles.contactSection} id="contact" aria-labelledby="contact-title">
      <div className={styles.contactPanel}>
        <div className={styles.contactCopy}>
          <OptionalImage item={content.identity.photo} className={styles.contactPortrait} />
          <p className={styles.eyebrow}>{contact.eyebrow}</p>
          <h2 id="contact-title">{contact.title}</h2>
          <p>{contact.text}</p>
          <div className={styles.contactMeta}>
            <span>{contact.location}</span>
            {contact.roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
          <CvAction className={styles.downloadButton} />
        </div>
        <div className={styles.contactRows}>
          {contact.rows.map((row) => (
            <div className={styles.contactRow} key={row.label}>
              <span>{row.label}</span>
              {row.copy ? (
                <>
                  <a href={row.href}>{row.value}</a>
                  <button type="button" onClick={copyEmail} aria-live="polite">
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </>
              ) : isPlaceholderLink(row.href) ? (
                <strong>{row.value}</strong>
              ) : (
                <a href={row.href} target="_blank" rel="noopener noreferrer">
                  {row.value} <ArrowUpRight />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>{content.footer}</p>
      <SocialLinks compact />
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
