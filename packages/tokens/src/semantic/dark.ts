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
    accent: '#FF5A3C',
    'accent-hover': '#FF7358',
    'accent-active': color.vermilion[500],
    'accent-fg': color.ink[0],
    'accent-subtle': 'rgba(255, 90, 60, 0.14)',
    border: color.alpha.paperHairline,
    'border-strong': color.ink[300],
    'border-subtle': color.alpha.paperSubtle,
    focus: 'rgba(255, 90, 60, 0.45)',
  },
} as const;
