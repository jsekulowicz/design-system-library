import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsBarChart } from './bar-chart.js';
import type { BarChartSeries } from './types.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

interface MetricRow {
  period: number;
  Website: number;
  Mobile: number;
  Partners: number;
}

const ROWS: readonly MetricRow[] = [
  { period: 1, Website: 3, Mobile: 2, Partners: 4 },
  { period: 2, Website: 2, Mobile: 4, Partners: 3 },
  { period: 3, Website: 5, Mobile: 5, Partners: 4 },
];

const SERIES: readonly BarChartSeries[] = [{ key: 'Website' }, { key: 'Mobile' }, { key: 'Partners' }];

beforeAll(() => {
  if (!customElements.get('ds-bar-chart')) {
    customElements.define('ds-bar-chart', DsBarChart);
  }
});

beforeEach(() => {
  resetTestDom();
  globalThis.ResizeObserver = class {
    observe(): void {}
    disconnect(): void {}
    unobserve(): void {}
  } as unknown as typeof ResizeObserver;
});

async function mountChart(props: Partial<DsBarChart<MetricRow>> = {}): Promise<DsBarChart<MetricRow>> {
  const el = await mountWithProps<DsBarChart<MetricRow>>(
    '<ds-bar-chart></ds-bar-chart>',
    {
      data: ROWS,
      domain: 'period',
      series: SERIES,
      ...props,
    },
    'ds-bar-chart',
  );
  (el as unknown as { _width: number })._width = 600;
  await el.updateComplete;
  return el;
}

describe('<ds-bar-chart> extra coverage', () => {
  it('renders empty frame for empty data and ignores keydown/pointer handlers safely', async () => {
    const el = await mountChart({ data: [] });
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    expect(frame).not.toBeNull();

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    frame.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 120, clientY: 10 }));
    await el.updateComplete;

    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBeNull();
  });

  it('renders axis labels and hides legend when disabled', async () => {
    const el = await mountChart({ xAxisLabel: 'Periods', yAxisLabel: 'Events', showLegend: false, title: '' });
    const svgText = el.shadowRoot!.querySelector('svg')?.textContent ?? '';
    expect(svgText).toContain('Periods');
    expect(svgText).toContain('Events');

    const caption = el.shadowRoot!.querySelector('.visually-hidden table caption')?.textContent;
    expect(caption).toContain('Bar chart data');
    expect(el.shadowRoot!.querySelector('.legend')).toBeNull();
  });

  it('tracks pointer focus and clears it when pointer exits bounds, leaves, or blur happens', async () => {
    const el = await mountChart();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;

    frame.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 120, clientY: 20 }));
    await el.updateComplete;
    expect((el as unknown as { _focusMode: string | null })._focusMode).toBe('pointer');
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).not.toBeNull();

    frame.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 0, clientY: 20 }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBeNull();

    frame.dispatchEvent(new MouseEvent('pointerleave', { bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusMode: string | null })._focusMode).toBeNull();

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    frame.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBeNull();
  });

  it('renders tooltip total row in stacked mode and supports non-navigation keys', async () => {
    const el = await mountChart({ stacked: true, height: 140 });
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.textContent).toContain('Total');

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(0);
  });

  it('works when requestAnimationFrame or ResizeObserver are unavailable', async () => {
    const originalRaf = globalThis.requestAnimationFrame;
    const originalRo = globalThis.ResizeObserver;
    globalThis.requestAnimationFrame = undefined as never;
    globalThis.ResizeObserver = undefined as never;

    try {
      const el = await mountChart();
      expect(el.shadowRoot!.querySelectorAll('.bar-group')).toHaveLength(3);
    } finally {
      globalThis.requestAnimationFrame = originalRaf;
      globalThis.ResizeObserver = originalRo;
    }
  });
});
