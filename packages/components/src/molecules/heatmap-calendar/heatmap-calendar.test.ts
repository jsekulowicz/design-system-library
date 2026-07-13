import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';
import { DsHeatmapCalendar } from './heatmap-calendar.js';
import './define.js';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
});

beforeEach(() => resetTestDom());

async function mountCalendar(props: Partial<DsHeatmapCalendar> = {}): Promise<DsHeatmapCalendar> {
  return mountWithProps<DsHeatmapCalendar>('<ds-heatmap-calendar></ds-heatmap-calendar>', {
    endDate: '2026-07-13',
    months: 1,
    data: [
      { date: '2026-07-12', value: 2 },
      { date: '2026-07-13', value: 4 },
    ],
    ...props,
  });
}

describe('<ds-heatmap-calendar>', () => {
  it('keeps the focus frame aligned to the calendar without overflowing its host', () => {
    const css = DsHeatmapCalendar.styles.map((style) => style.cssText).join('\n');

    expect(css).toMatch(/\.frame\s*{[^}]*width: fit-content/s);
    expect(css).toMatch(/\.frame\s*{[^}]*max-width: 100%/s);
  });

  it('renders empty input as level-zero cells', async () => {
    const element = await mountCalendar({ data: [] });
    const cells = element.shadowRoot!.querySelectorAll('rect.cell');
    expect(cells.length).toBeGreaterThan(28);
    expect(element.shadowRoot!.querySelectorAll('rect.level-0')).toHaveLength(cells.length);
  });

  it('renders a hidden data table for every visible day', async () => {
    const element = await mountCalendar();
    const cells = element.shadowRoot!.querySelectorAll('rect.cell');
    const rows = element.shadowRoot!.querySelectorAll('.visually-hidden tbody tr');
    expect(rows).toHaveLength(cells.length);
    expect(element.shadowRoot!.querySelector('.visually-hidden table')?.textContent).toContain(
      'Jul 13, 2026',
    );
  });

  it('keeps the tooltip and legend outside the horizontal scroller', async () => {
    const element = await mountCalendar();
    const frame = element.shadowRoot!.querySelector('.frame')!;
    const scroller = element.shadowRoot!.querySelector('.scroller')!;
    const tooltip = element.shadowRoot!.querySelector('.tooltip')!;
    const legend = element.shadowRoot!.querySelector('.legend')!;

    expect(frame.contains(tooltip)).toBe(true);
    expect(frame.contains(legend)).toBe(true);
    expect(scroller.contains(tooltip)).toBe(false);
    expect(scroller.contains(legend)).toBe(false);
  });

  it('positions top-row tooltips below their cells', async () => {
    const element = await mountCalendar();
    const frame = element.shadowRoot!.querySelector('.frame')!;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await element.updateComplete;

    expect(element.shadowRoot!.querySelector('.tooltip')?.getAttribute('data-position')).toBe(
      'below',
    );
  });

  it('keeps tooltip coordinates in sync with horizontal scrolling', async () => {
    const element = await mountCalendar();
    const frame = element.shadowRoot!.querySelector<HTMLElement>('.frame')!;
    const scroller = element.shadowRoot!.querySelector<HTMLElement>('.scroller')!;
    Object.defineProperty(scroller, 'scrollLeft', { configurable: true, value: 48 });

    scroller.dispatchEvent(new Event('scroll'));
    await element.updateComplete;

    expect(frame.style.getPropertyValue('--heatmap-scroll-left')).toBe('48px');
  });

  it('navigates by day and week and emits focus details', async () => {
    const element = await mountCalendar();
    const events: CustomEvent[] = [];
    element.addEventListener('ds-heatmap-focus', (event) => events.push(event as CustomEvent));
    const frame = element.shadowRoot!.querySelector('.frame')!;

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await element.updateComplete;

    expect((element as unknown as { _activeIndex: number })._activeIndex).toBe(8);
    expect(events.at(-1)?.detail).toEqual(
      expect.objectContaining({ value: expect.any(Number), level: expect.any(Number) }),
    );
  });

  it('jumps to the end, shows a tooltip, and clears it with Escape', async () => {
    const element = await mountCalendar();
    const frame = element.shadowRoot!.querySelector('.frame')!;
    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.tooltip')?.hasAttribute('hidden')).toBe(false);
    expect(element.shadowRoot!.querySelector('.tooltip')?.textContent).toContain('4');

    frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.tooltip')?.hasAttribute('hidden')).toBe(true);
  });
});
