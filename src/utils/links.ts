export function pageUrl(path = '') {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export const assetUrl = pageUrl;

export function homeUrl(hash: string) {
  return pageUrl(hash);
}

export function routePath() {
  const base = import.meta.env.BASE_URL;
  const { pathname } = window.location;
  const route = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return route.replace(/\/?index\.html$/i, '').replace(/^\/+|\/+$/g, '');
}
