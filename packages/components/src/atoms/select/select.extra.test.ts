import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsSelect } from './select.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const OPTIONS = [
  { value: '', label: 'None' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular', disabled: true },
];
const MANY_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: `v${index}`,
  label: `Option ${index}`,
}));

beforeAll(() => {
  const proto = DsSelect.prototype as unknown as Record<string, () => void>;
  proto.setAriaLabel = () => {};
  proto.setAriaDescription = () => {};
});

beforeEach(() => {
  resetTestDom();
});

async function mountSelect(props: Partial<DsSelect> = {}): Promise<DsSelect> {
  return mountWithProps<DsSelect>('<ds-select label="Framework"></ds-select>', {
    options: OPTIONS,
    ...props,
  }, 'ds-select');
}

describe('<ds-select> extra coverage', () => {
  it('warns when label is missing', async () => {
    const warnings: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => warnings.push(args);
    try {
      await mountWithProps<DsSelect>('<ds-select></ds-select>', { options: OPTIONS }, 'ds-select');
      expect(warnings.some((args) => String(args[0]).includes('label'))).toBe(true);
    } finally {
      console.warn = original;
    }
  });

  it('closes on outside click and on disconnect', async () => {
    const el = await mountSelect();
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();

    document.body.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();

    trigger.click();
    await el.updateComplete;
    el.remove();
    expect((el as unknown as { _open: boolean })._open).toBe(false);
  });

  it('handles leading slot, list scroll sync and overflow reset path', async () => {
    const el = await mountWithProps<DsSelect>(
      '<ds-select label="Framework"><span slot="leading">L</span></ds-select>',
      { options: OPTIONS, multiple: true, values: ['react', 'vue', 'angular'], maxLines: 1 },
      'ds-select',
    );

    const leadingSlot = el.shadowRoot!.querySelector('slot[name="leading"]') as HTMLSlotElement;
    leadingSlot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    expect((el as unknown as { _hasLeading: boolean })._hasLeading).toBe(true);

    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;
    const listbox = el.shadowRoot!.querySelector('.listbox') as HTMLElement;
    listbox.scrollTop = 40;
    listbox.dispatchEvent(new Event('scroll'));
    await el.updateComplete;
    expect((el as unknown as { _scrollTop: number })._scrollTop).toBe(40);

    Object.defineProperty(el, '_listboxEl', { configurable: true, value: undefined });
    listbox.dispatchEvent(new Event('scroll'));
    await el.updateComplete;
    expect((el as unknown as { _scrollTop: number })._scrollTop).toBe(0);

    const tiles = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>('.tile[data-value]'));
    tiles.forEach((tile, index) => {
      Object.defineProperty(tile, 'offsetTop', { configurable: true, value: index * 30 });
    });
    el.values = [...el.values];
    await el.updateComplete;
    expect((el as unknown as { _overflowCount: number })._overflowCount).toBeGreaterThan(0);

    el.maxLines = undefined;
    await el.updateComplete;
    expect((el as unknown as { _overflowCount: number })._overflowCount).toBe(0);
  });

  it('supports tile keyboard navigation/removal and ignores keydown from clear button target', async () => {
    const el = await mountSelect({ multiple: true, clearable: true, values: ['react', 'vue'] });
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(1);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(-1);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    await el.updateComplete;
    expect(el.values).toEqual(['react']);

    const removeBtn = el.shadowRoot!.querySelector('.tile[data-value="react"] .tile-remove') as HTMLElement;
    const pointerEvent = new Event('pointerdown', { bubbles: true, cancelable: true });
    removeBtn.dispatchEvent(pointerEvent);
    expect(pointerEvent.defaultPrevented).toBe(true);

    const clearBtn = el.shadowRoot!.querySelector('.clear-btn') as HTMLElement;
    clearBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
  });

  it('scrolls focused option into view when keyboard focus moves below the viewport', async () => {
    const el = await mountWithProps<DsSelect>('<ds-select label="Framework"></ds-select>', {
      options: MANY_OPTIONS,
    }, 'ds-select');
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;

    for (let i = 0; i < 9; i += 1) {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    }
    await el.updateComplete;

    expect((el as unknown as { _scrollTop: number })._scrollTop).toBeGreaterThan(0);

    const firstOption = el.shadowRoot!.querySelector('.option') as HTMLElement;
    firstOption.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedIndex: number })._focusedIndex).toBe(0);

    (el as unknown as { _scrollTop: number })._scrollTop = 120;
    (el as unknown as { _focusedIndex: number })._focusedIndex = 4;
    await el.updateComplete;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _scrollTop: number })._scrollTop).toBeLessThan(120);
  });

  it('marks invalid when selecting empty required option and prevents enter selection on disabled option', async () => {
    const el = await mountSelect({ required: true, value: 'react' });
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;

    trigger.click();
    await el.updateComplete;
    const none = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>('.option')).find((option) =>
      option.querySelector('.option-label')?.textContent?.trim() === 'None',
    ) as HTMLElement;
    none.click();
    await el.updateComplete;
    expect(el.invalid).toBe(true);

    trigger.click();
    await el.updateComplete;
    (el as unknown as { _focusedIndex: number })._focusedIndex = 3;
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger.dispatchEvent(event);
    await el.updateComplete;
    expect(event.defaultPrevented).toBe(true);
    expect(el.value).toBe('');
  });

  it('covers keyboard edge branches for tile focus and enter handling', async () => {
    const el = await mountSelect({ multiple: true, values: ['react', 'vue'] });
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();

    (el as unknown as { _focusedTileIndex: number })._focusedTileIndex = 1;
    await el.updateComplete;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(0);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(1);

    (el as unknown as { _focusedTileIndex: number })._focusedTileIndex = 99;
    await el.updateComplete;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.values).toEqual(['react', 'vue']);

    (el as unknown as { _focusedIndex: number })._focusedIndex = 0;
    await el.updateComplete;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedIndex: number })._focusedIndex).toBe(0);

    (el as unknown as { _focusedIndex: number })._focusedIndex = -1;
    await el.updateComplete;
    const ignoredEnter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger.dispatchEvent(ignoredEnter);
    await el.updateComplete;
    expect(ignoredEnter.defaultPrevented).toBe(false);

    (el as unknown as { _focusedIndex: number })._focusedIndex = 99;
    await el.updateComplete;
    const outOfRangeEnter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger.dispatchEvent(outOfRangeEnter);
    await el.updateComplete;
    expect(outOfRangeEnter.defaultPrevented).toBe(false);
  });

  it('falls back to raw tile value label when option is missing', async () => {
    const el = await mountSelect({ multiple: true, values: ['missing'] });
    const label = el.shadowRoot!.querySelector('.tile-label')?.textContent?.trim();
    expect(label).toBe('missing');
  });

  it('avoids duplicate overflow queue scheduling while one check is pending', async () => {
    const el = await mountSelect({ multiple: true, values: ['react'], maxLines: 1 });
    (el as unknown as { _overflowCheckQueued: boolean })._overflowCheckQueued = true;
    el.values = [...el.values];
    await el.updateComplete;
    expect((el as unknown as { _overflowCheckQueued: boolean })._overflowCheckQueued).toBe(true);
  });
});
