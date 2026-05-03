import { describe, expect, it } from 'vitest';
import { getContrastingThemeColor } from './color-utils.js';

describe('color picker color utils', () => {
  it('chooses the higher contrast theme color for a selected background', () => {
    expect(getContrastingThemeColor('#111827', '#FAF8F5', '#0B0B0C')).toBe(
      'var(--ds-color-bg)',
    );
    expect(getContrastingThemeColor('#FDE68A', '#FAF8F5', '#0B0B0C')).toBe(
      'var(--ds-color-fg)',
    );
  });
});
