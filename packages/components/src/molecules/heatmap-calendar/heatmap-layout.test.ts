import { describe, expect, it } from 'vitest';
import {
  civilFromDays,
  computeHeatmapLayout,
  daysFromCivil,
  formatCivil,
  levelForValue,
  parseDate,
} from './heatmap-layout.js';

describe('heatmap date math', () => {
  it('parses valid dates and rejects malformed or impossible dates', () => {
    expect(parseDate('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 });
    expect(parseDate('2023-02-29')).toBeNull();
    expect(parseDate('2024-2-09')).toBeNull();
  });

  it('round-trips civil dates without local timezone conversion', () => {
    const dates = ['1970-01-01', '2000-02-29', '2026-07-13'];
    for (const value of dates) {
      const parsed = parseDate(value)!;
      expect(formatCivil(civilFromDays(daysFromCivil(parsed)))).toBe(value);
    }
  });
});

describe('levelForValue', () => {
  it('quantizes positive values to levels 1 through 4', () => {
    expect([0, 1, 2, 4, 6, 8].map((value) => levelForValue(value, 8))).toEqual([0, 1, 1, 2, 3, 4]);
  });

  it('keeps invalid scales at level zero and clamps over-max values', () => {
    expect(levelForValue(3, 0)).toBe(0);
    expect(levelForValue(-1, 10)).toBe(0);
    expect(levelForValue(20, 10)).toBe(4);
  });
});

describe('computeHeatmapLayout', () => {
  it('aligns rolling dates into Monday-first week columns', () => {
    const layout = computeHeatmapLayout(
      [{ date: '2024-01-10', value: 3 }],
      '2024-01-10',
      1,
      'monday',
    );
    expect(layout.cells[0]?.date).toBe('2023-12-11');
    expect(layout.cells[0]?.row).toBe(0);
    expect(layout.cells.at(-1)).toMatchObject({ date: '2024-01-10', row: 2, value: 3, level: 4 });
    expect(layout.weekCount).toBe(5);
  });

  it('supports Sunday-first rows and returns an empty layout for an invalid end date', () => {
    const sunday = computeHeatmapLayout([], '2024-01-10', 1, 'sunday');
    expect(sunday.cells[0]).toMatchObject({ date: '2023-12-10', row: 0 });
    expect(computeHeatmapLayout([], 'bad-date', 12, 'monday').cells).toEqual([]);
  });
});
