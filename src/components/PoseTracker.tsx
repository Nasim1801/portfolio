import { useEffect, useRef } from 'react';
import styles from '../styles/site.module.css';

type Point = readonly [number, number];
type LandmarkName =
  'nose' | 'ls' | 'rs' | 'le' | 're' | 'lw' | 'rw' | 'lh' | 'rh' | 'lk' | 'rk' | 'la' | 'ra';
type Pose = Record<LandmarkName, Point>;

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

const bones: readonly (readonly [LandmarkName, LandmarkName])[] = [
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

const names = Object.keys(stand) as LandmarkName[];

function mixPose(progress: number): Pose {
  return Object.fromEntries(
    names.map((name) => [
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

export function PoseTracker({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const repsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let inView = true;
    let visible = !document.hidden;
    let animationFrame = 0;
    let startedAt = performance.now();
    let pausedAt = 0;
    let repArmed = true;
    let reps = reduceMotion ? 3 : 0;

    const getColour = (property: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(property).trim() || fallback;

    const draw = (progress: number) => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
      const pixelWidth = Math.max(1, Math.round(rect.width * pixelRatio));
      const pixelHeight = Math.max(1, Math.round(rect.height * pixelRatio));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const paper = getColour('--paper-elevated', '#fffaf1');
      const line = getColour('--line', '#d9cfc0');
      const green = getColour('--green', '#416443');
      const gold = getColour('--gold-bright', '#e5b94e');
      const ink = getColour('--ink', '#2a1e18');
      const inkSoft = getColour('--ink-soft', '#65574d');

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.fillStyle = paper;
      context.fillRect(0, 0, rect.width, rect.height);

      const scale = Math.min(rect.width / 520, rect.height / 546);
      const offsetX = (rect.width - 520 * scale) / 2;
      const offsetY = (rect.height - 546 * scale) / 2;
      const map = ([x, y]: Point): Point => [offsetX + x * scale, offsetY + y * scale];

      context.strokeStyle = line;
      context.lineWidth = Math.max(0.7, scale);
      context.globalAlpha = 0.38;
      for (let x = 40; x < 520; x += 40) {
        context.beginPath();
        context.moveTo(offsetX + x * scale, offsetY + 42 * scale);
        context.lineTo(offsetX + x * scale, offsetY + 505 * scale);
        context.stroke();
      }
      for (let y = 65; y < 505; y += 40) {
        context.beginPath();
        context.moveTo(offsetX + 40 * scale, offsetY + y * scale);
        context.lineTo(offsetX + 480 * scale, offsetY + y * scale);
        context.stroke();
      }
      context.globalAlpha = 0.25;
      context.lineWidth = Math.max(1, 2 * scale);
      context.beginPath();
      context.moveTo(...map([120, 505]));
      context.lineTo(...map([400, 505]));
      context.strokeStyle = ink;
      context.stroke();
      context.globalAlpha = 1;

      const pose = mixPose(progress);
      context.strokeStyle = green;
      context.lineWidth = Math.max(3, 6 * scale);
      context.lineCap = 'round';
      for (const [from, to] of bones) {
        context.beginPath();
        context.moveTo(...map(pose[from]));
        context.lineTo(...map(pose[to]));
        context.stroke();
      }

      const [headX, headY] = map([pose.nose[0], pose.nose[1] - 12]);
      context.beginPath();
      context.arc(headX, headY, 30 * scale, 0, Math.PI * 2);
      context.strokeStyle = green;
      context.lineWidth = Math.max(3, 6 * scale);
      context.stroke();

      for (const name of names) {
        const [x, y] = map(pose[name]);
        context.beginPath();
        context.arc(x, y, Math.max(3.5, 7 * scale), 0, Math.PI * 2);
        context.fillStyle = gold;
        context.fill();
        context.lineWidth = Math.max(1, 1.5 * scale);
        context.strokeStyle = ink;
        context.stroke();
      }

      const kneeAngle = angleAt(pose.rh, pose.rk, pose.ra);
      const [kneeX, kneeY] = map(pose.rk);
      const label = `${kneeAngle}°`;
      context.font = `700 ${Math.max(10, 13 * scale)}px ${getColour('--mono', 'monospace')}`;
      const textWidth = context.measureText(label).width;
      const labelX = Math.min(rect.width - textWidth - 19, kneeX + 19 * scale);
      const labelY = Math.max(24, kneeY - 9 * scale);
      context.fillStyle = paper;
      context.strokeStyle = line;
      context.lineWidth = 1;
      context.beginPath();
      context.roundRect(labelX - 8, labelY - 17, textWidth + 16, 24, 7);
      context.fill();
      context.stroke();
      context.fillStyle = inkSoft;
      context.fillText(label, labelX, labelY);
    };

    const updateRepLabel = () => {
      if (repsRef.current) repsRef.current.textContent = String(reps);
    };

    const animate = (time: number) => {
      if (!inView || !visible || reduceMotion) return;
      const elapsed = time - startedAt;
      const progress = (1 - Math.cos(elapsed / 900)) / 2;
      if (progress >= 0.995 && repArmed) {
        reps += 1;
        repArmed = false;
        updateRepLabel();
      } else if (progress < 0.2) {
        repArmed = true;
      }
      draw(progress);
      animationFrame = requestAnimationFrame(animate);
    };

    const resume = () => {
      if (reduceMotion || !inView || !visible || animationFrame) return;
      if (pausedAt) {
        startedAt += performance.now() - pausedAt;
        pausedAt = 0;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const pause = () => {
      if (!animationFrame) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      pausedAt = performance.now();
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) resume();
      else pause();
    });
    intersectionObserver.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      draw(reduceMotion ? 0.5 : (1 - Math.cos((performance.now() - startedAt) / 900)) / 2);
    });
    resizeObserver.observe(canvas);

    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (visible) resume();
      else pause();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    updateRepLabel();
    if (reduceMotion) draw(0.5);
    else resume();

    return () => {
      pause();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div className={`${styles.poseTracker} ${compact ? styles.poseTrackerCompact : ''}`}>
      <div className={styles.poseCanvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.poseCanvas}
          aria-label="Animated pose-tracking demo inspired by Physio-AI"
          role="img"
        />
        <span className={styles.poseAnimationLabel}>Animation</span>
        <div className={styles.poseChips} aria-hidden="true">
          <span>
            squat · reps <b ref={repsRef}>0</b>
          </span>
          <span>form good</span>
        </div>
      </div>
      <div className={styles.poseMeta}>
        <div>
          <strong>Physio-AI · Random Forest</strong>
          <span>33 landmarks · real time</span>
        </div>
        <b>96.23%</b>
      </div>
    </div>
  );
}
