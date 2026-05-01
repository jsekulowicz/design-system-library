import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsBarChart } from './bar-chart.js';
import type { BarChartSeries } from './types.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

type Turn = { turn: number; Jess: number; Marco: number; Andrew: number };

const ROWS: readonly Turn[] = [
  { turn: 1, Jess: 3, Marco: 2, Andrew: 4 },
  { turn: 2, Jess: 2, Marco: 4, Andrew: 3 },
  { turn: 3, Jess: 5, Marco: 5, Andrew: 4 },
];

const SERIES: readonly BarChartSeries[] = [
  { key: 'Jess' },
  { key: 'Marco' },
  { key: 'Andrew' },
];

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

async function mountChart(props: Partial<DsBarChart<Turn>> = {}): Promise<DsBarChart<Turn>> {
  const el = await mountWithProps<DsBarChart<Turn>>('<ds-bar-chart></ds-bar-chart>', {
    data: ROWS,
    domain: 'turn',
    series: SERIES,
    ...props,
  }, 'ds-bar-chart');
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
    const el = await mountChart({ xAxisLabel: 'Turns', yAxisLabel: 'Points', showLegend: false, title: '' });
    const svgText = el.shadowRoot!.querySelector('svg')?.textContent ?? '';
    expect(svgText).toContain('Turns');
    expect(svgText).toContain('Points');

    const caption = el.shadowRoot!.querySelector('.sr-only table caption')?.textContent;
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
    frame.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
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
