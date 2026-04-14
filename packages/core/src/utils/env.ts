export const isBrowser: boolean =
  typeof window !== 'undefined' && typeof document !== 'undefined';

export function prefersReducedMotion(): boolean {
  if (!isBrowser) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersDarkScheme(): boolean {
  if (!isBrowser) {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
