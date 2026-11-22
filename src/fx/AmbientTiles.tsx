import { useEffect, useRef } from 'react';
import { reducedMotion } from './effects';
import { clearSprites, pool, sprite, spriteSpan, type AmbientSet, type Picked } from './glyphs';

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
interface Tile extends Picked {
  /** Home position. The object bobs around it and always returns to it. */
  hx: number;
  hy: number;
  /** Offset caused by the pointer. */
  ox: number;
  oy: number;
  size: number;
  depth: number;
  phase: number;
  tilt: number;
  /** When this object starts swapping to the next set, in ms. 0 when idle. */
  swapAt: number;
  swapped: boolean;
  next?: Picked;
}
/** Read by the browser checks to prove objects never overlap or enter protected zones. */
export interface AmbientDebug {
  objects: () => Rect[];
  zones: () => Rect[];
}

const swapOut = 240;
const swapIn = 420;
const bob = 6;
const maxPush = 16;

/** An element's layout box inside `root`, ignoring transforms (entrance animations, tilts). */
function layoutRect(element: HTMLElement, root: HTMLElement): Rect {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== root) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { left, top, right: left + element.offsetWidth, bottom: top + element.offsetHeight };
}
const gap = (zone: Rect, x: number, y: number) =>
  Math.hypot(
    Math.max(zone.left - x, 0, x - zone.right),
    Math.max(zone.top - y, 0, y - zone.bottom),
  );

/**
 * A quiet layer of small objects behind a section. Each object has its own slot, placed
 * with a minimum spacing and outside every text block, the stage, the header and the
 * level map. Objects bob gently around their slot, lean away from the pointer and come
 * back, so they can never overlap or clump. The objects belong to a set (one per
 * project) and swap in place when the set changes. The loop stops when the canvas is
 * off screen or the tab is hidden. With reduced motion it draws one still frame of the
 * first set and ignores later changes.
 */
