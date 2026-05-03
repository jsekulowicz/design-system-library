import { beforeEach, describe, expect, it } from 'vitest';
import { DsSelectOption } from './select-option.js';
import { mount, mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

if (!customElements.get('ds-select-option')) {
  customElements.define('ds-select-option', DsSelectOption);
}

describe('<ds-select-option>', () => {
  it('renders all four slots and exposes role=option', async () => {
    const el = await mount<DsSelectOption>(`
      <ds-select-option>
        <span slot="leading">L</span>
        Apple
        <span slot="description">a fruit</span>
        <span slot="trailing">⌘1</span>
      </ds-select-option>
    `);
    expect(el.getAttribute('role')).toBe('option');
    const leading = el.shadowRoot!.querySelector('slot[name="leading"]') as HTMLSlotElement;
    const description = el.shadowRoot!.querySelector('slot[name="description"]') as HTMLSlotElement;
    const trailing = el.shadowRoot!.querySelector('slot[name="trailing"]') as HTMLSlotElement;
    const primary = el.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement;

    expect(leading.assignedElements()[0]?.textContent).toBe('L');
    expect(description.assignedElements()[0]?.textContent).toBe('a fruit');
    expect(trailing.assignedElements()[0]?.textContent).toBe('⌘1');
    expect(
      primary
        .assignedNodes({ flatten: true })
        .map((n) => n.textContent ?? '')
        .join('')
        .trim(),
    ).toBe('Apple');
  });

  it('reflects selected and disabled to ARIA attributes', async () => {
    const el = await mountWithProps<DsSelectOption>(
      '<ds-select-option>X</ds-select-option>',
      { selected: true, disabled: true },
    );
    expect(el.getAttribute('aria-selected')).toBe('true');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.hasAttribute('selected')).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('renders the check icon only when selected', async () => {
    const off = await mount<DsSelectOption>('<ds-select-option>X</ds-select-option>');
    expect(off.shadowRoot!.querySelector('[part="check"]')).toBeNull();
    const on = await mountWithProps<DsSelectOption>(
      '<ds-select-option>X</ds-select-option>',
      { selected: true },
    );
    expect(on.shadowRoot!.querySelector('[part="check"]')).not.toBeNull();
  });

  it('emits ds-activate with the value on click', async () => {
    const el = await mountWithProps<DsSelectOption>(
      '<ds-select-option>X</ds-select-option>',
      { value: 'apple' },
    );
    const events: CustomEvent<{ value: string }>[] = [];
    el.addEventListener('ds-activate', (event) =>
      events.push(event as CustomEvent<{ value: string }>),
    );
    el.click();
    expect(events).toHaveLength(1);
    expect(events[0]?.detail.value).toBe('apple');
  });

  it('blocks activation when disabled', async () => {
    const el = await mountWithProps<DsSelectOption>(
      '<ds-select-option>X</ds-select-option>',
      { disabled: true, value: 'apple' },
    );
    const events: Event[] = [];
    el.addEventListener('ds-activate', (event) => events.push(event));
    el.click();
    expect(events).toHaveLength(0);
  });

  it('round-trips the id attribute (used by aria-activedescendant)', async () => {
    const el = await mount<DsSelectOption>(
      '<ds-select-option id="option-7">X</ds-select-option>',
    );
    expect(el.id).toBe('option-7');
  });

  it('reflects active to attribute (drives keyboard highlight without DOM focus)', async () => {
    const el = await mountWithProps<DsSelectOption>(
      '<ds-select-option>X</ds-select-option>',
      { active: true },
    );
    expect(el.hasAttribute('active')).toBe(true);
  });
});
