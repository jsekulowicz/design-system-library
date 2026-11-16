import { beforeEach, describe, expect, it } from 'vitest';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';
import type { DsHeatmapCalendar } from './heatmap-calendar.js';
import './define.js';

beforeEach(() => resetTestDom());

async function mountCalendar(months = 1): Promise<DsHeatmapCalendar> {
  return mountWithProps<DsHeatmapCalendar>('<ds-heatmap-calendar></ds-heatmap-calendar>', {
    endDate: '2026-07-13',
    months,
  });
}

function getCell(element: DsHeatmapCalendar, index: number): SVGRectElement {
  return element.shadowRoot!.querySelector<SVGRectElement>(`.cell[data-index="${index}"]`)!;
}

function dispatchEscape(target: Document = document): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

describe('the active day lifecycle of <ds-heatmap-calendar>', () => {
  it('moves the Tab stop to a hovered day when it receives focus', async () => {
    const element = await mountCalendar();
    getCell(element, 5).dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true }));
    await element.updateComplete;

    getCell(element, 5).focus();
    await element.updateComplete;

    expect(getCell(element, 5).getAttribute('tabindex')).toBe('0');
    expect(element.shadowRoot!.querySelectorAll('.cell[tabindex="0"]')).toHaveLength(1);
  });

  it('keeps a Tab stop when the visible range shrinks past the focused day', async () => {
    const element = await mountCalendar(12);
    getCell(element, 100).focus();
    await element.updateComplete;

    element.months = 1;
    await element.updateComplete;

    expect(element.shadowRoot!.querySelectorAll('.cell[tabindex="0"]')).toHaveLength(1);
    expect(element.shadowRoot!.querySelector('.point-tooltip')!.hasAttribute('data-open')).toBe(false);
    expect(dispatchEscape().defaultPrevented).toBe(false);
  });

  it('leaves Escape to the page while loading removes the active day', async () => {
    const element = await mountCalendar();
    getCell(element, 5).focus();
    await element.updateComplete;

    element.loading = true;
    await element.updateComplete;

    expect(dispatchEscape().defaultPrevented).toBe(false);
    element.loading = false;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.point-tooltip')!.hasAttribute('data-open')).toBe(false);
  });

  it('listens for Escape in the document containing the calendar', async () => {
    const element = await mountCalendar();
    const otherDocument = document.implementation.createHTMLDocument();
    otherDocument.body.append(element);
    getCell(element, 5).dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(dispatchEscape().defaultPrevented).toBe(false);
    const escape = dispatchEscape(otherDocument);
    await element.updateComplete;

    expect(escape.defaultPrevented).toBe(true);
    expect(element.shadowRoot!.querySelector('.point-tooltip')!.hasAttribute('data-open')).toBe(false);
    element.remove();
    await element.updateComplete;
  });

  it('stops listening for Escape in its previous document once an open tooltip moves to another one', async () => {
    const element = await mountCalendar();
    getCell(element, 5).dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true }));
    await element.updateComplete;

    document.implementation.createHTMLDocument().body.append(element);
    await element.updateComplete;

    expect(dispatchEscape().defaultPrevented).toBe(false);
    element.remove();
    await element.updateComplete;
  });

  it('does not reopen a hovered tooltip when the calendar reconnects', async () => {
    const element = await mountCalendar();
    getCell(element, 5).dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true }));
    await element.updateComplete;

    element.remove();
    document.body.append(element);
    element.requestUpdate();
    await element.updateComplete;

    expect(element.shadowRoot!.querySelector('.point-tooltip')!.hasAttribute('data-open')).toBe(false);
  });
});
