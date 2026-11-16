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

async function mountCalendar(): Promise<DsHeatmapCalendar> {
  return mountWithProps<DsHeatmapCalendar>('<ds-heatmap-calendar></ds-heatmap-calendar>', {
    locale: 'en-US',
    endDate: '2026-07-13',
    months: 1,
    data: [
      { date: '2026-07-12', value: 2 },
      { date: '2026-07-13', value: 4 },
    ],
  });
}

function getCell(element: DsHeatmapCalendar, index: number): SVGRectElement {
  return element.shadowRoot!.querySelector<SVGRectElement>(`rect.cell[data-index="${index}"]`)!;
}

function isTooltipOpen(element: DsHeatmapCalendar): boolean {
  return element.shadowRoot!.querySelector('.point-tooltip')!.hasAttribute('data-open');
}

function getActiveIndex(element: DsHeatmapCalendar): string | null | undefined {
  return element.shadowRoot!.querySelector('.cell.active')?.getAttribute('data-index');
}

async function hover(element: DsHeatmapCalendar, index: number): Promise<void> {
  getCell(element, index).dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true }));
  await element.updateComplete;
}

async function leaveWithPointer(element: DsHeatmapCalendar): Promise<void> {
  element.shadowRoot!.querySelector('.scroller')!.dispatchEvent(new PointerEvent('pointerleave'));
  await element.updateComplete;
}

async function pressEscape(element: DsHeatmapCalendar): Promise<void> {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await element.updateComplete;
}

describe('the active day of <ds-heatmap-calendar>', () => {
  it('keeps the tooltip on a clicked day after the pointer leaves the calendar', async () => {
    const element = await mountCalendar();
    getCell(element, 3).focus();
    await element.updateComplete;

    await hover(element, 5);
    expect(getActiveIndex(element)).toBe('5');

    await leaveWithPointer(element);
    expect(getActiveIndex(element)).toBe('3');
    expect(isTooltipOpen(element)).toBe(true);
  });

  it('hides a hovered day once the pointer leaves, when no day holds focus', async () => {
    const element = await mountCalendar();
    await hover(element, 5);
    expect(isTooltipOpen(element)).toBe(true);

    await leaveWithPointer(element);
    expect(isTooltipOpen(element)).toBe(false);
  });

  it('shows no day while the pointer is between days', async () => {
    const element = await mountCalendar();

    element
      .shadowRoot!.querySelector('.scroller')!
      .dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true }));
    await element.updateComplete;

    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(escape);

    expect(getActiveIndex(element)).toBeUndefined();
    expect(isTooltipOpen(element)).toBe(false);
    expect(escape.defaultPrevented).toBe(false);
  });

  it('hides the tooltip on Escape and keeps the focused day marked', async () => {
    const element = await mountCalendar();
    getCell(element, 3).focus();
    await element.updateComplete;

    await pressEscape(element);
    expect(isTooltipOpen(element)).toBe(false);
    expect(getActiveIndex(element)).toBe('3');
  });

  it('shows the tooltip again when the focused day is clicked after Escape', async () => {
    const element = await mountCalendar();
    getCell(element, 3).focus();
    await element.updateComplete;
    await pressEscape(element);

    getCell(element, 3).dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(isTooltipOpen(element)).toBe(true);
  });

  it('shows the tooltip again for the next day the pointer reaches after Escape', async () => {
    const element = await mountCalendar();
    await hover(element, 5);
    await pressEscape(element);
    await hover(element, 5);
    expect(isTooltipOpen(element)).toBe(false);

    await hover(element, 6);
    expect(isTooltipOpen(element)).toBe(true);
  });

  it('closes the tooltip when focus leaves the calendar', async () => {
    const element = await mountCalendar();
    const outside = document.createElement('button');
    document.body.append(outside);
    getCell(element, 3).focus();
    await element.updateComplete;

    outside.focus();
    await element.updateComplete;
    expect(isTooltipOpen(element)).toBe(false);
  });

  it('moves from the focused day, not the hovered one, when an arrow key is pressed', async () => {
    const element = await mountCalendar();
    getCell(element, 3).focus();
    await element.updateComplete;
    await hover(element, 10);

    getCell(element, 3).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }),
    );
    await element.updateComplete;
    await element.updateComplete;

    expect(element.shadowRoot!.activeElement?.getAttribute('data-index')).toBe('4');
  });

  it('keeps the focused day as the one Tab stop while the pointer shows another', async () => {
    const element = await mountCalendar();
    getCell(element, 3).focus();
    await element.updateComplete;
    await hover(element, 10);

    expect(getCell(element, 3).getAttribute('tabindex')).toBe('0');
    expect(getCell(element, 10).getAttribute('tabindex')).toBe('-1');
  });

  it('leaves Escape to the page once no tooltip shows', async () => {
    const element = await mountCalendar();
    getCell(element, 3).focus();
    await element.updateComplete;
    await pressEscape(element);

    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(escape);

    expect(escape.defaultPrevented).toBe(false);
  });

  it('strokes the focused day like the active one and draws no browser outline around it', () => {
    const css = DsHeatmapCalendar.styles.map((style) => style.cssText).join('\n');

    expect(css).toMatch(/\.cell\s*{[^}]*outline: none/s);
    expect(css).toMatch(/\.cell:is\(\.active, :focus\)\s*{[^}]*stroke-width: var\(--heatmap-active-stroke-width\)/s);
  });

  it('pads the end and bottom of the scroller by half the stroke so the last week and weekday show it whole', () => {
    const css = DsHeatmapCalendar.styles.map((style) => style.cssText).join('\n');

    expect(css).toMatch(/\.scroller\s*{[^}]*padding-inline-end: calc\(var\(--heatmap-active-stroke-width\) \/ 2\)/s);
    expect(css).toMatch(/\.scroller\s*{[^}]*padding-block-end: calc\(var\(--heatmap-active-stroke-width\) \/ 2\)/s);
  });
});
