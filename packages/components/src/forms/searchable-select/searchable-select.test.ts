import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSearchableSelect } from './searchable-select.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

// jsdom 25 does not implement ElementInternals ARIA reflection (ariaLabel, ariaDescription).
// Stub them so tests focus on component behavior, not platform internals.
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
  return mountWithProps<DsSearchableSelect>(
    '<ds-searchable-select label="Framework"></ds-searchable-select>',
    {
      options: OPTIONS,
      ...props,
    },
    'ds-searchable-select',
  );
}

function getInput(el: DsSearchableSelect): HTMLInputElement {
  return el.shadowRoot!.querySelector('.search-input')!;
}

function getOption(el: DsSearchableSelect, label: string): HTMLElement {
  const options = el.shadowRoot!.querySelectorAll<HTMLElement>('ds-select-option');
  const found = Array.from(options).find((o) => (o.textContent ?? '').trim() === label);
  if (!found) {
    throw new Error(`Option "${label}" not found in listbox`);
  }
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
      // Click trigger again - no focus event fires since input is still focused
      clickTrigger(el);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.listbox')).not.toBeNull();
    });

    it('renders a hint note above the options when set, and omits it otherwise', async () => {
      const withHint = await mountSearchableSelect({ hint: 'Only verified items can be picked' });
      await openDropdown(withHint);
      const note = withHint.shadowRoot!.querySelector('.listbox-hint');
      expect(note?.getAttribute('part')).toBe('hint');
      expect(note?.getAttribute('role')).toBe('note');
      expect(note?.textContent?.trim()).toBe('Only verified items can be picked');
      expect(withHint.shadowRoot!.querySelector('.listbox')!.firstElementChild).toBe(note);

      const withoutHint = await mountSearchableSelect();
      await openDropdown(withoutHint);
      expect(withoutHint.shadowRoot!.querySelector('.listbox-hint')).toBeNull();
    });
  });

  describe('validity', () => {
    it('leaves a required empty select alone until it is touched', async () => {
      const el = await mountSearchableSelect({ required: true });
      await el.updateComplete;

      expect(el.invalid).toBe(false);
    });

    it('reveals the error when the form asks it to', async () => {
      const el = await mountSearchableSelect({ required: true });
      el.showValidity();
      await el.updateComplete;

      expect(el.invalid).toBe(true);
    });

    it('clears the error once an option is chosen', async () => {
      const el = await mountSearchableSelect({ required: true });
      el.showValidity();
      await el.updateComplete;

      await openDropdown(el);
      getOption(el, 'Vue').click();
      await el.updateComplete;

      expect(el.invalid).toBe(false);
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
      el.options = [
        { value: 'vue', label: 'Vue' },
        { value: 'svelte', label: 'Svelte' },
      ];
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
});
