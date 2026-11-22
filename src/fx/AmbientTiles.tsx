import { useEffect, useRef } from 'react';
import { reducedMotion } from './effects';
import { clearSprites, pick, sprite, spriteSpan, type AmbientSet, type Picked } from './glyphs';

interface Tile extends Picked {
  x: number;
  y: number;
  size: number;
  depth: number;
  speed: number;
  spin: number;
  angle: number;
  phase: number;
  vx: number;
  vy: number;
  /** When this tile starts swapping to the next set, in ms. 0 when idle. */
  swapAt: number;
  swapped: boolean;
  next?: Picked;
}

const swapOut = 240;
const swapIn = 420;
const stagger = 260;

/**
 * Small objects drifting upwards behind a section, in three parallax depths.
 * The objects belong to a set (one per project) and swap, staggered, when the set
 * changes. They lean away from the pointer and fade out near text. The loop stops
 * when the canvas is off screen or the tab is hidden. With reduced motion it draws
 * one still frame of the first set and ignores later changes.
 */
export function AmbientTiles({
  className,
  density = 1,
  avoid,
  set = 'sumlume',
  onDark = false,
}: {
  className?: string;
  density?: number;
  /** Selector for text blocks, inside the canvas's parent, that tiles must stay clear of. */
  avoid?: string;
  set?: AmbientSet;
  /** The canvas sits on a dark band whatever the theme. */
  onDark?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const change = useRef<(next: AmbientSet) => void>(undefined);
  const initialSet = useRef(set);

  useEffect(() => {
    change.current?.(set);
  }, [set]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const still = reducedMotion();
    let current = initialSet.current;
    let width = 0;
    let height = 0;
    let tiles: Tile[] = [];
    let frame = 0;
    let running = false;
    let last = 0;
    const pointer = { x: -9999, y: -9999 };
    let zones: { left: number; top: number; right: number; bottom: number }[] = [];
    let measured = 0;
    canvas.dataset.set = current;

    // Text blocks the tiles must not sit behind, in canvas coordinates.
    const measure = () => {
      measured = performance.now();
      if (!avoid || !canvas.parentElement) return;
      const origin = canvas.getBoundingClientRect();
      const pad = 10;
      zones = [...canvas.parentElement.querySelectorAll(avoid)].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left - origin.left - pad,
          top: rect.top - origin.top - pad,
          right: rect.right - origin.left + pad,
          bottom: rect.bottom - origin.top + pad,
        };
      });
    };
    // 0 inside a text zone, rising to 1 a short distance outside it.
    const clearance = (x: number, y: number, size: number) => {
      let nearest = Infinity;
      for (const zone of zones) {
        const dx = Math.max(zone.left - x, 0, x - zone.right);
        const dy = Math.max(zone.top - y, 0, y - zone.bottom);
        nearest = Math.min(nearest, Math.hypot(dx, dy));
      }
      // Narrow screens have little open space, so the fade there is tighter.
      return Math.max(0, Math.min(1, (nearest - size * 0.55) / (width < 600 ? 12 : 34)));
    };

    const seed = () => {
      // Phones get more, smaller objects: most of the hero there is text they must avoid.
      const count = Math.round(
        Math.min(34, Math.max(10, (width * height) / 42000)) * density * (width < 600 ? 1.8 : 1),
      );
      tiles = Array.from({ length: count }, (_, index) => {
        const depth = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: (22 + depth * 36) * (width < 600 ? 0.78 : 1),
          depth,
          speed: 6 + depth * 16,
          spin: 0.12 + Math.random() * 0.16,
          angle: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2,
          ...pick(current, index),
          vx: 0,
          vy: 0,
          swapAt: 0,
          swapped: false,
        };
      });
    };

    const draw = (dt: number, now = 0) => {
      const dark = onDark || document.documentElement.dataset.theme === 'dark';
      context.clearRect(0, 0, width, height);
      for (const tile of tiles) {
        let scale = 1;
        let twist = 0;
        if (tile.swapAt && now >= tile.swapAt) {
          const elapsed = now - tile.swapAt;
          if (elapsed < swapOut) {
            const t = elapsed / swapOut;
            scale = 1 - t * t;
            twist = t * 0.9;
          } else {
            if (!tile.swapped && tile.next) {
              Object.assign(tile, tile.next);
              tile.swapped = true;
            }
            const t = Math.min(1, (elapsed - swapOut) / swapIn);
            // Overshoot a little, then settle.
            scale = 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
            twist = (1 - t) * -0.5;
            if (t === 1) {
              tile.swapAt = 0;
              tile.swapped = false;
              tile.next = undefined;
            }
          }
        }
        if (dt) {
          const dx = tile.x - pointer.x;
          const dy = tile.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 170) {
            const force = ((170 - distance) / 170) * 900 * tile.depth;
            tile.vx += (dx / (distance || 1)) * force * dt;
            tile.vy += (dy / (distance || 1)) * force * dt;
          }
          tile.vx *= 0.94;
          tile.vy *= 0.94;
          tile.x += tile.vx * dt;
          tile.y += (tile.vy - tile.speed) * dt;
          if (tile.y < -tile.size) {
            tile.y = height + tile.size;
            tile.x = Math.random() * width;
          }
          if (tile.x < -tile.size) tile.x = width + tile.size;
          if (tile.x > width + tile.size) tile.x = -tile.size;
        }
        const fade = clearance(tile.x, tile.y, tile.size);
        if (fade < 0.02 || scale < 0.02) continue;
        const line = tile.glyph.line;
        // Line-drawn glyphs breathe gently instead of sitting as solid tiles.
        const pulse = line ? 0.82 + 0.18 * Math.sin(now / 520 + tile.phase) : 1;
        const span =
          tile.size * scale * spriteSpan * (line ? 1 + 0.05 * Math.sin(now / 520 + tile.phase) : 1);
        context.save();
        context.translate(tile.x, tile.y);
        // Objects rock gently rather than spin, so houses and bowls stay upright.
        context.rotate(
          (tile.angle + tile.spin * Math.sin(now / 1700 + tile.phase) + tile.vx * 0.002) *
            (line ? 0.5 : 1) +
            twist,
        );
        context.globalAlpha =
          (line ? 0.45 + tile.depth * 0.5 : 0.32 + tile.depth * 0.5) * fade * pulse;
        context.drawImage(sprite(tile, dark), -span / 2, -span / 2, span, span);
        context.restore();
      }
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seed();
      measure();
      draw(0, performance.now());
    };

    const loop = (now: number) => {
      if (now - measured > 700) measure();
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      draw(dt, now);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || still || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    change.current = (next) => {
      // Reduced motion keeps the first set: nothing moves or swaps.
      if (still || next === current) return;
      current = next;
      canvas.dataset.set = next;
      const now = performance.now();
      tiles.forEach((tile, index) => {
        tile.next = pick(next, index + Math.floor(Math.random() * 3));
        tile.swapAt = now + Math.random() * stagger;
        tile.swapped = false;
      });
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    let onScreen = false;
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    const onHidden = () => (document.hidden || !onScreen ? stop() : start());
    const resizer = new ResizeObserver(resize);
    // A theme switch changes ink colours; redraw the still frame for reduced motion.
    const themeWatcher = new MutationObserver(() => {
      if (still) draw(0, performance.now());
    });
    themeWatcher.observe(document.documentElement, { attributeFilter: ['data-theme'] });

    resize();
    // Number tiles drawn before the web font arrived would keep the fallback font.
    void document.fonts?.ready.then(() => {
      clearSprites();
      draw(0, performance.now());
    });
    visibility.observe(canvas);
    resizer.observe(canvas);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      stop();
      change.current = undefined;
      visibility.disconnect();
      resizer.disconnect();
      themeWatcher.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, [density, avoid, onDark]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
