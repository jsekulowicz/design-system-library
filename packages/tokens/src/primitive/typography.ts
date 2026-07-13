export const fontFamily = {
  display:
    "'Source Serif 4', Georgia, 'Times New Roman', serif",
  body: "'General Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
} as const;

export const fontSize = {
  'body-sm': '0.75rem',
  'body-md': '0.875rem',
  'body-lg': '1rem',
  'heading-xs': '1.125rem',
  'heading-sm': '1.25rem',
  'heading-md': '1.5rem',
  'heading-lg': '1.75rem',
  'heading-xl': '2rem',
  'heading-2xl': '3rem',
  'heading-3xl': '4rem',
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
