import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSelect } from './select.js';
import './define.js';

// jsdom 25 does not implement ElementInternals ARIA reflection (ariaLabel, ariaDescription).
// Stub them so tests focus on component behaviour, not platform internals.
beforeAll(() => {
  const proto = DsSelect.prototype as unknown as Record<string, () => void>;
  proto['setAriaLabel'] = () => {};
  proto['setAriaDescription'] = () => {};
});

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
];

async function mount(props: Partial<DsSelect> = {}): Promise<DsSelect> {
  document.body.innerHTML = '<ds-select label="Framework"></ds-select>';
  const el = document.querySelector('ds-select') as DsSelect;
  Object.assign(el, { options: OPTIONS, ...props });
  await el.updateComplete;
  return el;
}

function getTrigger(el: DsSelect): HTMLElement {
  return el.shadowRoot!.querySelector('.trigger')!;
}

function getOption(el: DsSelect, label: string): HTMLElement {
  const options = el.shadowRoot!.querySelectorAll<HTMLElement>('.option');
  const found = Array.from(options).find(o => o.querySelector('.option-label')?.textContent?.trim() === label);
  if (!found) throw new Error(`Option "${label}" not found in listbox`);
  return found;
}

function keydown(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

async function openDropdown(el: DsSelect): Promise<void> {
  getTrigger(el).click();
  await el.updateComplete;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('<ds-select>', () => {
  describe('opening and closing', () => {
    it('opens on trigger click', async () => {
      const el = await mount();
      await openDropdown(el);
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('closes on second trigger click', async () => {
      const el = await mount();
      await openDropdown(el);
      getTrigger(el).click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('opens on ArrowDown key', async () => {
      const el = await mount();
      keydown(getTrigger(el), 'ArrowDown');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('opens on Enter key', async () => {
      const el = await mount();
      keydown(getTrigger(el), 'Enter');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('closes on Escape', async () => {
      const el = await mount();
      await openDropdown(el);
      keydown(getTrigger(el), 'Escape');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });
  });

  describe('single selection', () => {
    it('selects option on click, closes dropdown, emits ds-change', async () => {
      const el = await mount();
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      await openDropdown(el);
      getOption(el, 'Vue').click();
      await el.updateComplete;
      expect(el.value).toBe('vue');
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
      expect(events[0]?.detail).toEqual({ value: 'vue' });
    });

    it('displays the selected label in the trigger', async () => {
      const el = await mount({ value: 'svelte' });
      const label = el.shadowRoot!.querySelector('.trigger-label');
      expect(label?.textContent?.trim()).toBe('Svelte');
    });

    it('displays placeholder when nothing is selected', async () => {
      const el = await mount({ placeholder: 'Pick one' });
      const label = el.shadowRoot!.querySelector('.trigger-label');
      expect(label?.textContent?.trim()).toBe('Pick one');
    });

    it('selects focused option on Enter', async () => {
      const el = await mount();
      await openDropdown(el);
      keydown(getTrigger(el), 'ArrowDown');
      keydown(getTrigger(el), 'Enter');
      await el.updateComplete;
      expect(el.value).toBe('vue');
    });

    it('does not select disabled option', async () => {
      const el = await mount();
      await openDropdown(el);
      getOption(el, 'Angular').click();
      await el.updateComplete;
      expect(el.value).not.toBe('angular');
    });

    it('navigates options with ArrowDown and ArrowUp', async () => {
      const el = await mount({ value: 'react' });
      await openDropdown(el);
      keydown(getTrigger(el), 'ArrowDown');
      keydown(getTrigger(el), 'Enter');
      await el.updateComplete;
      expect(el.value).toBe('vue');

      await openDropdown(el);
      keydown(getTrigger(el), 'ArrowUp');
      keydown(getTrigger(el), 'Enter');
      await el.updateComplete;
      expect(el.value).toBe('react');
    });
  });

  describe('multiple selection', () => {
    it('adds and removes values by clicking options', async () => {
      const el = await mount({ multiple: true });
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
      const el = await mount({ multiple: true });
      await openDropdown(el);
      getOption(el, 'React').click();
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
      el.shadowRoot!.querySelector<HTMLElement>('.tile[data-value="react"] .tile-remove')!.click();
      await el.updateComplete;
      expect(el.values).toEqual(['vue']);
      expect(events[0]?.detail).toEqual({ values: ['vue'] });
    });
  });

  describe('clearable', () => {
    it('does not show clear button when clearable is false', async () => {
      const el = await mount({ value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });

    it('does not show clear button when there is nothing to clear', async () => {
      const el = await mount({ clearable: true });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });

    it('shows clear button when a value is selected', async () => {
      const el = await mount({ clearable: true, value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('clears single value and emits ds-change on click', async () => {
      const el = await mount({ clearable: true, value: 'react' });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.value).toBe('');
      expect(events[0]?.detail).toEqual({ value: '' });
    });

    it('re-renders after clearing — clear button disappears and placeholder shows', async () => {
      const el = await mount({ clearable: true, value: 'react', placeholder: 'Pick one' });
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
      expect(el.shadowRoot!.querySelector('.trigger-label')?.textContent?.trim()).toBe('Pick one');
    });

    it('shows clear button in multiple mode when values are selected', async () => {
      const el = await mount({ clearable: true, multiple: true, values: ['react', 'vue'] });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('clears all values in multiple mode and emits ds-change on click', async () => {
      const el = await mount({ clearable: true, multiple: true, values: ['react', 'vue'] });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.values).toEqual([]);
      expect(el.value).toBe('');
      expect(events[0]?.detail).toEqual({ values: [] });
    });

    it('does not toggle the dropdown when clear button is clicked', async () => {
      const el = await mount({ clearable: true, value: 'react' });
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('Enter on focused clear button clears value without opening the dropdown', async () => {
      const el = await mount({ clearable: true });
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;

      const clearBtn = el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!;
      clearBtn.focus();

      clearBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
      expect(el.value).toBe('');
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('shows clear button when required and a value is selected', async () => {
      const el = await mount({ required: true, value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('does not show clear button when required but nothing is selected', async () => {
      const el = await mount({ required: true });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });
  });

  describe('disabled', () => {
    it('does not open on trigger click', async () => {
      const el = await mount({ disabled: true });
      getTrigger(el).click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('does not open on keyboard', async () => {
      const el = await mount({ disabled: true });
      keydown(getTrigger(el), 'ArrowDown');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });
  });
});
