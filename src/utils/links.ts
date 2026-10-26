export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function isPlaceholderLink(href: string) {
  return href.startsWith('[') && href.endsWith(']');
}
