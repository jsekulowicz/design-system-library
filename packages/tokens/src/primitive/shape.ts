export const radius = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

export const border = {
  hairline: '1px',
  regular: '1.5px',
  heavy: '2px',
} as const;

export const shadow = {
  none: 'none',
  sm: '0 1px 2px rgba(11, 11, 12, 0.06)',
  md: '0 4px 12px rgba(11, 11, 12, 0.08), 0 1px 2px rgba(11, 11, 12, 0.04)',
  lg: '0 12px 32px rgba(11, 11, 12, 0.10), 0 4px 8px rgba(11, 11, 12, 0.06)',
  focus: '0 0 0 3px rgba(74, 114, 204, 0.35)',
} as const;

export type RadiusTokens = typeof radius;
export type BorderTokens = typeof border;
export type ShadowTokens = typeof shadow;