export function AmbientTiles({
  className,
  max = 16,
  avoid,
  set = 'sumlume',
  onDark = false,
  clearTop = 0,
}: {
  className?: string;
  /** Most objects ever shown, however large the screen. */
  max?: number;
  /** Selector for blocks, inside the canvas's parent, that objects must stay clear of. */
  avoid?: string;
  set?: AmbientSet;
  /** The canvas sits on a dark band whatever the theme. */
  onDark?: boolean;
  /** Height at the top of the canvas to keep clear (the fixed header). */
  clearTop?: number;
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
    const hover = window.matchMedia('(hover: hover)').matches;
    let current = initialSet.current;
    let width = 0;
    let height = 0;
    let tiles: Tile[] = [];
    let zones: Rect[] = [];
    let frame = 0;
    let running = false;
    let last = 0;
    const pointer = { x: -9999, y: -9999 };
    canvas.dataset.set = current;

    const measure = () => {
      zones = [];
      const root = canvas.parentElement;
      if (root && avoid) {
        root.querySelectorAll<HTMLElement>(avoid).forEach((element) => {
          if (element.offsetWidth) zones.push(layoutRect(element, root));
        });
      }
      if (clearTop) zones.push({ left: 0, top: 0, right: width, bottom: clearTop });
      // The level map sits at the right edge of wide screens.
      if (window.innerWidth >= 1400) {
        zones.push({ left: width - 120, top: 0, right: width, bottom: height });
      }
    };

    /** Give every slot an object so that neighbours differ in shape and colour. */
    const assign = (name: AmbientSet): Picked[] => {
      const entries = pool(name);
      const picked: Picked[] = [];
      const colours: string[] = [];
      tiles.forEach((tile, index) => {
        const near = tiles
          .slice(0, index)
          .map((other, at) => ({ at, d: Math.hypot(other.hx - tile.hx, other.hy - tile.hy) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
          .map(({ at }) => at);
        let entry = entries[index % entries.length];
        for (let step = 0; step < entries.length; step += 1) {
          const candidate = entries[(index + step) % entries.length];
          if (!near.some((at) => picked[at].glyph === candidate.glyph)) {
            entry = candidate;
            break;
          }
        }
        let tone = entry.tones[index % entry.tones.length];
        for (let step = 0; step < entry.tones.length; step += 1) {
          const candidate = entry.tones[(index + step) % entry.tones.length];
          if (!near.some((at) => colours[at] === candidate[0])) {
            tone = candidate;
            break;
          }
        }
        let value = 1 + (index % 9);
        while (near.some((at) => picked[at].value === value)) value = 1 + (value % 9);
        colours.push(tone[0]);
        picked.push({ glyph: entry.glyph, tone, accent: entry.accent, value });
      });
      return picked;
    };

    const seed = () => {
      const phone = width < 600;
      const spacing = phone ? 84 : 140;
      const largest = phone ? 28 : 36;
      // An object may bob, and be pushed by the pointer, without ever leaving this radius.
      const reach = largest / 2 + bob + (hover ? maxPush : 0);
      const clear = reach + 6;
      const limit = Math.min(max, Math.max(phone ? 5 : 8, Math.round(width / 95)));

      // Candidate slots on a jittered grid, outside the protected zones.
      const candidates: { x: number; y: number }[] = [];
      const columns = Math.floor(width / 24);
      const rows = Math.floor(height / 24);
      for (let row = 0; row <= rows; row += 1) {
        for (let column = 0; column <= columns; column += 1) {
          const x = ((column + 0.5 + (Math.random() - 0.5) * 0.5) * width) / (columns + 1);
          const y = ((row + 0.5 + (Math.random() - 0.5) * 0.5) * height) / (rows + 1);
          if (x < reach || y < reach || x > width - reach || y > height - reach) continue;
          if (zones.some((zone) => gap(zone, x, y) < clear)) continue;
          candidates.push({ x, y });
        }
      }

      // Pick slots as far from each other as possible: an even spread, never closer than `spacing`.
      const slots: { x: number; y: number }[] = [];
      const distance = candidates.map(() => Infinity);
      let next = candidates.findIndex((point) => point.x < width / 2 && point.y < height / 2);
      if (next < 0) next = 0;
      while (candidates.length && slots.length < limit) {
        const chosen = candidates[next];
        slots.push(chosen);
        let best = -1;
        candidates.forEach((point, index) => {
          distance[index] = Math.min(
            distance[index],
            Math.hypot(point.x - chosen.x, point.y - chosen.y),
          );
          if (best < 0 || distance[index] > distance[best]) best = index;
        });
        if (best < 0 || distance[best] < spacing) break;
        next = best;
      }

      tiles = slots.map((slot, index) => {
        // Three depth layers, shared out evenly: far ones are smaller and fainter.
        const depth = [1, 0.35, 0.68][index % 3];
        return {
          hx: slot.x,
          hy: slot.y,
          ox: 0,
          oy: 0,
          size: (phone ? 0.8 : 1) * (18 + depth * 18),
          depth,
          phase: index * 2.4,
          tilt: ((index % 5) - 2) * 0.09,
          swapAt: 0,
          swapped: false,
          glyph: undefined as never,
          tone: undefined as never,
          accent: undefined as never,
          value: 0,
        };
      });
      assign(current).forEach((picked, index) => Object.assign(tiles[index], picked));
      canvas.dataset.count = String(tiles.length);
    };

    const place = (tile: Tile, now: number) => {
      const t = still ? 0 : now / 1000;
      return {
        x: tile.hx + tile.ox + (still ? 0 : Math.sin(t * 0.5 + tile.phase) * bob * 0.7),
        y: tile.hy + tile.oy + (still ? 0 : Math.cos(t * 0.37 + tile.phase) * bob),
      };
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
          // Lean away from the pointer, a little, then spring back home.
          let tx = 0;
          let ty = 0;
          const dx = tile.hx - pointer.x;
          const dy = tile.hy - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (hover && distance < 150) {
            const push = ((150 - distance) / 150) * maxPush;
            tx = (dx / (distance || 1)) * push;
            ty = (dy / (distance || 1)) * push;
          }
          const ease = Math.min(1, dt * 5);
          tile.ox += (tx - tile.ox) * ease;
          tile.oy += (ty - tile.oy) * ease;
        }
        if (scale < 0.02) continue;
        const line = tile.glyph.line;
        const wave = still ? 0 : Math.sin(now / 900 + tile.phase);
        const span = tile.size * scale * spriteSpan;
        const { x, y } = place(tile, now);
        context.save();
        context.translate(x, y);
        context.rotate(tile.tilt * (line ? 0.5 : 1) + wave * 0.07 + twist);
        // Background only: nothing here should be as loud as a button or a badge.
        const base = line ? 0.2 + tile.depth * 0.3 : 0.14 + tile.depth * 0.26;
        context.globalAlpha = base * (dark ? 0.85 : 1) * (line ? 0.9 + wave * 0.1 : 1);
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
      measure();
      seed();
      draw(0, performance.now());
    };

    const loop = (now: number) => {
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
      // Swap in place, slot by slot, in a wave from left to right.
      assign(next).forEach((picked, index) => {
        const tile = tiles[index];
        tile.next = picked;
        tile.swapAt = now + (tile.hx / Math.max(1, width)) * 320;
        tile.swapped = false;
      });
    };

    (canvas as HTMLCanvasElement & { ambient?: AmbientDebug }).ambient = {
      objects: () =>
        tiles.map((tile) => {
          const { x, y } = place(tile, performance.now());
          const half = tile.size / 2;
          return { left: x - half, top: y - half, right: x + half, bottom: y + half };
        }),
      zones: () => zones,
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
    // The web font changes the text layout and the look of number tiles: place again once.
    void document.fonts?.ready.then(() => {
      clearSprites();
      resize();
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
  }, [max, avoid, onDark, clearTop]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
