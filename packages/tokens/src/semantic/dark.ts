import { color } from '../primitive/index.js';
import { semanticLight } from './light.js';

export const semanticDark = {
  ...semanticLight,
  color: {
    ...semanticLight.color,
    bg: color.ink[0],
    'bg-subtle': color.ink[50],
    'bg-muted': color.ink[100],
    'bg-inverse': color.ink[1000],
    fg: color.ink[900],
    'fg-muted': color.ink[600],
    'fg-subtle': color.ink[500],
    'fg-inverse': color.ink[0],
    accent: '#6A95E8',
    'accent-hover': '#5A84D4',
    'accent-active': color.cobalt[500],
    'accent-fg': color.ink[0],
    'accent-subtle': 'rgba(74, 114, 204, 0.18)',
    border: color.alpha.paperHairline,
    'border-strong': color.ink[300],
    'border-subtle': color.alpha.paperSubtle,
    focus: 'rgba(106, 149, 232, 0.45)',
    'danger-subtle': 'rgba(178, 26, 10, 0.22)',
  },
} as const;
