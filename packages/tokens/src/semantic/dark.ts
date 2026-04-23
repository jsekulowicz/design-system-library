import { color } from '../primitive/index.js';
import { semanticLight } from './light.js';

export const semanticDark = {
  ...semanticLight,
  color: {
    ...semanticLight.color,
    bg: '#222425',
    'bg-subtle': '#2B2D2E',
    'bg-muted': '#363839',
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
    'chart-1': '#7AA3F5',
    'chart-2': '#50D8D4',
    'chart-3': '#F7A53E',
    'chart-4': '#F472B6',
    'chart-5': '#70E380',
    'chart-6': '#B995FF',
  },
} as const;
