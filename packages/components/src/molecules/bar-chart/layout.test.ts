import { describe, it, expect } from 'vitest';
import {
  niceMax,
  generateTicks,
  groupData,
  computeGroupBands,
  computeGroupedBars,
  computeStackSegments,
} from './layout.js';

describe('niceMax', () => {
  it('returns 1 for non-positive or non-finite values', () => {
    expect(niceMax(0)).toBe(1);
    expect(niceMax(-5)).toBe(1);
    expect(niceMax(Number.NaN)).toBe(1);
  });

  it('rounds typical values up to the next nice boundary', () => {
    expect(niceMax(7)).toBe(10);
    expect(niceMax(23)).toBe(25);
    expect(niceMax(41)).toBe(50);
    expect(niceMax(101)).toBe(200);
  });

  it('handles fractional maxima', () => {
    expect(niceMax(0.8)).toBe(1);
    expect(niceMax(0.04)).toBe(0.05);
  });
});

describe('generateTicks', () => {
  it('produces evenly spaced ticks from 0 to max', () => {
    expect(generateTicks(10)).toEqual([0, 2, 4, 6, 8, 10]);
    expect(generateTicks(25)).toEqual([0, 5, 10, 15, 20, 25]);
  });

  it('returns a single tick when max is 0', () => {
    expect(generateTicks(0)).toEqual([0]);
  });
});

describe('groupData', () => {
  it('extracts series values and totals, preserving row order', () => {
    const rows = [
      { turn: 1, Jess: 3, Marco: 2 },
      { turn: 2, Jess: 2, Marco: 4 },
    ];
    const groups = groupData(rows, 'turn', ['Jess', 'Marco']);
    expect(groups).toHaveLength(2);
    expect(groups[0].domain).toBe(1);
    expect(groups[0].values).toEqual({ Jess: 3, Marco: 2 });
    expect(groups[0].total).toBe(5);
    expect(groups[1].total).toBe(6);
  });

  it('fills missing or non-numeric values with 0', () => {
    const rows = [{ turn: 1, Jess: 3 }];
    const groups = groupData(rows, 'turn', ['Jess', 'Ghost']);
    expect(groups[0].values).toEqual({ Jess: 3, Ghost: 0 });
    expect(groups[0].total).toBe(3);
  });
});

describe('computeGroupBands', () => {
  it('splits innerWidth evenly and applies outer padding', () => {
    const bands = computeGroupBands(300, 3, 0.1);
    expect(bands).toHaveLength(3);
    expect(bands[0].bandWidth).toBe(100);
    expect(bands[0].innerX).toBeCloseTo(10);
    expect(bands[0].innerWidth).toBeCloseTo(80);
    expect(bands[2].x).toBe(200);
  });

  it('caps the outer gap to keep inner widths non-negative', () => {
    const bands = computeGroupBands(100, 2, 2);
    expect(bands[0].innerWidth).toBeGreaterThanOrEqual(0);
  });
});

describe('computeGroupedBars', () => {
  it('returns one bar per series with equal widths', () => {
    const bars = computeGroupedBars(10, 60, 3, 2);
    expect(bars).toHaveLength(3);
    bars.forEach(b => expect(b.width).toBeCloseTo((60 - 2 * 2) / 3));
    expect(bars[0].x).toBe(10);
    expect(bars[1].x).toBeCloseTo(10 + bars[0].width + 2);
  });

  it('clamps to minimum width 1 when space is tight', () => {
    const bars = computeGroupedBars(0, 5, 10, 2);
    bars.forEach(b => expect(b.width).toBeGreaterThanOrEqual(1));
  });
});

describe('computeStackSegments', () => {
  it('stacks heights from the bottom up with monotonically decreasing y', () => {
    const segs = computeStackSegments({ a: 2, b: 3 }, ['a', 'b'], 100, 10);
    expect(segs[0].height).toBeCloseTo(20);
    expect(segs[1].height).toBeCloseTo(30);
    expect(segs[0].y).toBeCloseTo(80);
    expect(segs[1].y).toBeCloseTo(50);
    expect(segs[1].y).toBeLessThan(segs[0].y);
  });

  it('sums heights proportional to total over yMax', () => {
    const segs = computeStackSegments({ a: 2, b: 3 }, ['a', 'b'], 100, 10);
    const totalHeight = segs.reduce((s, v) => s + v.height, 0);
    expect(totalHeight).toBeCloseTo(50);
  });

  it('returns zero-height segments when yMax or innerHeight is 0', () => {
    const segs = computeStackSegments({ a: 2 }, ['a'], 0, 10);
    expect(segs[0].height).toBe(0);
  });
});
