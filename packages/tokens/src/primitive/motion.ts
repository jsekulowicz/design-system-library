export const duration = {
  instant: '80ms',
  fast: '120ms',
  normal: '180ms',
  slow: '240ms',
  slower: '320ms',
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0.1, 1.1)',
  enter: 'cubic-bezier(0, 0, 0, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

export type DurationTokens = typeof duration;
export type EasingTokens = typeof easing;
