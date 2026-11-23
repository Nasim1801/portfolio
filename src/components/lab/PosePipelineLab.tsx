import { useId, useMemo, useRef, useState } from 'react';
import styles from '../../styles/lab.module.css';

type Point = readonly [number, number];
type Landmark =
  'nose' | 'ls' | 'rs' | 'le' | 're' | 'lw' | 'rw' | 'lh' | 'rh' | 'lk' | 'rk' | 'la' | 'ra';
type Pose = Record<Landmark, Point>;

const stand: Pose = {
  nose: [260, 95],
  ls: [220, 165],
  rs: [300, 165],
  le: [205, 240],
  re: [315, 240],
  lw: [200, 310],
  rw: [320, 310],
  lh: [232, 300],
  rh: [288, 300],
  lk: [230, 400],
  rk: [290, 400],
  la: [228, 495],
  ra: [292, 495],
};
const squat: Pose = {
  nose: [260, 190],
  ls: [218, 250],
  rs: [302, 250],
  le: [180, 280],
  re: [340, 280],
  lw: [150, 285],
  rw: [370, 285],
  lh: [222, 370],
  rh: [298, 370],
  lk: [180, 420],
  rk: [340, 420],
  la: [220, 495],
  ra: [300, 495],
};
const bones: readonly (readonly [Landmark, Landmark])[] = [
  ['ls', 'rs'],
  ['ls', 'le'],
  ['le', 'lw'],
  ['rs', 're'],
  ['re', 'rw'],
  ['ls', 'lh'],
  ['rs', 'rh'],
  ['lh', 'rh'],
  ['lh', 'lk'],
  ['lk', 'la'],
  ['rh', 'rk'],
  ['rk', 'ra'],
];
const landmarks = Object.keys(stand) as Landmark[];

const stages = [
  { name: 'Webcam', detail: 'A standard webcam supplies each video frame.' },
  { name: '33 landmarks', detail: 'MediaPipe Pose identifies 33 body landmarks per frame.' },
  { name: 'Embeddings', detail: 'Landmark positions are transformed into pose features.' },
  { name: 'Random Forest', detail: 'The selected classifier evaluates exercise form.' },
  { name: 'Live feedback', detail: 'Results are streamed to the interface over WebSockets.' },
] as const;

function interpolate(progress: number): Pose {
  return Object.fromEntries(
    landmarks.map((name) => [
      name,
      [
        stand[name][0] + (squat[name][0] - stand[name][0]) * progress,
        stand[name][1] + (squat[name][1] - stand[name][1]) * progress,
      ],
    ]),
  ) as unknown as Pose;
}

function angleAt(a: Point, b: Point, c: Point) {
  const first = Math.atan2(a[1] - b[1], a[0] - b[0]);
  const second = Math.atan2(c[1] - b[1], c[0] - b[0]);
  let degrees = Math.abs(((first - second) * 180) / Math.PI);
  if (degrees > 180) degrees = 360 - degrees;
  return Math.round(degrees);
}

