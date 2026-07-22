import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsPieChart } from './pie-chart.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';
import type { PieChartDatum, PieChartSliceDetail } from './types.js';

beforeAll(() => {
  if (!customElements.get('ds-pie-chart')) {
    customElements.define('ds-pie-chart', DsPieChart);
  }
});

const DATA: readonly PieChartDatum[] = [
  { label: 'Organic', value: 50 },
  { label: 'Direct', value: 30 },
  { label: 'Referral', value: 20 },
];

async function mountPieChart(props: Partial<DsPieChart> = {}): Promise<DsPieChart> {
  return mountWithProps<DsPieChart>('<ds-pie-chart></ds-pie-chart>', {
    data: DATA,
    title: 'Sessions',
    ...props,
  });
}

function slices(el: DsPieChart): SVGElement[] {
  return [...el.shadowRoot!.querySelectorAll<SVGElement>('.slice')];
}

function press(el: DsPieChart, key: string): void {
  const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
  frame.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function activeIndexOf(el: DsPieChart): number | null {
  return (el as unknown as { _activeIndex: number | null })._activeIndex;
}

beforeEach(() => {
  resetTestDom();
});

describe('<ds-pie-chart>', () => {
  it('renders one focusable graphics symbol per slice', async () => {
    const el = await mountPieChart();
    const groups = slices(el);
    expect(groups).toHaveLength(3);
    expect(groups.every(g => g.getAttribute('role') === 'graphics-symbol')).toBe(true);
    expect(groups[0]!.getAttribute('aria-label')).toBe('Organic: 50, 50%');
  });

  it('keeps exactly one slice in the tab order', async () => {
    const el = await mountPieChart();
    expect(slices(el).filter(g => g.getAttribute('tabindex') === '0')).toHaveLength(1);
    press(el, 'ArrowRight');
    await el.updateComplete;
    const tabbable = slices(el).filter(g => g.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]!.getAttribute('data-index')).toBe('0');
  });

  it('labels the graphic with a summary instead of role="application"', async () => {
    const el = await mountPieChart();
    const svg = el.shadowRoot!.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('graphics-document');
    expect(svg.getAttribute('aria-roledescription')).toBe('pie chart');
    expect(el.shadowRoot!.querySelector('[role="application"]')).toBeNull();
    const titleId = svg.getAttribute('aria-labelledby')!;
    expect(el.shadowRoot!.getElementById(titleId)?.textContent).toContain('Sessions: 3 slices, total 100.');
  });

  it('renders the data table outside the chart frame', async () => {
    const el = await mountPieChart();
    const table = el.shadowRoot!.querySelector('table')!;
    expect(el.shadowRoot!.querySelector('.frame')!.contains(table)).toBe(false);
    expect(table.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(table.querySelector('tfoot td')?.textContent?.trim()).toBe('100');
  });

  it('moves the active slice with arrows and wraps around the ring', async () => {
    const el = await mountPieChart();
    press(el, 'ArrowRight');
    await el.updateComplete;
    expect(activeIndexOf(el)).toBe(0);
    press(el, 'ArrowLeft');
    await el.updateComplete;
    expect(activeIndexOf(el)).toBe(2);
    press(el, 'End');
    await el.updateComplete;
    expect(activeIndexOf(el)).toBe(2);
    press(el, 'Home');
    await el.updateComplete;
    expect(activeIndexOf(el)).toBe(0);
  });

  it('clears the active slice on Escape', async () => {
    const el = await mountPieChart();
    press(el, 'ArrowRight');
    await el.updateComplete;
    press(el, 'Escape');
    await el.updateComplete;
    expect(activeIndexOf(el)).toBeNull();
    expect(el.shadowRoot!.querySelector('[role="status"]')!.textContent?.trim()).toBe('');
  });

  it('emits ds-slice-focus with the slice payload', async () => {
    const el = await mountPieChart();
    const events: PieChartSliceDetail[] = [];
    el.addEventListener('ds-slice-focus', event => {
      events.push((event as CustomEvent<PieChartSliceDetail>).detail);
    });
    press(el, 'ArrowRight');
    await el.updateComplete;
    expect(events).toEqual([
      { index: 0, label: 'Organic', value: 50, percent: 50, isOther: false },
    ]);
  });

  it('emits ds-slice-select on Enter, Space and click', async () => {
    const el = await mountPieChart();
    const selected: string[] = [];
    el.addEventListener('ds-slice-select', event => {
      selected.push((event as CustomEvent<PieChartSliceDetail>).detail.label);
    });
    press(el, 'ArrowRight');
    await el.updateComplete;
    press(el, 'Enter');
    press(el, ' ');
    slices(el)[1]!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await el.updateComplete;
    expect(selected).toEqual(['Organic', 'Organic', 'Direct']);
  });

  it('announces the active slice in the live region', async () => {
    const el = await mountPieChart();
    press(el, 'End');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[role="status"]')!.textContent?.trim()).toBe(
      'Referral: 20, 20%.',
    );
  });

  it('formats values and percentages through the provided formatters', async () => {
    const el = await mountPieChart({
      formatValue: (value: number) => `$${value}`,
      formatPercent: (percent: number) => `${percent.toFixed(1)}%`,
    });
    expect(slices(el)[0]!.getAttribute('aria-label')).toBe('Organic: $50, 50.0%');
  });

  it('shows the total in the donut centre and hides it from assistive tech', async () => {
    const el = await mountPieChart({ donut: true });
    const center = el.shadowRoot!.querySelector('.center')!;
    expect(center.getAttribute('aria-hidden')).toBe('true');
    expect(center.querySelector('.center-value')!.textContent?.trim()).toBe('100');
    expect(center.querySelector('slot')!.getAttribute('name')).toBe('center');
  });

  it('renders a skeleton while loading and a message when there is no data', async () => {
    const loading = await mountPieChart({ loading: true });
    expect(loading.shadowRoot!.querySelector('ds-skeleton')).not.toBeNull();
    expect(loading.shadowRoot!.querySelector('.frame')!.getAttribute('aria-busy')).toBe('true');

    const empty = await mountPieChart({ data: [] });
    expect(empty.shadowRoot!.querySelector('.empty')!.textContent?.trim()).toBe('No data');
    expect(slices(empty)).toHaveLength(0);
  });

  it('groups the tail into Other and reports it in the event payload', async () => {
    const el = await mountPieChart({
      data: [
        { label: 'A', value: 60 },
        { label: 'B', value: 30 },
        { label: 'C', value: 6 },
        { label: 'D', value: 4 },
      ],
      maxSlices: 3,
    });
    const details: PieChartSliceDetail[] = [];
    el.addEventListener('ds-slice-focus', event => {
      details.push((event as CustomEvent<PieChartSliceDetail>).detail);
    });
    press(el, 'End');
    await el.updateComplete;
    expect(details[0]).toEqual({ index: 2, label: 'Other', value: 10, percent: 10, isOther: true });
  });

  it('ignores keyboard navigation when there is nothing to focus', async () => {
    const el = await mountPieChart({ data: [] });
    press(el, 'ArrowRight');
    await el.updateComplete;
    expect(activeIndexOf(el)).toBeNull();
  });

  it('keeps zero-value categories in the legend without drawing an arc', async () => {
    const el = await mountPieChart({
      data: [...DATA, { label: 'Paid', value: 0 }],
      includeZeroSlices: true,
    });
    const groups = slices(el);
    expect(groups).toHaveLength(4);
    const zero = groups[3]!;
    expect(zero.getAttribute('aria-label')).toBe('Paid: 0, 0%');
    expect(zero.querySelector('path')).toBeNull();
    expect(el.shadowRoot!.querySelector('.legend')?.textContent).toContain('Paid');
  });

  it('formats legend values as value (percent)', async () => {
    const el = await mountPieChart();
    const value = el.shadowRoot!.querySelector('.legend-value');
    expect(value?.textContent?.replace(/\s+/g, ' ').trim()).toBe('50 (50%)');
  });
});
