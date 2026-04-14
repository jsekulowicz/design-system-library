export const fontFamily = {
  display:
    "'Fraunces', 'Times New Roman', Georgia, serif",
  body: "'General Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
} as const;

export const fontSize = {
  '3xs': '0.6875rem',
  '2xs': '0.75rem',
  xs: '0.8125rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.375rem',
  '2xl': '1.75rem',
  '3xl': '2.25rem',
  '4xl': '3rem',
  '5xl': '4rem',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: '1.1',
  snug: '1.25',
  normal: '1.45',
  relaxed: '1.6',
} as const;

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0',
  wide: '0.04em',
  display: '-0.01em',
} as const;

export type FontFamilyTokens = typeof fontFamily;
export type FontSizeTokens = typeof fontSize;
