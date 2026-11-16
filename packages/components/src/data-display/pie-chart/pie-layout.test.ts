import { describe, it, expect } from 'vitest';
import { preparePieSlices, computeSliceAngles, sumSliceValues } from './pie-layout.js';
import {
  buildArcPath,
  computeCenterContentSize,
  computeInnerRadius,
  computeLabelPlacement,
  toCartesianPoint,
  RADIUS,
  CENTER,
} from './pie-geometry.js';
import type { PieChartDatum } from './types.js';

const OPTIONS = { maxSlices: 0, otherThreshold: 0, otherLabel: 'Other' };

const DATA: readonly PieChartDatum[] = [
  { label: 'A', value: 50 },
  { label: 'B', value: 30 },
  { label: 'C', value: 20 },
];

describe('preparePieSlices', () => {
  it('sorts slices by value and computes percentages', () => {
    const slices = preparePieSlices(
      [
        { label: 'small', value: 1 },
        { label: 'big', value: 9 },
      ],
      OPTIONS,
    );
    expect(slices.map((slice) => slice.label)).toEqual(['big', 'small']);
    expect(slices.map((slice) => slice.percent)).toEqual([90, 10]);
  });

  it('spans a full circle starting at twelve o clock', () => {
    const slices = preparePieSlices(DATA, OPTIONS);
    expect(slices[0]!.startAngle).toBeCloseTo(-Math.PI / 2);
    expect(slices[slices.length - 1]!.endAngle).toBeCloseTo(-Math.PI / 2 + Math.PI * 2);
  });

  it('drops zero, negative and non-finite values', () => {
    const slices = preparePieSlices(
      [
        { label: 'keep', value: 5 },
        { label: 'zero', value: 0 },
        { label: 'negative', value: -3 },
        { label: 'nan', value: Number.NaN },
      ],
      OPTIONS,
    );
    expect(slices.map((slice) => slice.label)).toEqual(['keep']);
    expect(slices[0]!.percent).toBe(100);
  });

  it('returns no slices when the total is zero', () => {
    expect(preparePieSlices([{ label: 'A', value: 0 }], OPTIONS)).toEqual([]);
    expect(preparePieSlices([], OPTIONS)).toEqual([]);
  });

  it('groups the tail into a single Other slice when maxSlices is set', () => {
    const data = Array.from({ length: 8 }, (_, i) => ({ label: `S${i}`, value: 10 - i }));
    const slices = preparePieSlices(data, { ...OPTIONS, maxSlices: 4 });
    expect(slices).toHaveLength(4);
    expect(slices[3]!.label).toBe('Other');
    expect(slices[3]!.isOther).toBe(true);
    expect(slices[3]!.sourceIndices).toHaveLength(5);
    expect(sumSliceValues(slices)).toBe(data.reduce((sum, datum) => sum + datum.value, 0));
  });

  it('groups slices below otherThreshold', () => {
    const slices = preparePieSlices(
      [
        { label: 'big', value: 90 },
        { label: 'tiny', value: 5 },
        { label: 'tinier', value: 5 },
      ],
      { ...OPTIONS, otherThreshold: 6 },
    );
    expect(slices.map((slice) => slice.label)).toEqual(['big', 'Other']);
    expect(slices[1]!.percent).toBe(10);
  });

  it('keeps a lone tail entry under its own label rather than calling it Other', () => {
    const slices = preparePieSlices(
      [
        { label: 'big', value: 95 },
        { label: 'tiny', value: 5 },
      ],
      { ...OPTIONS, otherThreshold: 6 },
    );
    expect(slices.map((slice) => slice.label)).toEqual(['big', 'tiny']);
    expect(slices.every((slice) => !slice.isOther)).toBe(true);
  });

  it('carries per-datum colors through', () => {
    const slices = preparePieSlices([{ label: 'A', value: 1, color: 'red' }], OPTIONS);
    expect(slices[0]!.color).toBe('red');
  });
});

describe('computeSliceAngles', () => {
  it('chains slices end to start', () => {
    const angled = computeSliceAngles([
      { label: 'A', value: 1, percent: 25, isOther: false, sourceIndices: [0] },
      { label: 'B', value: 3, percent: 75, isOther: false, sourceIndices: [1] },
    ]);
    expect(angled[0]!.endAngle).toBeCloseTo(angled[1]!.startAngle);
  });
});

