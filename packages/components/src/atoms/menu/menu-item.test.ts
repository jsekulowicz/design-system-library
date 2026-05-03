import { beforeEach, describe, expect, it } from 'vitest';
import type { DsMenuItem } from './menu-item.js';
import './define.js';
import { mount, mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

describe('<ds-menu-item>', () => {
  it('renders all four slots and exposes role=menuitem with tabindex=-1 by default', async () => {
    const el = await mount<DsMenuItem>(`
      <ds-menu-item>
        <span slot="leading">L</span>
        Save
        <span slot="description">Persist changes</span>
        <span slot="trailing">⌘S</span>
      </ds-menu-item>
    `);
    expect(el.getAttribute('role')).toBe('menuitem');
    expect(el.getAttribute('tabindex')).toBe('-1');

    const leading = el.shadowRoot!.querySelector('slot[name="leading"]') as HTMLSlotElement;
    const description = el.shadowRoot!.querySelector('slot[name="description"]') as HTMLSlotElement;
    const trailing = el.shadowRoot!.querySelector('slot[name="trailing"]') as HTMLSlotElement;
    const primary = el.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement;

    expect(leading.assignedElements()[0]?.textContent).toBe('L');
    expect(description.assignedElements()[0]?.textContent).toBe('Persist changes');
    expect(trailing.assignedElements()[0]?.textContent).toBe('⌘S');
    expect(primary.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '').join('').trim()).toBe('Save');
  });

  it('reflects disabled and selected to attributes and ARIA', async () => {
    const el = await mountWithProps<DsMenuItem>('<ds-menu-item>Hi</ds-menu-item>', {
      disabled: true,
      selected: true,
    });
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.hasAttribute('selected')).toBe(true);
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.shadowRoot!.querySelector('[part="check"]')).not.toBeNull();
  });

  it('emits ds-activate with the value on click', async () => {
    const el = await mountWithProps<DsMenuItem>('<ds-menu-item>Save</ds-menu-item>', {
      value: 'save',
    });
    const events: CustomEvent<{ value: string }>[] = [];
    el.addEventListener('ds-activate', (event) => events.push(event as CustomEvent<{ value: string }>));
    el.click();
    expect(events).toHaveLength(1);
    expect(events[0]?.detail.value).toBe('save');
  });

  it('blocks click activation when disabled', async () => {
    const el = await mountWithProps<DsMenuItem>('<ds-menu-item>Save</ds-menu-item>', {
      disabled: true,
      value: 'save',
    });
    const events: Event[] = [];
    el.addEventListener('ds-activate', (event) => events.push(event));
    el.click();
    expect(events).toHaveLength(0);
  });

  it('activates on Enter and Space when focused', async () => {
    const el = await mountWithProps<DsMenuItem>('<ds-menu-item>Save</ds-menu-item>', {
      value: 'save',
    });
    const events: CustomEvent<{ value: string }>[] = [];
    el.addEventListener('ds-activate', (event) => events.push(event as CustomEvent<{ value: string }>));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(events).toHaveLength(2);
  });

  it('does not activate on Enter when disabled', async () => {
    const el = await mountWithProps<DsMenuItem>('<ds-menu-item>Save</ds-menu-item>', {
      disabled: true,
    });
    const events: Event[] = [];
    el.addEventListener('ds-activate', (event) => events.push(event));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(events).toHaveLength(0);
  });

  it('exposes primaryText for type-ahead consumers', async () => {
    const el = await mount<DsMenuItem>(`
      <ds-menu-item>
        Save As
        <span slot="description">…</span>
      </ds-menu-item>
    `);
    expect(el.primaryText).toBe('Save As');
  });
});
