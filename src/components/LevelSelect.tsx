import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { content, findCaseStudy } from '../data/content';
import { reducedMotion } from '../fx/effects';
import { useTilt } from '../fx/useTilt';
import { MediaImage } from './Media';
import { ArrowDownIcon, PauseIcon, PlayIcon } from './Icons';
import { StatusChip } from './Sections';
import styles from '../styles/site.module.css';

const levels = content.featured.map((project) => ({
  project,
  study: findCaseStudy(project.slug)!,
}));
const interval = 4200;

/**
 * The hero showcase: a stage that rotates through the four featured projects, with a
 * row of level tiles to pick one. Built as a tab list (arrow keys move between levels)
 * whose panel is a link to that project's section further down the page.
 */
export function LevelSelect({ onLevel }: { onLevel?: (slug: string) => void }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(true);
  const [loadRest, setLoadRest] = useState(false);
  const [canAnimate] = useState(() => !reducedMotion());
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLAnchorElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  useTilt(stage, 7);

  const { project, study } = levels[index];
  const running = canAnimate && playing && !held && inView;

  // Only the first screenshot loads with the page. The others follow once it has settled.
  useEffect(() => {
    const start = () => window.setTimeout(() => setLoadRest(true), 600);
    if (document.readyState === 'complete') {
      const timer = start();
      return () => window.clearTimeout(timer);
    }
    let timer = 0;
    const onLoad = () => {
      timer = start();
    };
    window.addEventListener('load', onLoad, { once: true });
    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % levels.length);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [running, index]);

  useEffect(() => onLevel?.(project.slug), [onLevel, project.slug]);

  // While the hero is on screen, the ambient page colours follow the level on stage.
  useEffect(() => {
    if (!inView || window.scrollY > window.innerHeight * 0.5) return;
    document.documentElement.dataset.pageWorld = project.slug;
  }, [inView, project.slug]);

  const select = (next: number, focus = false) => {
    const wrapped = (next + levels.length) % levels.length;
    setIndex(wrapped);
    setPlaying(false);
    if (focus) tabs.current[wrapped]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? current + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? current - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? levels.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div
      ref={root}
      className={styles.showcase}
      data-world={project.slug}
      data-world-local=""
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setHeld(true);
      }}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
    >
      <div
        id="level-panel"
        role="tabpanel"
        aria-labelledby={`level-tab-${project.slug}`}
        className={styles.showPanel}
        onTouchStart={(event) => {
          swiped.current = false;
          const point = event.touches[0];
          touch.current = point ? { x: point.clientX, y: point.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const point = event.changedTouches[0];
          const start = touch.current;
          touch.current = null;
          if (!point || !start) return;
          const x = point.clientX - start.x;
          const y = point.clientY - start.y;
          if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y) * 1.4) {
            swiped.current = true;
            select(index + (x > 0 ? -1 : 1));
          }
        }}
      >
        <a
          ref={stage}
          className={styles.showStage}
          href={`#${project.slug}`}
          style={{ '--stage': project.stage } as CSSProperties}
          onClick={(event) => {
            if (swiped.current) {
              swiped.current = false;
              event.preventDefault();
            }
          }}
        >
          <span className={styles.showMedia} aria-hidden="true">
            {levels.map((level, slide) => {
              if (slide !== 0 && slide !== index && !loadRest) return null;
              const portrait = level.study.frame === 'print' || level.study.frame === 'phone';
              return (
                <span
                  key={level.project.slug}
                  className={styles.showSlide}
                  data-active={slide === index || undefined}
                  data-frame={level.study.frame}
                >
                  {portrait ? (
                    <>
                      {loadRest && level.project.preview[1] && (
                        <MediaImage
                          item={level.project.preview[1]}
                          className={styles.showBack}
                          decorative
                          sizes="(max-width: 560px) 130px, 200px"
                        />
                      )}
                      <MediaImage
                        item={level.project.preview[0]}
                        className={styles.showFront}
                        decorative
                        priority={slide === 0}
                        sizes="(max-width: 560px) 150px, 240px"
                      />
                    </>
                  ) : (
                    <span className={styles.showBrowser}>
                      <span className={styles.deviceBar}>
                        <i />
                        <i />
                        <i />
                        <span>Physio-AI live session</span>
                      </span>
                      {/* A crop of the real screenshot, centred on the tracked squat. */}
                      <span className={styles.showCrop}>
                        <MediaImage item={level.project.preview[0]} decorative fullSize />
                        <span className={styles.scanLine} />
                      </span>
                    </span>
                  )}
                </span>
              );
            })}
          </span>
          <span className={styles.showLevel} aria-hidden="true">
            Level {index + 1} of {levels.length}
          </span>
          <span className={styles.showStatus} key={`status-${project.slug}`}>
            <StatusChip status={study.status} tone={study.tone} />
          </span>
          <span className={styles.showCaption} key={project.slug}>
            {study.icon && (
              <MediaImage item={study.icon} className={styles.showIcon} decorative sizes="48px" />
            )}
            <span className={styles.showText}>
              <strong>{study.name}</strong>
              <span>{study.kind}</span>
            </span>
            <span className={styles.showGo}>
              <ArrowDownIcon />
              <span className={styles.srOnly}>Go to this project</span>
            </span>
          </span>
        </a>
      </div>

      <div className={styles.showControls}>
        <h2 id="levels-title" className={styles.showTitle} data-no-tiles>
          Choose a level
        </h2>
        <div className={styles.showTabs} role="tablist" aria-labelledby="levels-title">
          {levels.map((level, tab) => (
            <button
              key={level.project.slug}
              ref={(element) => {
                tabs.current[tab] = element;
              }}
              type="button"
              role="tab"
              id={`level-tab-${level.project.slug}`}
              aria-selected={tab === index}
              aria-controls="level-panel"
              tabIndex={tab === index ? 0 : -1}
              data-world={level.project.slug}
              data-world-local=""
              onClick={() => select(tab)}
              onKeyDown={(event) => onTabKey(event, tab)}
            >
              {level.study.icon ? (
                <MediaImage item={level.study.icon} decorative sizes="36px" />
              ) : (
                <i aria-hidden="true">{tab + 1}</i>
              )}
              <span>{level.study.name}</span>
              {tab === index && (
                <b key={`${index}-${running}`} data-running={running || undefined} />
              )}
            </button>
          ))}
        </div>
        {canAnimate && (
          <button
            type="button"
            className={styles.stageButton}
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? 'Pause project rotation' : 'Play project rotation'}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