describe('minimum slice share', () => {
  function computeSweepPercent(slice: { startAngle: number; endAngle: number }): number {
    return ((slice.endAngle - slice.startAngle) / (Math.PI * 2)) * 100;
  }

  it('draws a slice smaller than minSlicePercent at that minimum while keeping its true percent', () => {
    const slices = preparePieSlices(
      [
        { label: 'big', value: 9990 },
        { label: 'tiny', value: 10 },
      ],
      { ...OPTIONS, minSlicePercent: 1 },
    );
    expect(slices[1]!.percent).toBeCloseTo(0.1);
    expect(computeSweepPercent(slices[1]!)).toBeCloseTo(1);
    expect(computeSweepPercent(slices[0]!)).toBeCloseTo(99);
    expect(slices[1]!.endAngle).toBeCloseTo(-Math.PI / 2 + Math.PI * 2);
  });

  it('leaves slices at or above the minimum untouched', () => {
    const slices = preparePieSlices(DATA, { ...OPTIONS, minSlicePercent: 1 });
    expect(slices.map(computeSweepPercent).map(Math.round)).toEqual([50, 30, 20]);
  });

  it('falls back to true shares when every slice sits below the minimum', () => {
    const data = Array.from({ length: 4 }, (_, i) => ({ label: `S${i}`, value: 1 }));
    const slices = preparePieSlices(data, { ...OPTIONS, minSlicePercent: 30 });
    for (const slice of slices) {
      expect(computeSweepPercent(slice)).toBeCloseTo(25);
    }
  });
});

describe('zero-value slices', () => {
  it('keeps zero-value entries visible without an arc when opted in', () => {
    const slices = preparePieSlices(
      [
        { label: 'some', value: 5 },
        { label: 'none', value: 0, color: 'gray' },
      ],
      { ...OPTIONS, includeZeroSlices: true },
    );
    expect(slices.map((slice) => slice.label)).toEqual(['some', 'none']);
    expect(slices[1]!.percent).toBe(0);
    expect(slices[1]!.endAngle).toBe(slices[1]!.startAngle);
    expect(slices[1]!.color).toBe('gray');
  });

  it('never folds zero-value entries into the Other slice', () => {
    const slices = preparePieSlices(
      [
        { label: 'big', value: 90 },
        { label: 'tiny', value: 5 },
        { label: 'tinier', value: 5 },
        { label: 'none', value: 0 },
      ],
      { ...OPTIONS, otherThreshold: 6, includeZeroSlices: true },
    );
    expect(slices.map((slice) => slice.label)).toEqual(['big', 'Other', 'none']);
  });

  it('still reports no data when every value is zero', () => {
    const options = { ...OPTIONS, includeZeroSlices: true };
    expect(preparePieSlices([{ label: 'A', value: 0 }], options)).toEqual([]);
  });
});

describe('pie geometry', () => {
  it('draws a wedge from the center for a pie', () => {
    const [slice] = preparePieSlices(DATA, OPTIONS);
    const path = buildArcPath(slice!, RADIUS, 0);
    expect(path.startsWith(`M ${CENTER} ${CENTER}`)).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
  });

  it('draws two arcs for a single full-circle slice', () => {
    const [slice] = preparePieSlices([{ label: 'only', value: 1 }], OPTIONS);
    const path = buildArcPath(slice!, RADIUS, 0);
    expect(path.match(/A /g)).toHaveLength(2);
  });

  it('cuts a hole out of a full-circle donut', () => {
    const [slice] = preparePieSlices([{ label: 'only', value: 1 }], OPTIONS);
    const path = buildArcPath(slice!, RADIUS, 20);
    expect(path.match(/A /g)).toHaveLength(4);
    expect(path.match(/M /g)).toHaveLength(2);
  });

  it('clamps the donut inner radius and ignores it for pies', () => {
    expect(computeInnerRadius(false, 0.6)).toBe(0);
    expect(computeInnerRadius(true, 5)).toBeCloseTo(RADIUS * 0.9);
    expect(computeInnerRadius(true, -1)).toBe(0);
  });

  it('fits center content inside the circular hole with stroke clearance', () => {
    expect(computeCenterContentSize(true, 0.6)).toBe(27.294);
    expect(computeCenterContentSize(false, 0.6)).toBe(0);
  });

  it('places the twelve o clock point directly above the center', () => {
    const point = toCartesianPoint(RADIUS, -Math.PI / 2);
    expect(point.x).toBeCloseTo(CENTER);
    expect(point.y).toBeCloseTo(CENTER - RADIUS);
  });

  it('omits labels for slices below the minimum share and puts the rest outside the arc, on the page background that keeps 4.5:1 for every palette color', () => {
    const slices = preparePieSlices(
      [
        { label: 'big', value: 99 },
        { label: 'tiny', value: 1 },
      ],
      OPTIONS,
    );
    expect(computeLabelPlacement(slices[1]!, RADIUS).kind).toBe('none');
    expect(computeLabelPlacement(slices[0]!, RADIUS).kind).toBe('outside');
  });

  it('anchors left-hand labels at their end', () => {
    const slices = preparePieSlices(
      [
        { label: 'right', value: 50 },
        { label: 'left', value: 50 },
      ],
      OPTIONS,
    );
    const left = computeLabelPlacement(slices[1]!, RADIUS);
    const right = computeLabelPlacement(slices[0]!, RADIUS);
    expect(left.kind === 'outside' && left.anchorEnd).toBe('end');
    expect(right.kind === 'outside' && right.anchorEnd).toBe('start');
  });
});
