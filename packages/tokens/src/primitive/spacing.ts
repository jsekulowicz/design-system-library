export const space = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const size = {
  xs: '1.75rem',
  sm: '2rem',
  md: '2.5rem',
  lg: '3rem',
  xl: '3.5rem',
} as const;

export type SpaceTokens = typeof space;
export type SizeTokens = typeof size;
