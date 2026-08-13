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

describe('<ds-bar-chart> edge coverage', () => {
  it('covers ArrowLeft start navigation and empty-data early returns on stale frame listeners', async () => {
    const el = await mountChart();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;

    const left = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true });
    frame.dispatchEvent(left);
    await el.updateComplete;
    expect(left.defaultPrevented).toBe(true);
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(0);

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await el.updateComplete;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(0);

    el.data = [];
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    frame.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 120, clientY: 12 }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(0);

    frame.dispatchEvent(new MouseEvent('pointerleave', { bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBeNull();
  });

  it('covers narrow x-axis band branches and rotated labels', async () => {
    const rows = Array.from({ length: 40 }, (_, index) => ({
      period: index + 1,
      Website: index % 3,
      Mobile: index % 5,
      Partners: index % 7,
    }));
    const el = await mountChart({ data: rows });

    (el as unknown as { _width: number })._width = 360;
    await el.updateComplete;
    (el as unknown as { _width: number })._width = 220;
    await el.updateComplete;
    (el as unknown as { _width: number })._width = 140;
    await el.updateComplete;

    const axisTexts = Array.from(el.shadowRoot!.querySelectorAll('g.axis-x text'));
    expect(
      axisTexts.some((text) => (text as SVGTextElement).getAttribute('transform')?.includes('rotate') ?? false),
    ).toBe(true);
    expect(axisTexts.length).toBeGreaterThan(0);
  });

  it('covers null-domain and missing-series fallbacks in tooltip/live/sr output', async () => {
    const el = await mountChart({
      data: [{ period: null as unknown as number, Website: 0, Mobile: 0, Partners: 0 }],
      series: [{ key: 'Website' }, { key: 'Missing' }],
      stacked: true,
    });
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await el.updateComplete;

    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.textContent).toContain('Missing');
    expect(tooltip.textContent).toContain('0');
    const srTable = el.shadowRoot!.querySelector('.visually-hidden table') as HTMLTableElement;
    expect(srTable.textContent).toContain('Missing');
  });

  it('handles out-of-range active index safely in live text and focus ring rendering', async () => {
    const el = await mountChart();
    (el as unknown as { _activeIndex: number | null })._activeIndex = 999;
    (el as unknown as { _focusMode: 'keyboard' | 'pointer' | null })._focusMode = 'keyboard';
    await el.updateComplete;
    const live = el.shadowRoot!.querySelector('[role="status"]') as HTMLElement;
    expect(live.textContent).toBe('');
    expect(el.shadowRoot!.querySelector('.focus-ring')).toBeNull();
  });
});
