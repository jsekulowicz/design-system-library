import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSearchableSelect } from './searchable-select.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

// jsdom 25 does not implement ElementInternals ARIA reflection (ariaLabel, ariaDescription).
// Stub them so tests focus on component behaviour, not platform internals.
beforeAll(() => {
  const proto = DsSearchableSelect.prototype as unknown as Record<string, () => void>;
  proto['setAriaLabel'] = () => {};
  proto['setAriaDescription'] = () => {};
});

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
];

async function mountSearchableSelect(props: Partial<DsSearchableSelect> = {}): Promise<DsSearchableSelect> {
  return mountWithProps<DsSearchableSelect>('<ds-searchable-select label="Framework"></ds-searchable-select>', {
    options: OPTIONS,
    ...props,
  }, 'ds-searchable-select');
}

function getInput(el: DsSearchableSelect): HTMLInputElement {
  return el.shadowRoot!.querySelector('.search-input')!;
}

function getOption(el: DsSearchableSelect, label: string): HTMLElement {
  const options = el.shadowRoot!.querySelectorAll<HTMLElement>('.option');
  const found = Array.from(options).find(o => o.querySelector('.option-label')?.textContent?.trim() === label);
  if (!found) throw new Error(`Option "${label}" not found in listbox`);
  return found;
}

function clickTrigger(el: DsSearchableSelect): void {
  el.shadowRoot!.querySelector<HTMLElement>('.trigger')!.click();
}

async function openDropdown(el: DsSearchableSelect): Promise<void> {
  clickTrigger(el);
  await el.updateComplete;
}

beforeEach(() => {
  resetTestDom();
});

