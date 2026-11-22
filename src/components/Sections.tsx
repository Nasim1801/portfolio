import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  content,
  findCaseStudy,
  type FeaturedProject,
  type MoreProject,
  type StatusTone,
} from '../data/content';
import { AmbientTiles } from '../fx/AmbientTiles';
import { reducedMotion } from '../fx/effects';
import { useTilt } from '../fx/useTilt';
import { assetUrl, pageUrl } from '../utils/links';
import { MakeTenBoard } from './MakeTenBoard';
import { DeviceFrame, MediaImage } from './Media';
import { DocumentIcon, GithubIcon, LinkedinIcon, MailIcon, PauseIcon, PlayIcon } from './Icons';
import styles from '../styles/site.module.css';

const delay = (value: number) => ({ '--d': value }) as CSSProperties;

export function ExternalLink({
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
      <span className={styles.srOnly}> (opens in a new tab)</span>
    </a>
  );
}

export function StatusChip({ status, tone }: { status: string; tone: StatusTone }) {
  return (
    <span className={styles.status} data-tone={tone}>
      <span className={styles.statusMark} aria-hidden="true" />
      {status}
    </span>
  );
}

export function Tags({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className={styles.tags} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Front and back phone screens that cycle through the project's real screenshots. */
function CyclingPrints({ project, eager }: { project: FeaturedProject; eager: boolean }) {
  const study = findCaseStudy(project.slug)!;
  const media = study.media;
  const holder = useRef<HTMLDivElement>(null);
  const [screens, setScreens] = useState({ current: 0, previous: -1 });
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [canAnimate] = useState(() => !reducedMotion());

  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canAnimate || !playing || !inView || media.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setScreens(({ current }) => ({ current: (current + 1) % media.length, previous: current }));
    }, 3200);
    return () => window.clearInterval(timer);
  }, [canAnimate, playing, inView, media.length]);

  const front = media[screens.current];
  const back = media[(screens.current + 1) % media.length];
  const previous = screens.previous >= 0 ? media[screens.previous] : undefined;

  return (
    <>
      <div
        ref={holder}
        className={styles.prints}
        role="img"
        aria-label={`${study.name} screenshots. Showing: ${front.label ?? front.alt}`}
      >
        <div className={styles.printBack} data-frame={study.frame}>
          <MediaImage
            key={back.src}
            item={back}
            decorative
            sizes="(max-width: 700px) 40vw, 220px"
          />
        </div>
        <div className={styles.printFront} data-frame={study.frame}>
          {previous && (
            <MediaImage
              key={`previous-${previous.src}`}
              item={previous}
              className={styles.printUnder}
              decorative
              sizes="(max-width: 700px) 46vw, 250px"
            />
          )}
          <MediaImage
            key={front.src}
            item={front}
            className={styles.printTop}
            decorative
            priority={eager && screens.current === 0}
            sizes="(max-width: 700px) 46vw, 250px"
          />
        </div>
      </div>
      {canAnimate && media.length > 1 && (
        <div className={styles.stageControls}>
          <button
            type="button"
            className={styles.stageButton}
            onClick={() => setPlaying((value) => !value)}
            aria-label={
              playing ? `Pause ${study.name} screenshots` : `Play ${study.name} screenshots`
            }
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <span className={styles.stagePips} aria-hidden="true">
            {media.map((item, index) => (
              <i key={item.src} data-on={index === screens.current || undefined} />
            ))}
          </span>
        </div>
      )}
    </>
  );
}

