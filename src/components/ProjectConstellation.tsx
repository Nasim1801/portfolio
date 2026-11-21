import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { content } from '../data/content';
import { pageUrl } from '../utils/links';
import { DeviceFrame, MediaImage } from './Media';
import styles from '../styles/site.module.css';

type StageStyle = CSSProperties & {
  '--pointer-x': string;
  '--pointer-y': string;
  '--active-accent': string;
};

export function ProjectConstellation() {
  const projects = content.selectedWork.slice(0, 4);
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const project = projects[active];

  const moveSignal = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };

  const selectWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = (index + 1) % projects.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index - 1 + projects.length) % projects.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = projects.length - 1;
    if (next === index) return;
    event.preventDefault();
    setActive(next);
    nodeRefs.current[next]?.focus();
  };

  const stageStyle: StageStyle = {
    '--pointer-x': '72%',
    '--pointer-y': '28%',
    '--active-accent': project.accent,
  };

  return (
    <div
      ref={stageRef}
      className={styles.constellation}
      style={stageStyle}
      onPointerMove={moveSignal}
      aria-label="Interactive map of selected projects"
    >
      <div className={styles.constellationGrid} aria-hidden="true" />
      <svg className={styles.constellationLines} viewBox="0 0 760 690" aria-hidden="true">
        <path d="M140 152 C270 118 290 230 380 310 S590 190 644 130" />
        <path d="M140 152 C180 330 300 350 380 310 S450 540 590 568" />
        <path d="M644 130 C620 300 690 430 590 568" />
        <circle cx="380" cy="310" r="76" />
      </svg>

      <div
        className={styles.constellationNodes}
        role="tablist"
        aria-label="Select a project signal"
      >
        {projects.map((item, index) => (
          <button
            key={item.slug}
            ref={(element) => {
              nodeRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls="project-signal-panel"
            tabIndex={active === index ? 0 : -1}
            className={styles.constellationNode}
            onClick={() => setActive(index)}
            onFocus={() => setActive(index)}
            onKeyDown={(event) => selectWithKeyboard(event, index)}
          >
            <span className={styles.nodeOrbit} aria-hidden="true" />
            {item.icon ? (
              <MediaImage item={item.icon} className={styles.nodeIcon} priority={index === 0} />
            ) : (
              <span className={styles.nodeGlyph} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
            <span className={styles.nodeLabel}>{item.name}</span>
          </button>
        ))}
      </div>

      <div
        key={project.slug}
        id="project-signal-panel"
        role="tabpanel"
        className={styles.constellationPanel}
      >
        <div className={styles.signalMedia}>
          <DeviceFrame
            item={project.media}
            frame={project.frame}
            compact={project.frame === 'phone'}
            priority={active === 0}
            address={project.slug === 'physio-ai' ? 'physio-ai / live session' : undefined}
            title={project.name}
          />
        </div>
        <div className={styles.signalCopy}>
          <span>SIGNAL / {String(active + 1).padStart(2, '0')}</span>
          <strong>{project.name}</strong>
          <p>{project.evidence}</p>
          <a href={pageUrl(`projects/${project.slug}/`)}>Open case study ↗</a>
        </div>
      </div>

      <div className={styles.constellationHint}>
        <span>Interact</span>
        <p>Pointer · touch · arrow keys</p>
      </div>
    </div>
  );
}