describe('<ds-searchable-select>', () => {
  describe('opening and closing', () => {
    it('opens on trigger click', async () => {
      const el = await mountSearchableSelect();
      await openDropdown(el);
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('opens on input focus', async () => {
      const el = await mountSearchableSelect();
      getInput(el).dispatchEvent(new Event('focus'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('closes on Escape', async () => {
      const el = await mountSearchableSelect();
      await openDropdown(el);
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('reopens on trigger click when input is already focused', async () => {
      const el = await mountSearchableSelect();
      await openDropdown(el);
      // Select an option to close the dropdown (input stays focused)
      getOption(el, 'React').click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
      // Click trigger again — no focus event fires since input is still focused
      clickTrigger(el);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });
  });

  describe('single selection', () => {
    it('selects option on click, closes dropdown, emits ds-change', async () => {
      const el = await mountSearchableSelect();
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      await openDropdown(el);
      getOption(el, 'Vue').click();
      await el.updateComplete;
      expect(el.value).toBe('vue');
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
      expect(events[0]?.detail).toEqual({ value: 'vue' });
    });

    it('selects focused option on Enter', async () => {
      const el = await mountSearchableSelect();
      await openDropdown(el);
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
      expect(el.value).toBe('vue');
    });

    it('does not select disabled option', async () => {
      const el = await mountSearchableSelect();
      await openDropdown(el);
      getOption(el, 'Angular').click();
      await el.updateComplete;
      expect(el.value).not.toBe('angular');
    });

    it('displays selected label in closed state', async () => {
      const el = await mountSearchableSelect({ value: 'svelte' });
      const input = getInput(el);
      expect(input.value).toBe('Svelte');
    });

    it('preserves selected label in closed state even after options are filtered', async () => {
      const el = await mountSearchableSelect();
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;
      // Simulate consumer filtering options (React is excluded)
      el.options = [{ value: 'vue', label: 'Vue' }, { value: 'svelte', label: 'Svelte' }];
      await el.updateComplete;
      expect(getInput(el).value).toBe('React');
    });
  });

  describe('search', () => {
    it('emits ds-search on every keystroke', async () => {
      const el = await mountSearchableSelect();
      const events: CustomEvent[] = [];
      el.addEventListener('ds-search', (e) => events.push(e as CustomEvent));
      await openDropdown(el);
      const input = getInput(el);
      input.value = 'vu';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      expect(events[0]?.detail).toEqual({ query: 'vu' });
    });

    it('emits ds-search with empty query when dropdown closes', async () => {
      const el = await mountSearchableSelect();
      const queries: string[] = [];
      el.addEventListener('ds-search', (e) => queries.push((e as CustomEvent).detail.query));
      await openDropdown(el);
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;
      expect(queries.at(-1)).toBe('');
    });

    it('emits ds-search with empty query after single selection', async () => {
      const el = await mountSearchableSelect();
      const queries: string[] = [];
      el.addEventListener('ds-search', (e) => queries.push((e as CustomEvent).detail.query));
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;
      expect(queries.at(-1)).toBe('');
    });
  });

  describe('multiple selection', () => {
    it('adds and removes values by clicking options', async () => {
      const el = await mountSearchableSelect({ multiple: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;
      getOption(el, 'Vue').click();
      await el.updateComplete;
      expect(el.values).toEqual(['react', 'vue']);
      getOption(el, 'React').click(); // deselect
      await el.updateComplete;
      expect(el.values).toEqual(['vue']);
      expect(events.at(-1)?.detail).toEqual({ values: ['vue'] });
    });

    it('keeps dropdown open after selecting in multiple mode', async () => {
      const el = await mountSearchableSelect({ multiple: true });
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('renders a tile for each selected value', async () => {
      const el = await mountSearchableSelect({ multiple: true, values: ['react', 'vue'] });
      const tiles = el.shadowRoot!.querySelectorAll('.tile[data-value]');
      expect(tiles).toHaveLength(2);
      expect(tiles[0].querySelector('.tile-label')?.textContent?.trim()).toBe('React');
      expect(tiles[1].querySelector('.tile-label')?.textContent?.trim()).toBe('Vue');
    });

    it('removes a tile when its remove button is clicked', async () => {
      const el = await mountSearchableSelect({ multiple: true, values: ['react', 'vue'] });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      const removeBtn = el.shadowRoot!.querySelector<HTMLElement>('.tile[data-value="react"] .tile-remove')!;
      removeBtn.click();
      await el.updateComplete;
      expect(el.values).toEqual(['vue']);
      expect(events[0]?.detail).toEqual({ values: ['vue'] });
    });

    it('preserves tile labels when options are filtered', async () => {
      const el = await mountSearchableSelect({ multiple: true });
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;
      // Consumer filters out React from the options list
      el.options = [{ value: 'vue', label: 'Vue' }, { value: 'svelte', label: 'Svelte' }];
      await el.updateComplete;
      const tile = el.shadowRoot!.querySelector('.tile[data-value="react"] .tile-label');
      expect(tile?.textContent?.trim()).toBe('React');
    });

    it('emits ds-search with empty query after selecting in multiple mode', async () => {
      const el = await mountSearchableSelect({ multiple: true });
      const queries: string[] = [];
      el.addEventListener('ds-search', (e) => queries.push((e as CustomEvent).detail.query));
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;
      expect(queries.at(-1)).toBe('');
    });
  });

  describe('clearable', () => {
    it('does not show clear button when clearable is false', async () => {
      const el = await mountSearchableSelect({ value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });

    it('does not show clear button when there is nothing to clear', async () => {
      const el = await mountSearchableSelect({ clearable: true });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });

    it('shows clear button when a value is selected', async () => {
      const el = await mountSearchableSelect({ clearable: true, value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('clears single value, resets search, emits ds-search and ds-change on click', async () => {
      const el = await mountSearchableSelect({ clearable: true, value: 'react' });
      const changeEvents: CustomEvent[] = [];
      const searchEvents: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => changeEvents.push(e as CustomEvent));
      el.addEventListener('ds-search', (e) => searchEvents.push(e as CustomEvent));
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.value).toBe('');
      expect(changeEvents[0]?.detail).toEqual({ value: '' });
      expect(searchEvents.at(-1)?.detail).toEqual({ query: '' });
    });

    it('shows clear button in multiple mode when values are selected', async () => {
      const el = await mountSearchableSelect({ clearable: true, multiple: true, values: ['react', 'vue'] });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('clears all values in multiple mode and emits ds-change on click', async () => {
      const el = await mountSearchableSelect({ clearable: true, multiple: true, values: ['react', 'vue'] });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.values).toEqual([]);
      expect(el.value).toBe('');
      expect(events[0]?.detail).toEqual({ values: [] });
    });

    it('does not open the dropdown when clear button is clicked', async () => {
      const el = await mountSearchableSelect({ clearable: true, value: 'react' });
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('Enter on focused clear button clears value without opening the dropdown', async () => {
      const el = await mountSearchableSelect({ clearable: true, value: 'react' });
      const clearBtn = el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!;
      clearBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
      expect(el.value).toBe('');
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('shows clear button when required and a value is selected', async () => {
      const el = await mountSearchableSelect({ required: true, value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('does not show clear button when required but nothing is selected', async () => {
      const el = await mountSearchableSelect({ required: true });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });
  });

  describe('disabled', () => {
    it('does not open when disabled', async () => {
      const el = await mountSearchableSelect({ disabled: true });
      clickTrigger(el);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });
  });
});
