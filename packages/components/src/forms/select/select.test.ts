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
  describe('opening and closing', () => {
    it('opens on trigger click', async () => {
      const el = await mountSelect();
      await openDropdown(el);
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('closes on second trigger click', async () => {
      const el = await mountSelect();
      await openDropdown(el);
      getTrigger(el).click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('opens on ArrowDown key', async () => {
      const el = await mountSelect();
      keydown(getTrigger(el), 'ArrowDown');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('opens on Enter key', async () => {
      const el = await mountSelect();
      keydown(getTrigger(el), 'Enter');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('closes on Escape', async () => {
      const el = await mountSelect();
      await openDropdown(el);
      keydown(getTrigger(el), 'Escape');
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('closes when focus leaves the combobox', async () => {
      const el = await mountSelect();
      await openDropdown(el);
      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).toBeNull();
    });

    it('stays open while the combobox keeps focus', async () => {
      const el = await mountSelect();
      await openDropdown(el);
      getTrigger(el).focus();
      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('exposes a disabled reason as a tooltip and aria description', async () => {
      const el = await mountSelect({
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true, disabledReason: 'Not yet' },
        ],
      });
      await openDropdown(el);
      const option = getOption(el, 'B');
      expect(option.getAttribute('title')).toBe('Not yet');
      expect(option.getAttribute('aria-description')).toBe('Not yet');
    });

    it('renders a hint note above the options when set, and omits it otherwise', async () => {
      const withHint = await mountSelect({ hint: 'Fill all words first' });
      await openDropdown(withHint);
      const note = withHint.shadowRoot!.querySelector('.listbox-hint');
      expect(note?.getAttribute('part')).toBe('hint');
      expect(note?.getAttribute('role')).toBe('note');
      expect(note?.textContent?.trim()).toBe('Fill all words first');
      const listbox = withHint.shadowRoot!.querySelector('.listbox')!;
      expect(listbox.firstElementChild).toBe(note);

      const withoutHint = await mountSelect();
      await openDropdown(withoutHint);
      expect(withoutHint.shadowRoot!.querySelector('.listbox-hint')).toBeNull();
    });
  });

  describe('single selection', () => {
    it('selects option on click, closes dropdown, emits ds-change', async () => {
      const el = await mountSelect();
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
      const el = await mountSelect({ value: 'svelte' });
      const label = el.shadowRoot!.querySelector('.trigger-label');
      expect(label?.textContent?.trim()).toBe('Svelte');
    });

    it('displays placeholder when nothing is selected', async () => {
      const el = await mountSelect({ placeholder: 'Pick one' });
      const label = el.shadowRoot!.querySelector('.trigger-label');
      expect(label?.textContent?.trim()).toBe('Pick one');
    });

    it('selects focused option on Enter', async () => {
      const el = await mountSelect();
      await openDropdown(el);
      keydown(getTrigger(el), 'ArrowDown');
      keydown(getTrigger(el), 'Enter');
      await el.updateComplete;
      expect(el.value).toBe('vue');
    });

    it('does not select disabled option', async () => {
      const el = await mountSelect();
      await openDropdown(el);
      getOption(el, 'Angular').click();
      await el.updateComplete;
      expect(el.value).not.toBe('angular');
    });

    it('navigates options with ArrowDown and ArrowUp', async () => {
      const el = await mountSelect({ value: 'react' });
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
});
