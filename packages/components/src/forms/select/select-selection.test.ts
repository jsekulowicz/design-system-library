import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSelect } from './select.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

// jsdom 25 does not implement ElementInternals ARIA reflection (ariaLabel, ariaDescription).
// Stub them so tests focus on component behavior, not platform internals.
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

async function mountSelect(props: Partial<DsSelect> = {}): Promise<DsSelect> {
  return mountWithProps<DsSelect>(
    '<ds-select label="Framework"></ds-select>',
    {
      options: OPTIONS,
      ...props,
    },
    'ds-select',
  );
}

function getTrigger(el: DsSelect): HTMLElement {
  return el.shadowRoot!.querySelector('.trigger')!;
}

function getOption(el: DsSelect, label: string): HTMLElement {
  const options = el.shadowRoot!.querySelectorAll<HTMLElement>('ds-select-option');
  const found = Array.from(options).find((o) => (o.textContent ?? '').trim() === label);
  if (!found) {
    throw new Error(`Option "${label}" not found in listbox`);
  }
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
  resetTestDom();
});

describe('<ds-select>', () => {
  describe('multiple selection', () => {
    it('adds and removes values by clicking options', async () => {
      const el = await mountSelect({ multiple: true });
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
      const el = await mountSelect({ multiple: true });
      await openDropdown(el);
      getOption(el, 'React').click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('renders a tile for each selected value', async () => {
      const el = await mountSelect({ multiple: true, values: ['react', 'vue'] });
      const tiles = el.shadowRoot!.querySelectorAll('.tile[data-value]');
      expect(tiles).toHaveLength(2);
      expect(tiles[0].querySelector('.tile-label')?.textContent?.trim()).toBe('React');
      expect(tiles[1].querySelector('.tile-label')?.textContent?.trim()).toBe('Vue');
    });

    it('removes a tile when its remove button is clicked', async () => {
      const el = await mountSelect({ multiple: true, values: ['react', 'vue'] });
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
      const el = await mountSelect({ value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });

    it('does not show clear button when there is nothing to clear', async () => {
      const el = await mountSelect({ clearable: true });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });

    it('shows clear button when a value is selected', async () => {
      const el = await mountSelect({ clearable: true, value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('clears single value and emits ds-change on click', async () => {
      const el = await mountSelect({ clearable: true, value: 'react' });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.value).toBe('');
      expect(events[0]?.detail).toEqual({ value: '' });
    });

    it('re-renders after clearing - clear button disappears and placeholder shows', async () => {
      const el = await mountSelect({ clearable: true, value: 'react', placeholder: 'Pick one' });
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
      expect(el.shadowRoot!.querySelector('.trigger-label')?.textContent?.trim()).toBe('Pick one');
    });

    it('shows clear button in multiple mode when values are selected', async () => {
      const el = await mountSelect({ clearable: true, multiple: true, values: ['react', 'vue'] });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('clears all values in multiple mode and emits ds-change on click', async () => {
      const el = await mountSelect({ clearable: true, multiple: true, values: ['react', 'vue'] });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-change', (e) => events.push(e as CustomEvent));
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.values).toEqual([]);
      expect(el.value).toBe('');
      expect(events[0]?.detail).toEqual({ values: [] });
    });

    it('does not toggle the dropdown when clear button is clicked', async () => {
      const el = await mountSelect({ clearable: true, value: 'react' });
      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('Enter on focused clear button clears value without opening the dropdown', async () => {
      const el = await mountSelect({ clearable: true });
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

    it('shows clear button when clearable and a value is selected', async () => {
      const el = await mountSelect({ clearable: true, value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).not.toBeNull();
    });

    it('does not show clear button when clearable but nothing is selected', async () => {
      const el = await mountSelect({ clearable: true });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });

    it('does not show clear button for a required select', async () => {
      const el = await mountSelect({ required: true, value: 'react' });
      expect(el.shadowRoot!.querySelector('.clear-btn')).toBeNull();
    });
  });

  describe('disabled', () => {
    it('keeps the trigger focusable and announces its state', async () => {
      const el = await mountSelect({ disabled: true });
      const trigger = getTrigger(el);

      expect(trigger.getAttribute('tabindex')).toBe('0');
      expect(trigger.getAttribute('aria-disabled')).toBe('true');
      trigger.focus();
      expect(el.shadowRoot!.activeElement).toBe(trigger);
    });

    it('does not open on trigger click', async () => {
      const el = await mountSelect({ disabled: true });
      getTrigger(el).click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('does not open on keyboard', async () => {
      const el = await mountSelect({ disabled: true });
      keydown(getTrigger(el), 'ArrowDown');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });
  });

  describe('projected option content', () => {
    async function mountWithSlots(props: Partial<DsSelect> = {}): Promise<DsSelect> {
      return mountWithProps<DsSelect>(
        `<ds-select label="Framework">
          <b slot="option:react">React!</b>
          <i slot="selected:react">Reacting</i>
          <em slot="tile:react">Tiled</em>
        </ds-select>`,
        { options: OPTIONS, ...props },
        'ds-select',
      );
    }

    function assignedTo(el: DsSelect, name: string): Element[] {
      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${name}"]`);
      return slot ? slot.assignedElements() : [];
    }

    it('projects a light-DOM node into its option', async () => {
      const el = await mountWithSlots();
      await openDropdown(el);
      expect(assignedTo(el, 'option:react')[0]?.textContent).toBe('React!');
    });

    it('falls back to the label for options with nothing slotted', async () => {
      const el = await mountWithSlots();
      await openDropdown(el);
      expect(assignedTo(el, 'option:vue')).toHaveLength(0);
      expect(getOption(el, 'Vue')).not.toBeNull();
    });

    it('keeps the option label as the accessible name', async () => {
      const el = await mountWithSlots();
      await openDropdown(el);
      const option = el.shadowRoot!.querySelector('ds-select-option')!;
      expect(option.getAttribute('aria-label')).toBe('React');
    });

    it('projects into the trigger once selected', async () => {
      const el = await mountWithSlots({ value: 'react' });
      expect(assignedTo(el, 'selected:react')[0]?.textContent).toBe('Reacting');
    });

    it('projects into the selected tile when multiple', async () => {
      const el = await mountWithSlots({ multiple: true, values: ['react'] });
      expect(assignedTo(el, 'tile:react')[0]?.textContent).toBe('Tiled');
    });
  });
});