export function PosePipelineLab() {
  const [stage, setStage] = useState(1);
  const [depth, setDepth] = useState(58);
  const labelId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pose = useMemo(() => interpolate(depth / 100), [depth]);
  const angle = angleAt(pose.rh, pose.rk, pose.ra);
  const showSkeleton = stage >= 1;

  return (
    <section className={`${styles.exhibit} ${styles.poseExhibit}`} aria-labelledby="pose-lab-title">
      <div className={styles.exhibitHeader}>
        <div>
          <p className={styles.labIndex}>Physio-AI</p>
          <h2 id="pose-lab-title">Trace a pose through the pipeline</h2>
        </div>
        <span className={styles.simulationChip}>Visual simulation</span>
      </div>

      <div
        className={styles.pipelineControls}
        role="tablist"
        aria-label="Physio-AI pipeline stages"
      >
        {stages.map((item, index) => (
          <button
            key={item.name}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={stage === index}
            aria-controls="pipeline-stage-panel"
            id={`pose-stage-${index}`}
            tabIndex={stage === index ? 0 : -1}
            onClick={() => setStage(index)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              const direction = event.key === 'ArrowRight' ? 1 : -1;
              const next = (index + direction + stages.length) % stages.length;
              setStage(next);
              tabRefs.current[next]?.focus();
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className={styles.poseLabLayout}>
        <div className={styles.poseViewport}>
          <div className={styles.viewportMeta}>
            <span>Simulated frame</span>
            <span>{showSkeleton ? `${angle}° right knee` : 'raw input'}</span>
          </div>
          <svg
            viewBox="0 0 520 546"
            role="img"
            aria-label={`Visual simulation of a squat pose at ${depth}% depth with a ${angle} degree right knee angle`}
          >
            <defs>
              <pattern id={`grid-${labelId}`} width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" className={styles.svgGrid} />
              </pattern>
            </defs>
            <rect x="0" y="0" width="520" height="546" fill={`url(#grid-${labelId})`} />
            <line x1="120" y1="505" x2="400" y2="505" className={styles.svgFloor} />
            {showSkeleton &&
              bones.map(([from, to]) => (
                <line
                  key={`${from}-${to}`}
                  x1={pose[from][0]}
                  y1={pose[from][1]}
                  x2={pose[to][0]}
                  y2={pose[to][1]}
                  className={styles.svgBone}
                />
              ))}
            {showSkeleton && (
              <circle cx={pose.nose[0]} cy={pose.nose[1] - 12} r="30" className={styles.svgHead} />
            )}
            {showSkeleton &&
              landmarks.map((name) => (
                <circle
                  key={name}
                  cx={pose[name][0]}
                  cy={pose[name][1]}
                  r={name === 'rk' ? 9 : 6}
                  className={name === 'rk' ? styles.svgActiveLandmark : styles.svgLandmark}
                />
              ))}
            {!showSkeleton && (
              <g className={styles.rawFrame} aria-hidden="true">
                <circle cx="260" cy="105" r="31" />
                <path d="M230 165 Q260 145 290 165 L302 305 Q260 330 218 305 Z" />
                <path d="M230 180 L200 310 M290 180 L320 310 M237 310 L228 495 M283 310 L292 495" />
              </g>
            )}
            {showSkeleton && (
              <g
                className={styles.angleLabel}
                transform={`translate(${pose.rk[0] + 16} ${pose.rk[1] - 20})`}
              >
                <rect x="0" y="0" width="72" height="34" rx="4" />
                <text x="12" y="23">
                  {angle}°
                </text>
              </g>
            )}
          </svg>
          <label className={styles.depthControl} htmlFor={labelId}>
            <span>Explore squat depth</span>
            <input
              id={labelId}
              type="range"
              min="0"
              max="100"
              value={depth}
              onChange={(event) => setDepth(Number(event.target.value))}
            />
            <output>{depth}%</output>
          </label>
        </div>

        <div
          className={styles.pipelineReadout}
          id="pipeline-stage-panel"
          role="tabpanel"
          aria-labelledby={`pose-stage-${stage}`}
          aria-live="polite"
        >
          <p>
            Step {stage + 1} of {stages.length}
          </p>
          <h3>{stages[stage].name}</h3>
          <p>{stages[stage].detail}</p>
          <dl>
            <div>
              <dt>Model</dt>
              <dd>Random Forest</dd>
            </div>
            <div>
              <dt>Reported project accuracy</dt>
              <dd>96.23% on the project dataset</dd>
            </div>
            <div>
              <dt>Input</dt>
              <dd>Standard webcam</dd>
            </div>
          </dl>
          <small>
            This interaction visualises the documented Physio-AI pipeline. It does not run live
            camera inference in the portfolio.
          </small>
          <a href="../projects/physio-ai/">Inspect the Physio-AI case study</a>
        </div>
      </div>
    </section>
  );
}
