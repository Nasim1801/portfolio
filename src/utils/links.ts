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
