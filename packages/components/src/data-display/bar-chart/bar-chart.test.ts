import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsBarChart } from './bar-chart.js';
import type { BarChartSeries } from './types.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-bar-chart')) {
    customElements.define('ds-bar-chart', DsBarChart);
  }
  type RO = new (cb: ResizeObserverCallback) => ResizeObserver;
  (globalThis as unknown as { ResizeObserver: RO }).ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as RO;
});

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

async function mountBarChart(props: Partial<DsBarChart<MetricRow>> = {}): Promise<DsBarChart<MetricRow>> {
  const el = await mountWithProps<DsBarChart<MetricRow>>('<ds-bar-chart></ds-bar-chart>', {
    data: ROWS,
    domain: 'period',
    series: SERIES,
    ...props,
  });
  (el as unknown as { _width: number })._width = 600;
  await el.updateComplete;
  return el;
}

beforeEach(() => {
  resetTestDom();
});

function groups(el: DsBarChart<MetricRow>): SVGGElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<SVGGElement>('.bar-group'));
}

function bars(el: DsBarChart<MetricRow>): SVGRectElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<SVGRectElement>('rect.bar'));
}

describe('<ds-bar-chart>', () => {
  it('exposes bar groups as focusable graphics symbols', async () => {
    const el = await mountBarChart();
    const all = groups(el);
    expect(all.every((g) => g.getAttribute('role') === 'graphics-symbol')).toBe(true);
    expect(all.filter((g) => g.getAttribute('tabindex') === '0')).toHaveLength(1);
    expect(all[0]!.getAttribute('aria-label')).toBe('1: Website 3, Mobile 2, Partners 4');

    const svg = el.shadowRoot!.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('graphics-document');
    expect(svg.getAttribute('aria-roledescription')).toBe('bar chart');
    expect(el.shadowRoot!.querySelector('[role="application"]')).toBeNull();
  });

  it('renders the data table outside the chart frame', async () => {
    const el = await mountBarChart();
    const table = el.shadowRoot!.querySelector('table')!;
    expect(el.shadowRoot!.querySelector('.frame')!.contains(table)).toBe(false);
  });

  it('renders a height-preserving skeleton while loading', async () => {
    const el = await mountBarChart({
      data: [],
      height: 280,
      loading: true,
      loadingLabel: 'Loading data...',
    });
    const frame = el.shadowRoot!.querySelector<HTMLElement>('.loading-frame')!;

    expect(frame.style.height).toBe('280px');
    expect(frame.getAttribute('aria-busy')).toBe('true');
    expect(frame.querySelector('ds-skeleton')?.getAttribute('height')).toBe('280px');
    expect(frame.querySelector('[role="status"]')?.textContent).toContain('Loading data...');
    expect(groups(el)).toHaveLength(0);
  });

  it('shows the loading overlay when data is already available', async () => {
    const el = await mountBarChart({ loading: true });

    expect(el.shadowRoot!.querySelector('svg')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('ds-skeleton')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="loading"]')?.textContent).toContain('Loading...');
  });

  it('keeps an initialized chart visible beneath a loading overlay', async () => {
    const el = await mountBarChart({ loadingLabel: 'Refreshing data...' });
    el.loading = true;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('svg')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('ds-skeleton')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="loading"]')?.textContent).toContain('Refreshing data...');
    expect(el.shadowRoot!.querySelector('.frame')?.getAttribute('aria-busy')).toBe('true');
  });

  it('renders one bar-group per data row', async () => {
    const el = await mountBarChart();
    expect(groups(el)).toHaveLength(3);
  });

  it('renders seriesCount bars per group in grouped mode', async () => {
    const el = await mountBarChart({ stacked: false });
    expect(bars(el)).toHaveLength(3 * 3);
  });

  it('renders seriesCount segments per group in stacked mode', async () => {
    const el = await mountBarChart({ stacked: true });
    expect(bars(el)).toHaveLength(3 * 3);
  });

  it('exposes a hidden data table mirroring the rows and series', async () => {
    const el = await mountBarChart();
    const table = el.shadowRoot!.querySelector('.visually-hidden table')!;
    const rows = table.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
    const first = rows[0];
    expect(first.querySelector('th')?.textContent?.trim()).toBe('1');
    expect(first.querySelectorAll('td')).toHaveLength(3);
  });

  it('includes a total column in the hidden table when stacked', async () => {
    const el = await mountBarChart({ stacked: true });
    const headerCells = el.shadowRoot!.querySelectorAll('.visually-hidden table thead th');
    expect(headerCells[headerCells.length - 1].textContent?.trim()).toBe('Total');
  });

  it('moves active group with ArrowRight / ArrowLeft / Home / End', async () => {
    const el = await mountBarChart();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(0);

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(1);

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(2);

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(0);
  });

  it('does not wrap past the last or first group', async () => {
    const el = await mountBarChart();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    await el.updateComplete;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(2);
  });

  it('emits ds-bar-focus on active change with series values', async () => {
    const el = await mountBarChart();
    const events: CustomEvent[] = [];
    el.addEventListener('ds-bar-focus', (e) => events.push(e as CustomEvent));
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    expect(events[0]?.detail.groupIndex).toBe(0);
    expect(events[0]?.detail.values).toEqual([
      { key: 'Website', label: 'Website', value: 3 },
      { key: 'Mobile', label: 'Mobile', value: 2 },
      { key: 'Partners', label: 'Partners', value: 4 },
    ]);
  });

  it('only renders the group focus ring for keyboard interaction, not pointer hover', async () => {
    const el = await mountBarChart();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;

    const rect = frame.getBoundingClientRect();
    frame.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: rect.left + 200,
        clientY: rect.top + 100,
      }),
    );
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).not.toBeNull();
    expect(el.shadowRoot!.querySelector('rect.focus-ring')).toBeNull();

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('rect.focus-ring')).not.toBeNull();
  });

  it('shows the tooltip when a group is active and hides it on Escape', async () => {
    const el = await mountBarChart();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    const tooltip = el.shadowRoot!.querySelector('.point-tooltip') as HTMLElement;
    expect(tooltip.hasAttribute('data-open')).toBe(true);
    expect(tooltip.textContent).toContain('1');
    expect(tooltip.textContent).toContain('Website');

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;
    expect(tooltip.hasAttribute('data-open')).toBe(false);
  });

  it('anchors the tooltip to the active group rather than the chart edge', async () => {
    const el = await mountBarChart();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    await el.updateComplete;

    const anchor = el.shadowRoot!.querySelector('.point-anchor') as HTMLElement;
    expect(Number.parseFloat(anchor.style.left)).toBeGreaterThan(0);
  });

  it('uses series label and color overrides when provided', async () => {
    const el = await mountBarChart({
      series: [{ key: 'Website', label: 'Web channel', color: '#ff0000' }, { key: 'Mobile' }, { key: 'Partners' }],
    });
    const table = el.shadowRoot!.querySelector('.visually-hidden table');
    expect(table?.textContent).toContain('Web channel');
    const firstRect = el.shadowRoot!.querySelector('rect.bar') as SVGRectElement;
    expect(firstRect.getAttribute('fill')).toBe('#ff0000');
  });

  it('formats domain and values via formatters in the sr-table', async () => {
    const el = await mountBarChart({
      formatDomain: (v: unknown) => `Period ${v}`,
      formatValue: (v: number) => `${v} events`,
    });
    const table = el.shadowRoot!.querySelector('.visually-hidden table');
    expect(table?.textContent).toContain('Period 1');
    expect(table?.textContent).toContain('3 events');
  });

  it('confines horizontal tick labels to their band inside a clamped div', async () => {
    const el = await mountBarChart({
      formatDomain: (v: unknown) => `Extremely long category label number ${v}`,
    });
    const label = el.shadowRoot!.querySelector('.axis-x .tick-label')!;
    expect(label.textContent).toBe('Extremely long category label number 1');
    const holder = label.parentElement!;
    expect(holder.tagName.toLowerCase()).toBe('foreignobject');
    expect(Number(holder.getAttribute('width'))).toBeGreaterThan(0);
  });

  it('colors bars per domain via barColor with a series fallback', async () => {
    const el = await mountBarChart({
      barColor: (domain: unknown) => (domain === 1 ? 'tomato' : undefined),
    });
    const rects = [...el.shadowRoot!.querySelectorAll('rect.bar')];
    expect(rects[0]!.getAttribute('fill')).toBe('tomato');
    expect(rects[3]!.getAttribute('fill')).not.toBe('tomato');
  });

  it('titles the tooltip via formatTooltipTitle while the axis keeps formatDomain', async () => {
    const el = await mountBarChart({
      formatDomain: (v: unknown) => `T${v}`,
      formatTooltipTitle: (v: unknown) => `Period ${v} of 3`,
    });
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.tooltip-title')?.textContent).toBe('Period 1 of 3');
    expect(el.shadowRoot!.querySelector('.axis-x')?.textContent).toContain('T1');
  });
});
