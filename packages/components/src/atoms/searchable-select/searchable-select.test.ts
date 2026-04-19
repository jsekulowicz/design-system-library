import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSearchableSelect } from './searchable-select.js';
import './define.js';

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

async function mount(props: Partial<DsSearchableSelect> = {}): Promise<DsSearchableSelect> {
  document.body.innerHTML = '<ds-searchable-select label="Framework"></ds-searchable-select>';
  const el = document.querySelector('ds-searchable-select') as DsSearchableSelect;
  Object.assign(el, { options: OPTIONS, ...props });
  await el.updateComplete;
  return el;
}

function getInput(el: DsSearchableSelect): HTMLInputElement {
  return el.shadowRoot!.querySelector('.search-input')!;
}

function getOptions(el: DsSearchableSelect): NodeListOf<HTMLElement> {
  return el.shadowRoot!.querySelectorAll('.option');
}

function clickTrigger(el: DsSearchableSelect): void {
  el.shadowRoot!.querySelector<HTMLElement>('.trigger')!.click();
}

async function openDropdown(el: DsSearchableSelect): Promise<void> {
  clickTrigger(el);
  await el.updateComplete;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('<ds-searchable-select>', () => {
  describe('opening and closing', () => {
    it('opens on trigger click', async () => {
      const el = await mount();
      await openDropdown(el);
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('opens on input focus', async () => {
      const el = await mount();
      getInput(el).dispatchEvent(new Event('focus'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('closes on Escape', async () => {
      const el = await mount();
      await openDropdown(el);
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('reopens on trigger click when input is already focused', async () => {
      const el = await mount();
      await openDropdown(el);
      // Select an option to close the dropdown (input stays focused)
      getOptions(el)[0].click();
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
      const el = await mount();
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      await openDropdown(el);
      getOptions(el)[1].click(); // Vue
      await el.updateComplete;
      expect(el.value).toBe('vue');
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
      expect(events[0]?.detail).toEqual({ value: 'vue' });
    });

    it('selects focused option on Enter', async () => {
      const el = await mount();
      await openDropdown(el);
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
      expect(el.value).toBe('vue');
    });

    it('does not select disabled option', async () => {
      const el = await mount();
      await openDropdown(el);
      const angular = getOptions(el)[3];
      angular.click();
      await el.updateComplete;
      expect(el.value).not.toBe('angular');
    });

    it('displays selected label in closed state', async () => {
      const el = await mount({ value: 'svelte' });
      const input = getInput(el);
      expect(input.value).toBe('Svelte');
    });

    it('preserves selected label in closed state even after options are filtered', async () => {
      const el = await mount();
      await openDropdown(el);
      getOptions(el)[0].click(); // React
      await el.updateComplete;
      // Simulate consumer filtering options (React is excluded)
      el.options = [{ value: 'vue', label: 'Vue' }, { value: 'svelte', label: 'Svelte' }];
      await el.updateComplete;
      expect(getInput(el).value).toBe('React');
    });
  });

  describe('search', () => {
    it('emits ds-search on every keystroke', async () => {
      const el = await mount();
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
      const el = await mount();
      const queries: string[] = [];
      el.addEventListener('ds-search', (e) => queries.push((e as CustomEvent).detail.query));
      await openDropdown(el);
      getInput(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;
      expect(queries.at(-1)).toBe('');
    });

    it('emits ds-search with empty query after single selection', async () => {
      const el = await mount();
      const queries: string[] = [];
      el.addEventListener('ds-search', (e) => queries.push((e as CustomEvent).detail.query));
      await openDropdown(el);
      getOptions(el)[0].click();
      await el.updateComplete;
      expect(queries.at(-1)).toBe('');
    });
  });

  describe('multiple selection', () => {
    it('adds and removes values by clicking options', async () => {
      const el = await mount({ multiple: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      await openDropdown(el);
      getOptions(el)[0].click(); // React
      await el.updateComplete;
      getOptions(el)[1].click(); // Vue
      await el.updateComplete;
      expect(el.values).toEqual(['react', 'vue']);
      getOptions(el)[0].click(); // deselect React
      await el.updateComplete;
      expect(el.values).toEqual(['vue']);
      expect(events.at(-1)?.detail).toEqual({ values: ['vue'] });
    });

    it('keeps dropdown open after selecting in multiple mode', async () => {
      const el = await mount({ multiple: true });
      await openDropdown(el);
      getOptions(el)[0].click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('renders a tile for each selected value', async () => {
      const el = await mount({ multiple: true, values: ['react', 'vue'] });
      const tiles = el.shadowRoot!.querySelectorAll('.tile[data-value]');
      expect(tiles).toHaveLength(2);
      expect(tiles[0].querySelector('.tile-label')?.textContent?.trim()).toBe('React');
      expect(tiles[1].querySelector('.tile-label')?.textContent?.trim()).toBe('Vue');
    });

    it('removes a tile when its remove button is clicked', async () => {
      const el = await mount({ multiple: true, values: ['react', 'vue'] });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      const removeBtn = el.shadowRoot!.querySelector<HTMLElement>('.tile[data-value="react"] .tile-remove')!;
      removeBtn.click();
      await el.updateComplete;
      expect(el.values).toEqual(['vue']);
      expect(events[0]?.detail).toEqual({ values: ['vue'] });
    });

    it('preserves tile labels when options are filtered', async () => {
      const el = await mount({ multiple: true });
      await openDropdown(el);
      getOptions(el)[0].click(); // React
      await el.updateComplete;
      // Consumer filters out React from the options list
      el.options = [{ value: 'vue', label: 'Vue' }, { value: 'svelte', label: 'Svelte' }];
      await el.updateComplete;
      const tile = el.shadowRoot!.querySelector('.tile[data-value="react"] .tile-label');
      expect(tile?.textContent?.trim()).toBe('React');
    });

    it('emits ds-search with empty query after selecting in multiple mode', async () => {
      const el = await mount({ multiple: true });
      const queries: string[] = [];
      el.addEventListener('ds-search', (e) => queries.push((e as CustomEvent).detail.query));
      await openDropdown(el);
      getOptions(el)[0].click();
      await el.updateComplete;
      expect(queries.at(-1)).toBe('');
    });
  });

  describe('disabled', () => {
    it('does not open when disabled', async () => {
      const el = await mount({ disabled: true });
      clickTrigger(el);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });
  });
});
