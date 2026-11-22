/**
 * Small hand-written motion helpers. No animation library.
 * Everything here is optional polish: content never depends on it.
 */

export function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const tileColours = ['#ffd465', '#9fe8c9', '#bfcbff', '#ffbcd3', '#e3ceff'];

/**
 * Scroll reveals. Elements marked data-reveal are visible by default. Once this runs,
 * html.fx hides the ones that have not been seen yet and an IntersectionObserver
 * shows them. A throttled scroll check is the safety net: anything at or above the
 * viewport is always shown, so content can never be left hidden.
 */
export function initReveals() {
  if (reducedMotion() || !('IntersectionObserver' in window)) return () => undefined;
  const root = document.documentElement;
  const show = (element: Element) => element.setAttribute('data-shown', '');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  const scan = () => {
    document
      .querySelectorAll('[data-reveal]:not([data-shown]):not([data-watched])')
      .forEach((element) => {
        element.setAttribute('data-watched', '');
        observer.observe(element);
      });
  };
  const sweep = () => {
    document.querySelectorAll('[data-reveal]:not([data-shown])').forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.96) show(element);
    });
  };
  let ticking = 0;
  const onScroll = () => {
    if (ticking) return;
    ticking = window.setTimeout(() => {
      ticking = 0;
      sweep();
    }, 200);
  };
  scan();
  root.classList.add('fx');
  const mutations = new MutationObserver(scan);
  mutations.observe(document.getElementById('root') ?? document.body, {
    childList: true,
    subtree: true,
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  const failsafe = window.setTimeout(sweep, 1200);
  return () => {
    observer.disconnect();
    mutations.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.clearTimeout(failsafe);
    root.classList.remove('fx');
  };
}

/** Shift the ambient page colours into the world of whichever project is centred. */
export function initWorlds() {
  if (!('IntersectionObserver' in window)) return () => undefined;
  const root = document.documentElement;
  const visible = new Map<Element, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
        else visible.delete(entry.target);
      }
      const [current] = [...visible.keys()];
      const world = current?.getAttribute('data-world');
      if (world) root.dataset.pageWorld = world;
      else delete root.dataset.pageWorld;
    },
    { rootMargin: '-42% 0px -42% 0px' },
  );
  const scan = () =>
    document
      .querySelectorAll('main [data-world]:not([data-world-local])')
      .forEach((element) => observer.observe(element));
  scan();
  const mutations = new MutationObserver(scan);
  mutations.observe(document.getElementById('root') ?? document.body, {
    childList: true,
    subtree: true,
  });
  return () => {
    observer.disconnect();
    mutations.disconnect();
    delete root.dataset.pageWorld;
  };
}

/** A burst of small tiles from a point, used when a pair clears. */
export function burst(x: number, y: number, count = 14, colours = tileColours) {
  if (reducedMotion()) return;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden';
  document.body.append(layer);
  let longest = 0;
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement('i');
    const size = 6 + Math.random() * 9;
    const angle = (Math.PI * 2 * index) / count + Math.random() * 0.5;
    const distance = 50 + Math.random() * 90;
    const duration = 520 + Math.random() * 380;
    longest = Math.max(longest, duration);
    piece.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:${size / 3.5}px;background:${colours[index % colours.length]};box-shadow:inset 0 -2px 0 #0002`;
    layer.append(piece);
    piece.animate(
      [
        { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 },
        {
          transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 40}px) rotate(${(Math.random() - 0.5) * 540}deg) scale(0.3)`,
          opacity: 0,
        },
      ],
      { duration, easing: 'cubic-bezier(.15,.8,.3,1)', fill: 'forwards' },
    );
  }
  window.setTimeout(() => layer.remove(), longest + 60);
}

/** Tiles raining from the top of the screen: board win and the easter egg. */
export function confettiRain(count = 70) {
  if (reducedMotion()) return;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden';
  document.body.append(layer);
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement('i');
    const size = 10 + Math.random() * 16;
    const left = Math.random() * 100;
    const duration = 1500 + Math.random() * 1600;
    piece.textContent = Math.random() > 0.55 ? String(1 + Math.floor(Math.random() * 9)) : '';
    piece.style.cssText = `position:absolute;left:${left}vw;top:-40px;width:${size}px;height:${size}px;display:grid;place-items:center;border-radius:${size / 3.5}px;background:${tileColours[index % tileColours.length]};color:#14113a;font:700 ${size * 0.62}px/1 var(--font);font-style:normal;box-shadow:inset 0 -2px 0 #0002`;
    layer.append(piece);
    piece.animate(
      [
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        {
          transform: `translate(${(Math.random() - 0.5) * 220}px, ${window.innerHeight + 80}px) rotate(${(Math.random() - 0.5) * 900}deg)`,
          opacity: 0.9,
        },
      ],
      {
        duration,
        delay: Math.random() * 500,
        easing: 'cubic-bezier(.3,.1,.6,1)',
        fill: 'forwards',
      },
    );
  }
  window.setTimeout(() => layer.remove(), 3800);
}

/** Up, up, down, down, left, right, left, right, B, A. */
export function initKonami(onUnlock: () => void) {
  const code = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  let position = 0;
  const onKey = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    position = key === code[position] ? position + 1 : key === code[0] ? 1 : 0;
    if (position === code.length) {
      position = 0;
      onUnlock();
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}

/** Run a DOM update inside a view transition when the browser supports it. */
export function withTransition(update: () => void, kind?: string) {
  const start = (
    document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
  ).startViewTransition;
  if (!start || reducedMotion()) {
    update();
    return;
  }
  const root = document.documentElement;
  if (kind) root.dataset.vt = kind;
  const transition = start.call(document, update);
  void transition.finished.finally(() => {
    if (kind) delete root.dataset.vt;
  });
}
