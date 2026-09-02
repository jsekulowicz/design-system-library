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
  return mountWithProps<DsSearchableSelect>(
    '<ds-searchable-select label="Framework"></ds-searchable-select>',
    {
      options: OPTIONS,
      ...props,
    },
    'ds-searchable-select',
  );
}

describe('<ds-searchable-select> extra coverage', () => {
  it('handles focus and search/clear pathways for a required, clearable single select', async () => {
    const el = await mountSearchable({ required: true, clearable: true, value: 'react' });
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
