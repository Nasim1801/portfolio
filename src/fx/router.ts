import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { routePath, scrollToHash } from '../utils/links';
import { withTransition } from './effects';

/**
 * A very small client router. Every route also exists as a static HTML file, so
 * direct visits and no-JS crawlers work. In the browser, internal links swap the
 * route in place so pages can morph into each other with a view transition.
 */
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const notify = () => listeners.forEach((listener) => listener());

export function useRoute() {
  return useSyncExternalStore(subscribe, routePath);
}

const base = import.meta.env.BASE_URL;

function preload(pathname: string) {
  const route = pathname.slice(base.length).replace(/^\/+|\/+$/g, '');
  if (route.startsWith('projects/')) return import('../components/CaseStudyPage');
  if (route === 'lab') return import('../components/EngineeringLabPage');
  return Promise.resolve();
}

export async function navigate(url: URL) {
  await preload(url.pathname).catch(() => undefined);
  withTransition(() => {
    history.pushState(null, '', url);
    flushSync(notify);
    if (!url.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  });
  if (url.hash) scrollToHash();
  const main = document.getElementById('main-content');
  main?.setAttribute('tabindex', '-1');
  main?.focus({ preventScroll: true });
}

/** Intercept clicks on internal page links. Hash-only, download and new-tab links are left alone. */
export function initRouter() {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.(
      'a[href]',
    ) as HTMLAnchorElement | null;
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return;
    if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
    if (url.pathname === location.pathname) return;
    event.preventDefault();
    void navigate(url);
  };
  const onPop = () => flushSync(notify);
  document.addEventListener('click', onClick);
  window.addEventListener('popstate', onPop);
  return () => {
    document.removeEventListener('click', onClick);
    window.removeEventListener('popstate', onPop);
  };
}