function ProjectCard({ project, index }: { project: FeaturedProject; index: number }) {
  const study = findCaseStudy(project.slug)!;
  const portrait = study.frame === 'print' || study.frame === 'phone';
  const stage = useRef<HTMLDivElement>(null);
  useTilt(stage, portrait ? 9 : 5);
  return (
    <article
      className={styles.project}
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      data-layout={portrait ? 'portrait' : 'landscape'}
      data-world={project.slug}
    >
      <div
        ref={stage}
        className={styles.projectStage}
        style={{ '--stage': project.stage } as CSSProperties}
        data-reveal="left"
      >
        <span className={styles.levelChip} aria-hidden="true">
          Level {index + 1}
        </span>
        {portrait ? (
          <CyclingPrints project={project} eager={index === 0} />
        ) : (
          <div className={styles.stageBrowser}>
            <DeviceFrame
              item={project.preview[0]}
              frame="browser"
              title={study.name}
              sizes="(max-width: 900px) 92vw, 620px"
            />
            <span className={styles.scanLine} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className={styles.projectBody}>
        <div className={styles.projectTitle} data-reveal="right" style={delay(1)}>
          {study.icon && (
            <MediaImage item={study.icon} className={styles.projectIcon} decorative sizes="56px" />
          )}
          <div>
            <h3
              id={`${project.slug}-title`}
              style={{ viewTransitionName: `title-${project.slug}` } as CSSProperties}
            >
              {study.name}
            </h3>
            <p className={styles.projectKind}>{study.kind}</p>
          </div>
        </div>
        <div data-reveal="pop" style={delay(3)}>
          <StatusChip status={study.status} tone={study.tone} />
        </div>
        <p className={styles.projectSummary} data-reveal="right" style={delay(2)}>
          {project.summary}
        </p>
        <dl className={styles.projectFacts} data-reveal="right" style={delay(3)}>
          <div>
            <dt>My role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>
              <Tags items={project.stack} label={`${study.name} technology`} />
            </dd>
          </div>
        </dl>
        <div className={styles.projectLinks} data-reveal="right" style={delay(4)}>
          <a className={styles.buttonPrimary} href={pageUrl(`projects/${project.slug}/`)}>
            {project.hasFullCaseStudy ? 'Read the case study' : 'Project details'}
            <span className={styles.srOnly}> for {study.name}</span>
          </a>
          {project.links.map((link) => (
            <ExternalLink key={link.href} href={link.href} className={styles.buttonSecondary}>
              {link.label}
              <span className={styles.srOnly}>: {study.name}</span>
            </ExternalLink>
          ))}
        </div>
      </div>
      {project.slug === 'sumlume' && (
        <div className={styles.playPanel} data-reveal="up">
          <div className={styles.playIntro}>
            <p className={styles.playSticker}>Playable demo</p>
            <p className={styles.playLead}>Don’t take my word for it. Play the rule.</p>
            <p>
              This is the rule Sumlume is built on, running in your browser. Pairs that make 10
              share a colour.
            </p>
            <ul className={styles.playRules} aria-label="The two ways to clear a pair">
              <li>
                <i data-tone="3" aria-hidden="true">
                  7
                </i>
                <i data-tone="3" aria-hidden="true">
                  3
                </i>
                7 and 3 make 10
              </li>
              <li>
                <i data-tone="5" aria-hidden="true">
                  5
                </i>
                <i data-tone="5" aria-hidden="true">
                  5
                </i>
                5 and 5 match
              </li>
            </ul>
            <p className={styles.playNote}>
              The rule is a small, tested TypeScript function.{' '}
              <a href={pageUrl('lab/')}>The Engineering Lab has a harder board</a>.
            </p>
          </div>
          <div className={styles.boardWrap}>
            <MakeTenBoard />
          </div>
        </div>
      )}
    </article>
  );
}

function MoreRow({ project, index }: { project: MoreProject; index: number }) {
  const { thumbnail } = project;
  return (
    <li className={styles.moreRow} data-reveal="up" style={delay(index)}>
      <img
        className={styles.moreThumb}
        src={assetUrl(thumbnail.smallSrc ?? thumbnail.src)}
        srcSet={
          thumbnail.thumbnailSrc && thumbnail.smallSrc
            ? `${assetUrl(thumbnail.thumbnailSrc)} 160w, ${assetUrl(thumbnail.smallSrc)} 960w`
            : undefined
        }
        sizes="144px"
        width={thumbnail.width}
        height={thumbnail.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className={styles.moreText}>
        <h3>
          <a href={pageUrl(`projects/${project.slug}/`)}>{project.name}</a>
        </h3>
        <p>
          {project.summary} <span className={styles.moreRole}>{project.role}</span>
        </p>
        <Tags items={project.stack} label={`${project.name} technology`} />
      </div>
      <div className={styles.moreLinks}>
        {project.links.map((link) => (
          <ExternalLink key={link.href} href={link.href} className={styles.textLink}>
            {link.label}
            <span className={styles.srOnly}>: {project.name}</span>
          </ExternalLink>
        ))}
      </div>
    </li>
  );
}

export function SelectedWork() {
  return (
    <section className={styles.section} id="work" aria-labelledby="work-title">
      <div className={styles.sectionHead}>
        <h2 id="work-title" data-reveal="blur">
          Selected work
        </h2>
        <p data-reveal="up" style={delay(1)}>
          Two games live on the App Store, a graded computer-vision system and a game in
          development. Each links to the full story.
        </p>
      </div>
      <div className={styles.projects}>
        {content.featured.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>

      <div className={styles.more} aria-labelledby="more-title">
        <h2 id="more-title" className={styles.moreTitle} data-reveal="blur">
          More work
        </h2>
        <ul className={styles.moreList}>
          {content.more.map((project, index) => (
            <MoreRow key={project.slug} project={project} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Skills as an inventory. Pointing at, focusing or tapping a skill lights up the
 * projects that prove it; pointing at a project lights up its skills. The plain
 * links under every skill stay, so nothing depends on the interaction.
 */
export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const active = hovered ?? locked;
  const allItems: { name: string; proof: readonly string[] }[] = [];
  for (const group of content.skills) allItems.push(...group.items);
  const activeProof = allItems.find((item) => item.name === active)?.proof ?? [];
  const projects = content.caseStudies;

  return (
    <section className={styles.section} id="skills" aria-labelledby="skills-title">
      <div className={styles.sectionHead}>
        <h2 id="skills-title" data-reveal="blur">
          Skills
        </h2>
        <p data-reveal="up" style={delay(1)}>
          Pick a skill to light up the projects where I used it, or pick a project to see what it
          took.
        </p>
      </div>

      <div className={styles.party} data-reveal="up">
        <p id="party-label">Projects</p>
        <ul aria-labelledby="party-label">
          {projects.map((study) => (
            <li key={study.slug}>
              <a
                href={pageUrl(`projects/${study.slug}/`)}
                data-lit={activeProof.includes(study.slug) || project === study.slug || undefined}
                data-dim={(active !== null && !activeProof.includes(study.slug)) || undefined}
                onPointerEnter={() => setProject(study.slug)}
                onPointerLeave={() => setProject(null)}
                onFocus={() => setProject(study.slug)}
                onBlur={() => setProject(null)}
              >
                {study.icon ? (
                  <MediaImage item={study.icon} decorative sizes="28px" />
                ) : (
                  <i aria-hidden="true">{study.name[0]}</i>
                )}
                {study.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.skillGroups}>
        {content.skills.map((group, groupIndex) => (
          <section
            key={group.group}
            className={styles.skillGroup}
            aria-label={group.group}
            data-reveal="tilt"
            data-tone={groupIndex + 1}
            style={delay(groupIndex)}
          >
            <h3>{group.group}</h3>
            <ul>
              {group.items.map((item) => {
                const proof: readonly string[] = item.proof;
                const lit = active === item.name || (project !== null && proof.includes(project));
                const dim =
                  (active !== null && active !== item.name) ||
                  (project !== null && !proof.includes(project));
                return (
                  <li
                    key={item.name}
                    data-lit={lit || undefined}
                    data-dim={(!lit && dim) || undefined}
                    onPointerEnter={(event) => {
                      if (event.pointerType !== 'touch') setHovered(item.name);
                    }}
                    onPointerLeave={() => setHovered(null)}
                  >
                    <button
                      type="button"
                      className={styles.skillName}
                      aria-pressed={locked === item.name}
                      onClick={() => setLocked(locked === item.name ? null : item.name)}
                      onFocus={() => setHovered(item.name)}
                      onBlur={() => setHovered(null)}
                    >
                      {item.name}
                    </button>
                    <span className={styles.skillProof}>
                      {proof.map((slug, index) => (
                        <span key={slug}>
                          {index > 0 && ', '}
                          <a href={pageUrl(`projects/${slug}/`)}>{findCaseStudy(slug)?.name}</a>
                        </span>
                      ))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

export function About() {
  const { about } = content;
  return (
    <section className={styles.section} id="about" aria-labelledby="about-title">
      <div className={styles.about}>
        <div>
          <h2 id="about-title" data-reveal="blur">
            About
          </h2>
          <dl className={styles.sheet} data-reveal="tilt" style={delay(1)}>
            {about.sheet.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.aboutText}>
          {about.paragraphs.map((paragraph, index) => (
            <p key={paragraph} data-reveal="up" style={delay(index + 1)}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The timeline as a path: the line fills in as the visitor scrolls along it. */
export function Experience() {
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = (window.innerHeight * 0.6 - rect.top) / rect.height;
      element.style.setProperty('--path', Math.max(0, Math.min(1, progress)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className={styles.section} id="experience" aria-labelledby="experience-title">
      <div className={styles.sectionHead}>
        <h2 id="experience-title" data-reveal="blur">
          Experience and education
        </h2>
      </div>
      <ol className={styles.timeline} ref={list}>
        {content.experience.map((item, index) => (
          <li key={item.title + item.date} data-current={index === 0 || undefined}>
            <span className={styles.timelineNode} data-reveal="pop" aria-hidden="true" />
            <p className={styles.timelineDate} data-reveal="up">
              {item.date}
            </p>
            <div data-reveal="right" style={delay(1)}>
              <h3>{item.title}</h3>
              <p className={styles.timelinePlace}>{item.place}</p>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The end screen: one big menu of ways to get in touch. */
export function Contact() {
  const { contact, links } = content;
  const [message, setMessage] = useState('');
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setMessage('Email address copied.');
    } catch {
      window.getSelection()?.selectAllChildren(document.getElementById('contact-email')!);
      setMessage('Email address selected. Press Ctrl+C or Command+C to copy.');
    }
    window.setTimeout(() => setMessage(''), 2600);
  };
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-title">
      <AmbientTiles
        className={styles.contactCanvas}
        max={12}
        avoid="[data-no-tiles]"
        set="mix"
        onDark
      />
      <div className={styles.contactInner}>
        <h2 id="contact-title" data-reveal="pop" data-no-tiles>
          {contact.title}
        </h2>
        <p className={styles.contactText} data-reveal="up" style={delay(1)} data-no-tiles>
          {contact.text}
        </p>
        <p className={styles.finaleSticker} data-reveal="pop" style={delay(2)} data-no-tiles>
          {content.hero.availability} in {content.identity.location}
        </p>
        <ul className={styles.menu} data-no-tiles>
          <li data-reveal="left" style={delay(1)}>
            <a id="contact-email" className={styles.menuItem} href={`mailto:${links.email}`}>
              <MailIcon />
              <span>
                <strong>Email</strong>
                <span>{links.email}</span>
              </span>
            </a>
            <button type="button" className={styles.menuCopy} onClick={copyEmail}>
              {message ? 'Copied' : 'Copy email'}
            </button>
          </li>
          <li data-reveal="left" style={delay(2)}>
            <a className={styles.menuItem} href={assetUrl(links.cv)} download>
              <DocumentIcon />
              <span>
                <strong>Download CV</strong>
                <span>PDF</span>
              </span>
            </a>
          </li>
          <li data-reveal="left" style={delay(3)}>
            <ExternalLink href={links.linkedin} className={styles.menuItem}>
              <LinkedinIcon />
              <span>
                <strong>LinkedIn</strong>
                <span>linkedin.com/in/nasim-mosayebi</span>
              </span>
            </ExternalLink>
          </li>
          <li data-reveal="left" style={delay(4)}>
            <ExternalLink href={links.github} className={styles.menuItem}>
              <GithubIcon />
              <span>
                <strong>GitHub</strong>
                <span>github.com/Nasim1801</span>
              </span>
            </ExternalLink>
          </li>
        </ul>
        <p className={styles.srOnly} role="status">
          {message}
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  const { links } = content;
  return (
    <footer className={styles.footer}>
      <p>
        Nasim Mosayebi, software engineer in London. Founder of{' '}
        <ExternalLink href={links.studio}>PathLife Studio</ExternalLink>.
        <span className={styles.footerHint}> Old cheat codes still work here.</span>
      </p>
      <ul>
        <li>
          <a href={pageUrl('lab/')}>Engineering Lab</a>
        </li>
        <li>
          <a href={pageUrl('projects/portfolio/')}>How this site was built</a>
        </li>
        <li>
          <a href="#main-content">Back to top</a>
        </li>
      </ul>
    </footer>
  );
}
