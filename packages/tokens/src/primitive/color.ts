export const color = {
  ink: {
    0: '#0B0B0C',
    50: '#1A1A1C',
    100: '#2B2B2E',
    200: '#3F3F43',
    300: '#56565B',
    400: '#6B6B6E',
    500: '#86868A',
    600: '#A6A6A9',
    700: '#C5C5C7',
    800: '#E2E2E3',
    900: '#F2EFEA',
    1000: '#FAF8F5',
  },
  vermilion: {
    100: '#FBEAE7',
    300: '#F1988C',
    500: '#E2341D',
    600: '#C12613',
    700: '#9A1B0C',
  },
  cobalt: {
    100: '#E4EBF8',
    500: '#1F4FD3',
    700: '#0F2E87',
  },
  success: {
    100: '#E4F1EA',
    500: '#1F7A48',
  },
  warning: {
    100: '#FBF0DA',
    500: '#A6620B',
  },
  danger: {
    100: '#FBE7E4',
    500: '#B21A0A',
  },
  alpha: {
    inkHairline: 'rgba(11, 11, 12, 0.12)',
    inkSubtle: 'rgba(11, 11, 12, 0.06)',
    paperHairline: 'rgba(242, 239, 234, 0.14)',
    paperSubtle: 'rgba(242, 239, 234, 0.06)',
    focusRing: 'rgba(226, 52, 29, 0.35)',
  },
} as const;

export type ColorTokens = typeof color;
