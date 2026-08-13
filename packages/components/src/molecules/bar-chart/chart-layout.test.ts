import { describe, expect, it } from 'vitest';
import { computeChartLayout } from './chart-layout.js';

const BASE_OPTIONS = {
  data: [{ month: 'Jan', revenue: 50_000 }],
  domain: 'month',
  seriesKeys: ['revenue'],
  stacked: false,
  measuredWidth: 640,
  height: 320,
  hasXAxisLabel: false,
  hasYAxisLabel: false,
} as const;

describe('computeChartLayout', () => {
  it('sizes the margin for unformatted tick labels', () => {
    const layout = computeChartLayout(BASE_OPTIONS);
    expect(layout.margin.left).toBe(47);
  });

  it('reserves room for formatted ticks and a Y-axis label', () => {
    const layout = computeChartLayout({
      ...BASE_OPTIONS,
      hasYAxisLabel: true,
      formatValue: (value) => `$${value.toLocaleString('en-US')}`,
    });
    expect(layout.margin.left).toBeGreaterThanOrEqual(85);
  });

  it('preserves a usable plot width when formatted ticks exceed a narrow chart', () => {
    const layout = computeChartLayout({
      ...BASE_OPTIONS,
      measuredWidth: 80,
      formatValue: (value) => `USD ${value.toLocaleString('en-US')}`,
    });
    expect(layout.innerWidth).toBe(48);
    expect(layout.margin.left).toBe(16);
  });
});
