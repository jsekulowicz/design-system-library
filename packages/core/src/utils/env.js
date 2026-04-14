export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
export function prefersReducedMotion() {
    if (!isBrowser) {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function prefersDarkScheme() {
    if (!isBrowser) {
        return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
//# sourceMappingURL=env.js.map