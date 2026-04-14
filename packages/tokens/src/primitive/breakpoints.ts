export const breakpoint = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const container = {
  xs: '20rem',
  sm: '30rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const;

export const zIndex = {
  base: '0',
  raised: '10',
  dropdown: '100',
  sticky: '200',
  overlay: '300',
  modal: '400',
  toast: '500',
  tooltip: '600',
} as const;

export type BreakpointTokens = typeof breakpoint;
export type ContainerTokens = typeof container;
export type ZIndexTokens = typeof zIndex;
