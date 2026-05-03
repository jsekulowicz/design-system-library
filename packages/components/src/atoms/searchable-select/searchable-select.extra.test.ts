import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsSearchableSelect } from './searchable-select.js';
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
  const proto = DsSearchableSelect.prototype as unknown as Record<string, () => void>;
  proto.setAriaLabel = () => {};
  proto.setAriaDescription = () => {};
});

beforeEach(() => {
  resetTestDom();
});

async function mountSearchable(props: Partial<DsSearchableSelect> = {}): Promise<DsSearchableSelect> {
  return mountWithProps<DsSearchableSelect>('<ds-searchable-select label="Framework"></ds-searchable-select>', {
    options: OPTIONS,
    ...props,
  }, 'ds-searchable-select');
}

describe('<ds-searchable-select> extra coverage', () => {
  it('warns when label is missing and does not open while loading', async () => {
    const warnings: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => warnings.push(args);
    try {
      const el = await mountWithProps<DsSearchableSelect>('<ds-searchable-select></ds-searchable-select>', {
        options: OPTIONS,
        loading: true,
      }, 'ds-searchable-select');
      expect(warnings.some((args) => String(args[0]).includes('label'))).toBe(true);
      (el.shadowRoot!.querySelector('.trigger') as HTMLElement).click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    } finally {
      console.warn = original;
    }
  });

  it('closes on outside click and renders empty-state text when open without options', async () => {
    const el = await mountSearchable({ options: [] });
    (el.shadowRoot!.querySelector('.trigger') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.empty')?.textContent).toContain('No results');

    document.body.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
  });

  it('highlights matches while searching and syncs leading slot + overflow reset', async () => {
    const el = await mountWithProps<DsSearchableSelect>(
      '<ds-searchable-select label="Framework"><span slot="leading">L</span></ds-searchable-select>',
      { options: OPTIONS, multiple: true, values: ['react', 'vue', 'angular'], maxLines: 1 },
      'ds-searchable-select',
    );
    const leadingSlot = el.shadowRoot!.querySelector('slot[name="leading"]') as HTMLSlotElement;
    leadingSlot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    expect((el as unknown as { _hasLeading: boolean })._hasLeading).toBe(true);

    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    input.value = 'ea';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ds-select-option .match')?.textContent?.toLowerCase()).toContain('ea');

    input.value = 'ct';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ds-select-option .match')?.textContent?.toLowerCase()).toContain('ct');

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

  it('supports tile keyboard navigation/removal and prevents selecting disabled option with Enter', async () => {
    const el = await mountSearchable({ multiple: true, values: ['react', 'vue'], clearable: true });
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    input.setSelectionRange(0, 0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(1);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(-1);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.values).toEqual(['react']);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    await el.updateComplete;
    (el as unknown as { _focusedIndex: number })._focusedIndex = 3;
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    input.dispatchEvent(enterEvent);
    await el.updateComplete;
    expect(enterEvent.defaultPrevented).toBe(true);

    const clearBtn = el.shadowRoot!.querySelector('.clear-btn') as HTMLElement;
    const removeBtn = el.shadowRoot!.querySelector('.tile[data-value="react"] .tile-remove') as HTMLElement;
    const pointerEvent = new Event('pointerdown', { bubbles: true, cancelable: true });
    removeBtn.dispatchEvent(pointerEvent);
    expect(pointerEvent.defaultPrevented).toBe(true);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    clearBtn.dispatchEvent(spaceEvent);
    await el.updateComplete;
    expect(spaceEvent.defaultPrevented).toBe(true);
  });

  it('handles focus and search/clear pathways for required single select', async () => {
    const el = await mountSearchable({ required: true, value: 'react' });
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;

    (el.shadowRoot!.querySelector('.clear-btn') as HTMLElement).click();
    await el.updateComplete;
    expect(el.value).toBe('');

    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;
    (el.shadowRoot!.querySelector('ds-select-option') as HTMLElement).click();
    await el.updateComplete;
    expect(el.invalid).toBe(true);
  });

  it('updates focus on mouseenter and syncs list scroll while moving keyboard focus', async () => {
    const el = await mountWithProps<DsSearchableSelect>(
      '<ds-searchable-select label="Framework"></ds-searchable-select>',
      { options: MANY_OPTIONS },
      'ds-searchable-select',
    );
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;

    const listbox = el.shadowRoot!.querySelector('.listbox') as HTMLElement;
    listbox.scrollTop = 44;
    listbox.dispatchEvent(new Event('scroll'));
    await el.updateComplete;
    expect((el as unknown as { _scrollTop: number })._scrollTop).toBe(44);

    Object.defineProperty(el, '_listboxEl', { configurable: true, value: undefined });
    listbox.dispatchEvent(new Event('scroll'));
    await el.updateComplete;
    expect((el as unknown as { _scrollTop: number })._scrollTop).toBe(0);
    Object.defineProperty(el, '_listboxEl', { configurable: true, value: listbox });

    const firstOption = el.shadowRoot!.querySelector('ds-select-option') as HTMLElement;
    firstOption.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedIndex: number })._focusedIndex).toBe(0);

    for (let i = 0; i < 10; i += 1) {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    }
    await el.updateComplete;
    expect((el as unknown as { _scrollTop: number })._scrollTop).toBeGreaterThan(0);

    (el as unknown as { _scrollTop: number })._scrollTop = 120;
    (el as unknown as { _focusedIndex: number })._focusedIndex = 4;
    await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _scrollTop: number })._scrollTop).toBeLessThan(120);
    expect(listbox.scrollTop).toBe((el as unknown as { _scrollTop: number })._scrollTop);
  });

  it('does not open on focus when disabled', async () => {
    const el = await mountSearchable({ disabled: true });
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
  });

  it('covers keyboard edge branches for tiles and disabled/open guards', async () => {
    const el = await mountSearchable({ multiple: true, clearable: true, values: ['react', 'vue'] });
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;

    el.disabled = true;
    await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();

    el.disabled = false;
    await el.updateComplete;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();

    (el as unknown as { _focusedTileIndex: number })._focusedTileIndex = 1;
    await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedTileIndex: number })._focusedTileIndex).toBe(1);

    (el as unknown as { _focusedTileIndex: number })._focusedTileIndex = 99;
    await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.values).toEqual(['react', 'vue']);

    (el as unknown as { _focusedIndex: number })._focusedIndex = 0;
    await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _focusedIndex: number })._focusedIndex).toBe(0);

    const clearBtn = el.shadowRoot!.querySelector('.clear-btn') as HTMLElement;
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    clearBtn.dispatchEvent(tabEvent);
    await el.updateComplete;
    expect(tabEvent.defaultPrevented).toBe(false);

    (el as unknown as { _focusedIndex: number })._focusedIndex = 99;
    await el.updateComplete;
    const outOfRangeEnter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    input.dispatchEvent(outOfRangeEnter);
    await el.updateComplete;
    expect(outOfRangeEnter.defaultPrevented).toBe(false);
  });

  it('falls back to raw tile label when selected value is not in options', async () => {
    const el = await mountSearchable({ multiple: true, values: ['missing'] });
    const label = el.shadowRoot!.querySelector('.tile-label')?.textContent?.trim();
    expect(label).toBe('missing');
  });

  it('handles ArrowUp key navigation when the dropdown is open', async () => {
    const el = await mountSearchable();
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true });
    input.dispatchEvent(event);
    await el.updateComplete;
    expect(event.defaultPrevented).toBe(true);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    input.dispatchEvent(tabEvent);
    await el.updateComplete;
    expect(tabEvent.defaultPrevented).toBe(false);
  });

  it('avoids duplicate overflow queue scheduling while one check is pending', async () => {
    const el = await mountSearchable({ multiple: true, values: ['react'], maxLines: 1 });
    (el as unknown as { _overflowCheckQueued: boolean })._overflowCheckQueued = true;
    el.values = [...el.values];
    await el.updateComplete;
    expect((el as unknown as { _overflowCheckQueued: boolean })._overflowCheckQueued).toBe(true);
  });
});
