import { useEffect, type RefObject } from 'react';
import { reducedMotion } from './effects';

/**
 * 3D tilt that follows the pointer. Writes --rx, --ry (degrees) and --mx, --my
 * (0 to 1, for highlights) on the element; CSS does the rest. Mouse and pen only.
 */
export function useTilt(ref: RefObject<HTMLElement | null>, max = 10) {
  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        element.style.setProperty('--ry', `${(x - 0.5) * 2 * max}deg`);
        element.style.setProperty('--rx', `${(0.5 - y) * 2 * max}deg`);
        element.style.setProperty('--mx', String(x));
        element.style.setProperty('--my', String(y));
        element.dataset.tilting = '';
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty('--ry', '0deg');
      element.style.setProperty('--rx', '0deg');
      delete element.dataset.tilting;
    };
    element.addEventListener('pointermove', onMove, { passive: true });
    element.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, max]);
}
