export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function pageUrl(path = '') {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function homeUrl(hash = '') {
  return `${import.meta.env.BASE_URL}${hash.replace(/^#?/, '#')}`;
}

export function routePath() {
  const base = import.meta.env.BASE_URL;
  const pathname = window.location.pathname;
  return pathname.startsWith(base)
    ? pathname.slice(base.length).replace(/^\/+|\/+$/g, '')
    : pathname.replace(/^\/+|\/+$/g, '');
}

/**
 * Scroll to the URL fragment once the page has rendered.
 * The static HTML has no sections, so the browser's own fragment scroll finds nothing.
 * Runs again after fonts load in case text reflow moved the target, unless the visitor
 * has already started scrolling.
 */
export function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return () => undefined;
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
  events.forEach((name) => window.addEventListener(name, cancel, { once: true, passive: true }));
  const go = () => {
    if (cancelled) return;
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  const frame = requestAnimationFrame(go);
  void document.fonts?.ready.then(go);
  const timer = window.setTimeout(go, 500);
  return () => {
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    events.forEach((name) => window.removeEventListener(name, cancel));
  };
}
