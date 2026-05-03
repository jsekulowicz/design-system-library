import type { ColorPickerOption } from './types.js';

export const DEFAULT_COLOR = '#000000';
export const COLOR_FORMAT_ERROR = 'Use #RGB or #RRGGBB.';

const SHORT_HEX = /^#([0-9a-f]{3})$/i;
const LONG_HEX = /^#([0-9a-f]{6})$/i;
const RGB_COLOR = /^rgba?\(([^)]+)\)$/i;

interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

export function normalizeHexColor(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  const longMatch = trimmed.match(LONG_HEX);
  const longValue = longMatch?.[1];
  if (longValue) {
    return `#${longValue.toUpperCase()}`;
  }
  const shortMatch = trimmed.match(SHORT_HEX);
  const shortValue = shortMatch?.[1];
  if (!shortValue) {
    return null;
  }
  const [red, green, blue] = shortValue.split('');
  return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase();
}

export function normalizeColorOptions(colors: ColorPickerOption[]): ColorPickerOption[] {
  return colors.flatMap((color) => {
    const value = normalizeHexColor(color.value);
    if (!value) {
      return [];
    }
    return [{ ...color, value }];
  });
}

export function getColorLabel(color: ColorPickerOption): string {
  return color.label?.trim() || color.value;
}

export function getContrastingThemeColor(value: string, bg: string, fg: string): string {
  const selected = parseColor(value);
  if (!selected) {
    return 'var(--ds-color-fg)';
  }
  const bgColor = parseColor(bg) ?? { red: 250, green: 248, blue: 245 };
  const fgColor = parseColor(fg) ?? { red: 11, green: 11, blue: 12 };
  return contrastRatio(selected, bgColor) >= contrastRatio(selected, fgColor)
    ? 'var(--ds-color-bg)'
    : 'var(--ds-color-fg)';
}

function parseColor(value: string): RgbColor | null {
  const hex = normalizeHexColor(value);
  if (hex) {
    return {
      red: Number.parseInt(hex.slice(1, 3), 16),
      green: Number.parseInt(hex.slice(3, 5), 16),
      blue: Number.parseInt(hex.slice(5, 7), 16),
    };
  }
  const channels = value.trim().match(RGB_COLOR)?.[1]?.split(',').map((item) => item.trim());
  if (!channels || channels.length < 3) {
    return null;
  }
  return {
    red: clampChannel(Number.parseFloat(channels[0] ?? '')),
    green: clampChannel(Number.parseFloat(channels[1] ?? '')),
    blue: clampChannel(Number.parseFloat(channels[2] ?? '')),
  };
}

function clampChannel(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(255, Math.max(0, value));
}

function contrastRatio(first: RgbColor, second: RgbColor): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color: RgbColor): number {
  return (
    0.2126 * linearChannel(color.red) +
    0.7152 * linearChannel(color.green) +
    0.0722 * linearChannel(color.blue)
  );
}

function linearChannel(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}
