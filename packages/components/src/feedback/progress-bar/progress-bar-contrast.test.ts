import { describe, expect, it } from 'vitest';
import { semanticDark, semanticLight } from '@jsekulowicz/ds-tokens';
import { PROGRESS_FILL_LIGHTNESS, PROGRESS_FILL_MAX_CHROMA } from './progress-bar-fill.js';
import {
  convertOklchToClippedLinearRgb,
  getContrastRatio,
  parseHexToLinearRgb,
  type LinearRgb,
} from '../../test-utils/contrast.js';

const TEXT_MINIMUM = 4.5;
const SHAPE_MINIMUM = 3;
const FILL_EDGE_MINIMUM_BESIDE_A_VALUE_LABEL = 1.9;

function buildEveryNormalizedFill(): LinearRgb[] {
  const fills: LinearRgb[] = [];
  for (let hue = 0; hue < 360; hue += 5) {
    for (const chroma of [0, PROGRESS_FILL_MAX_CHROMA / 2, PROGRESS_FILL_MAX_CHROMA]) {
      fills.push(convertOklchToClippedLinearRgb(PROGRESS_FILL_LIGHTNESS, chroma, hue));
    }
  }
  return fills;
}

function findLowestContrast(fills: LinearRgb[], against: LinearRgb): number {
  return Math.min(...fills.map((fill) => getContrastRatio(fill, against)));
}

const fills = buildEveryNormalizedFill();

describe.each([
  ['light', semanticLight.color],
  ['dark', semanticDark.color],
])('the %s theme progress bar', (_theme, color) => {
  it('keeps the label legible over a fill of any hue', () => {
    expect(findLowestContrast(fills, parseHexToLinearRgb(color['progress-label']))).toBeGreaterThanOrEqual(
      TEXT_MINIMUM,
    );
  });
});

describe('the light theme progress bar', () => {
  const color = semanticLight.color;
  const track = parseHexToLinearRgb(color['progress-track']);
  const label = parseHexToLinearRgb(color['progress-label']);

  it('keeps the label legible over the empty track', () => {
    expect(getContrastRatio(label, track)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it('tells a fill of any hue apart from the empty track', () => {
    expect(findLowestContrast(fills, track)).toBeGreaterThanOrEqual(SHAPE_MINIMUM);
  });

  it('stands out on a page or card without an outline, filled or empty', () => {
    for (const surface of [color.bg, color['bg-subtle']].map(parseHexToLinearRgb)) {
      expect(findLowestContrast(fills, surface)).toBeGreaterThanOrEqual(SHAPE_MINIMUM);
      expect(getContrastRatio(track, surface)).toBeGreaterThanOrEqual(SHAPE_MINIMUM);
    }
  });
});

describe('the dark theme progress bar, whose empty track shows the surface behind it', () => {
  const color = semanticDark.color;
  const label = parseHexToLinearRgb(color['progress-label']);
  const outline = parseHexToLinearRgb(color['progress-outline']);
  const surfaces = [color.bg, color['bg-subtle'], color['bg-muted']].map(parseHexToLinearRgb);

  it('leaves the empty track transparent', () => {
    expect(color['progress-track']).toBe('transparent');
  });

  it('keeps the label legible over every surface', () => {
    for (const surface of surfaces) {
      expect(getContrastRatio(label, surface)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
    }
  });

  it('keeps a fill of any hue near 2:1 against every surface, below 3:1 because the label states the value', () => {
    for (const surface of surfaces) {
      expect(findLowestContrast(fills, surface)).toBeGreaterThanOrEqual(FILL_EDGE_MINIMUM_BESIDE_A_VALUE_LABEL);
    }
  });

  it('draws an outline that stands out on every surface, since the track has no color of its own', () => {
    for (const surface of surfaces) {
      expect(getContrastRatio(outline, surface)).toBeGreaterThanOrEqual(SHAPE_MINIMUM);
    }
  });
});
