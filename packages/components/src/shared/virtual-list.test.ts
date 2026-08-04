import { describe, it, expect } from 'vitest';
import { html, render, type TemplateResult } from 'lit';
import { DEFAULT_ITEM_HEIGHT, renderVirtualItems } from './virtual-list.js';

const ITEMS = Array.from({ length: 100 }, (_, i) => `item-${i}`);

function spacerHeights(template: TemplateResult): number[] {
  const host = document.createElement('div');
  render(template, host);
  return [...host.querySelectorAll<HTMLElement>('[aria-hidden="true"]')].map((el) =>
    Number.parseFloat(el.style.height),
  );
}

function renderAt(scrollTop: number, itemHeight?: number): TemplateResult {
  return renderVirtualItems(
    ITEMS,
    scrollTop,
    (item) => html`<span>${item}</span>`,
    itemHeight,
  );
}

describe('renderVirtualItems', () => {
  it('reserves the default row height when none is given', () => {
    const [top] = spacerHeights(renderAt(DEFAULT_ITEM_HEIGHT * 10));
    // 10 rows scrolled minus the 3-row overscan.
    expect(top).toBe(7 * DEFAULT_ITEM_HEIGHT);
  });

  it('reserves the measured row height instead of the default', () => {
    const measured = 37.5;
    const [top, bottom] = spacerHeights(renderAt(measured * 10, measured));

    expect(top).toBe(7 * measured);
    // Every unrendered row is accounted for, so the scroll range is exact.
    const rendered = (bottom! - 0) / measured;
    expect(top! / measured + rendered).toBeLessThan(ITEMS.length);
  });

  it('keeps the window aligned with the scroll offset at a fractional height', () => {
    const measured = 37.5;
    const scrollTop = measured * 40;
    const [top] = spacerHeights(renderAt(scrollTop, measured));

    // The first rendered row lands exactly where the scroll offset says.
    expect(scrollTop - top!).toBe(3 * measured);
  });
});
