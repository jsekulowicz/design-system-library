import type { ColorPickerOption } from './types.js';

export const DEFAULT_COLOR = '#000000';
export const COLOR_FORMAT_ERROR = 'Use #RGB or #RRGGBB.';

const SHORT_HEX = /^#([0-9a-f]{3})$/i;
const LONG_HEX = /^#([0-9a-f]{6})$/i;

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
