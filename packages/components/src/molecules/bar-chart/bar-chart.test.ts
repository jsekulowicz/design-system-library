import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsBarChart } from './bar-chart.js';
import type { BarChartSeries } from './types.js';
import './define.js';

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

type Turn = {
  turn: number;
  Jess: number;
  Marco: number;
  Andrew: number;
};

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

async function mount(props: Partial<DsBarChart<Turn>> = {}): Promise<DsBarChart<Turn>> {
  document.body.innerHTML = '<ds-bar-chart></ds-bar-chart>';
  const el = document.body.firstElementChild as DsBarChart<Turn>;
  Object.assign(el, { data: ROWS, domain: 'turn', series: SERIES, ...props });
  await el.updateComplete;
  (el as unknown as { _width: number })._width = 600;
  await el.updateComplete;
  return el;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

function groups(el: DsBarChart<Turn>): SVGGElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<SVGGElement>('.bar-group'));
}

function bars(el: DsBarChart<Turn>): SVGRectElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<SVGRectElement>('rect.bar'));
}

describe('<ds-bar-chart>', () => {
  it('renders one bar-group per data row', async () => {
    const el = await mount();
    expect(groups(el)).toHaveLength(3);
  });

  it('renders seriesCount bars per group in grouped mode', async () => {
    const el = await mount({ stacked: false });
    expect(bars(el)).toHaveLength(3 * 3);
  });

  it('renders seriesCount segments per group in stacked mode', async () => {
    const el = await mount({ stacked: true });
    expect(bars(el)).toHaveLength(3 * 3);
  });

  it('exposes a hidden data table mirroring the rows and series', async () => {
    const el = await mount();
    const table = el.shadowRoot!.querySelector('.sr-only table')!;
    const rows = table.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
    const first = rows[0];
    expect(first.querySelector('th')?.textContent?.trim()).toBe('1');
    expect(first.querySelectorAll('td')).toHaveLength(3);
  });

  it('includes a total column in the hidden table when stacked', async () => {
    const el = await mount({ stacked: true });
    const headerCells = el.shadowRoot!.querySelectorAll('.sr-only table thead th');
    expect(headerCells[headerCells.length - 1].textContent?.trim()).toBe('Total');
  });

  it('moves active group with ArrowRight / ArrowLeft / Home / End', async () => {
    const el = await mount();
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
    const el = await mount();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    await el.updateComplete;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).toBe(2);
  });

  it('emits ds-bar-focus on active change with series values', async () => {
    const el = await mount();
    const events: CustomEvent[] = [];
    el.addEventListener('ds-bar-focus', e => events.push(e as CustomEvent));
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    expect(events[0]?.detail.groupIndex).toBe(0);
    expect(events[0]?.detail.values).toEqual([
      { key: 'Jess', label: 'Jess', value: 3 },
      { key: 'Marco', label: 'Marco', value: 2 },
      { key: 'Andrew', label: 'Andrew', value: 4 },
    ]);
  });

  it('only renders the group focus ring for keyboard interaction, not pointer hover', async () => {
    const el = await mount();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;

    const rect = frame.getBoundingClientRect();
    frame.dispatchEvent(new MouseEvent('pointermove', {
      bubbles: true,
      clientX: rect.left + 200,
      clientY: rect.top + 100,
    }));
    await el.updateComplete;
    expect((el as unknown as { _activeIndex: number | null })._activeIndex).not.toBeNull();
    expect(el.shadowRoot!.querySelector('rect.focus-ring')).toBeNull();

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('rect.focus-ring')).not.toBeNull();
  });

  it('shows the tooltip when a group is active and hides it on Escape', async () => {
    const el = await mount();
    const frame = el.shadowRoot!.querySelector('.frame') as HTMLElement;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.hasAttribute('hidden')).toBe(false);
    expect(tooltip.textContent).toContain('1');
    expect(tooltip.textContent).toContain('Jess');

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;
    expect(tooltip.hasAttribute('hidden')).toBe(true);
  });

  it('uses series label and color overrides when provided', async () => {
    const el = await mount({
      series: [
        { key: 'Jess', label: 'Jessica', color: '#ff0000' },
        { key: 'Marco' },
        { key: 'Andrew' },
      ],
    });
    const table = el.shadowRoot!.querySelector('.sr-only table');
    expect(table?.textContent).toContain('Jessica');
    const firstRect = el.shadowRoot!.querySelector('rect.bar') as SVGRectElement;
    expect(firstRect.getAttribute('fill')).toBe('#ff0000');
  });

  it('formats domain and values via formatters in the sr-table', async () => {
    const el = await mount({
      formatDomain: (v: unknown) => `Turn ${v}`,
      formatValue: (v: number) => `${v} pts`,
    });
    const table = el.shadowRoot!.querySelector('.sr-only table');
    expect(table?.textContent).toContain('Turn 1');
    expect(table?.textContent).toContain('3 pts');
  });
});
