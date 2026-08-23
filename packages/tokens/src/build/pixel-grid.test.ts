import { describe, expect, it } from 'vitest';
import { fontSize, lineHeight } from '../primitive/typography.js';
import { buildBaseCss, buildThemeCss, roundedLineHeight, PIXEL_GRID } from './css.js';

const ROOT_FONT_SIZE = 16;

function toPx(value: string): number {
  return value.endsWith('rem') ? Number.parseFloat(value) * ROOT_FONT_SIZE : Number.parseFloat(value);
}

function snapUp(px: number): number {
  return Math.ceil(px / PIXEL_GRID) * PIXEL_GRID;
}

describe('line-height pixel grid', () => {
  it('gives every font-size a whole, even line box once rounded', () => {
    for (const size of Object.values(fontSize)) {
      for (const multiplier of Object.values(lineHeight)) {
        const snapped = snapUp(toPx(size) * Number(multiplier));
        expect(Number.isInteger(snapped)).toBe(true);
        expect(snapped % 2).toBe(0);
      }
    }
  });

  it('never snaps a line box below its unrounded height', () => {
    for (const size of Object.values(fontSize)) {
      for (const multiplier of Object.values(lineHeight)) {
        const raw = toPx(size) * Number(multiplier);
        expect(snapUp(raw)).toBeGreaterThanOrEqual(raw);
      }
    }
  });

  const emitted = (): Record<string, string> => ({
    'base.css': buildBaseCss(),
    'theme-default-light.css': buildThemeCss('light'),
    'theme-default-dark.css': buildThemeCss('dark'),
  });

  it('emits every line-height token snapped to the pixel grid', () => {
    for (const [file, css] of Object.entries(emitted())) {
      for (const [name, multiplier] of Object.entries(lineHeight)) {
        expect(css, file).toContain(`--ds-line-height-${name}: ${roundedLineHeight(multiplier)};`);
      }
    }
  });

  it('leaves no bare multiplier that a later layer could restore', () => {
    for (const [file, css] of Object.entries(emitted())) {
      for (const [name, multiplier] of Object.entries(lineHeight)) {
        expect(css, file).not.toContain(`--ds-line-height-${name}: ${multiplier};`);
      }
    }
  });

  it('sets a base line-height so nothing falls through to CSS normal', () => {
    expect(buildBaseCss()).toContain('line-height: var(--ds-line-height-normal);');
  });
});
