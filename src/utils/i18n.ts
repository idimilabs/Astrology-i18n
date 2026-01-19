export const SUPPORTED_LANGS = [
  'zh',
  'en',
  'fr',
  'es',
  'ru',
  'ja',
  'ko',
  'pt',
  'de',
  'id',
] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

export function toAbsolute(lang: Lang, inputPath = '/'): string {
  const raw = String(inputPath);
  const sepIndex = raw.search(/[?#]/);
  const pathname = (sepIndex >= 0 ? raw.slice(0, sepIndex) : raw).trim() || '/';
  const tail = sepIndex >= 0 ? raw.slice(sepIndex) : '';

  let p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  p = p.replace(/^\/+/, '/').replace(/\/{2,}/g, '/');

  const langPrefixRE = new RegExp(`^/(?:${SUPPORTED_LANGS.join('|')})(?=/|$)`, 'i');
  p = p.replace(langPrefixRE, '');
  if (p === '') p = '/';

  if (p !== '/') p = p.replace(/\/+$/, '');

  let prefixed = p === '/' ? `/${lang}` : `/${lang}${p}`;

  const lastSegment = prefixed.substring(prefixed.lastIndexOf('/') + 1);
  const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(lastSegment);
  if (!looksLikeFile && !prefixed.endsWith('/')) {
    prefixed += '/';
  }

  return `${prefixed}${tail}`;
}
