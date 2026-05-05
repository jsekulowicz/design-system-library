import { beforeEach, describe, expect, it } from 'vitest';
import type { DsMenuButton } from './menu-button.js';
import type { DsMenuItem } from '../../atoms/menu/menu-item.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

const TEMPLATE = `
  <ds-menu-button label="Actions">
    <ds-menu-item value="duplicate">Duplicate</ds-menu-item>
    <ds-menu-item value="rename">Rename</ds-menu-item>
    <ds-menu-item value="delete">Delete</ds-menu-item>
  </ds-menu-button>
`;

function getDefaultTrigger(host: DsMenuButton): HTMLElement {
  return host.shadowRoot!.querySelector('#trigger') as HTMLElement;
}

function clickDefaultTrigger(host: DsMenuButton): void {
  getDefaultTrigger(host).shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
}

function getPanel(host: DsMenuButton): HTMLElement | null {
  return host.shadowRoot!.querySelector('#panel');
}

function getItems(host: DsMenuButton): DsMenuItem[] {
  return Array.from(host.querySelectorAll<DsMenuItem>('ds-menu-item'));
}

describe('<ds-menu-button>', () => {
  it('renders a default trigger with menu-button ARIA wired up', async () => {
    const el = await mount<DsMenuButton>(TEMPLATE);
    const trigger = getDefaultTrigger(el);
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(getPanel(el)).toBeNull();
  });

  it('opens on trigger click and closes on second click', async () => {
    const el = await mount<DsMenuButton>(TEMPLATE);
    clickDefaultTrigger(el);
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(getPanel(el)).not.toBeNull();
    expect(getDefaultTrigger(el).getAttribute('aria-expanded')).toBe('true');

    clickDefaultTrigger(el);
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(getPanel(el)).toBeNull();
  });

  it('ArrowDown on trigger opens and focuses the first enabled item', async () => {
    const el = await mount<DsMenuButton>(`
      <ds-menu-button label="Edit">
        <ds-menu-item value="undo" disabled>Undo</ds-menu-item>
        <ds-menu-item value="redo">Redo</ds-menu-item>
        <ds-menu-item value="cut">Cut</ds-menu-item>
      </ds-menu-button>
    `);
    const trigger = getDefaultTrigger(el);
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await el.updateComplete;
    await el.updateComplete;
    const items = getItems(el);
    expect(el.open).toBe(true);
    expect(document.activeElement).toBe(items[1]);
  });

  it('Escape on the panel closes the menu and returns focus to the trigger', async () => {
    const el = await mount<DsMenuButton>(TEMPLATE);
    clickDefaultTrigger(el);
    await el.updateComplete;
    const panel = getPanel(el)!;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(getDefaultTrigger(el));
  });

  it('selecting a menu item closes the menu and re-emits ds-select', async () => {
    const el = await mount<DsMenuButton>(TEMPLATE);
    const events: CustomEvent<{ value: string }>[] = [];
    el.addEventListener('ds-select', (event) => events.push(event as CustomEvent<{ value: string }>));
    clickDefaultTrigger(el);
    await el.updateComplete;
    getItems(el)[1]?.click();
    await el.updateComplete;
    expect(events).toHaveLength(1);
    expect(events[0]?.detail.value).toBe('rename');
    expect(el.open).toBe(false);
  });

  it('a click outside the host closes the menu', async () => {
    const el = await mount<DsMenuButton>(TEMPLATE);
    clickDefaultTrigger(el);
    await el.updateComplete;
    expect(el.open).toBe(true);
    document.body.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('does not open when disabled', async () => {
    const el = await mount<DsMenuButton>(
      '<ds-menu-button label="Off" disabled><ds-menu-item value="x">X</ds-menu-item></ds-menu-button>',
    );
    clickDefaultTrigger(el);
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('emits ds-open and ds-close lifecycle events', async () => {
    const el = await mount<DsMenuButton>(TEMPLATE);
    const seen: string[] = [];
    el.addEventListener('ds-open', () => seen.push('open'));
    el.addEventListener('ds-close', () => seen.push('close'));
    clickDefaultTrigger(el);
    await el.updateComplete;
    clickDefaultTrigger(el);
    await el.updateComplete;
    expect(seen).toEqual(['open', 'close']);
  });

  it('opens via external `open` property and reflects the attribute', async () => {
    const el = await mount<DsMenuButton>(TEMPLATE);
    el.open = true;
    await el.updateComplete;
    expect(getPanel(el)).not.toBeNull();
    expect(el.hasAttribute('open')).toBe(true);
    el.open = false;
    await el.updateComplete;
    expect(getPanel(el)).toBeNull();
  });

  it('uses a slotted trigger and wires its ARIA attributes', async () => {
    const el = await mount<DsMenuButton>(`
      <ds-menu-button>
        <button slot="trigger" type="button" id="custom">Open</button>
        <ds-menu-item value="a">A</ds-menu-item>
        <ds-menu-item value="b">B</ds-menu-item>
      </ds-menu-button>
    `);
    await el.updateComplete;
    const custom = el.querySelector<HTMLButtonElement>('#custom')!;
    expect(custom.getAttribute('aria-haspopup')).toBe('menu');
    expect(custom.getAttribute('aria-expanded')).toBe('false');

    custom.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(custom.getAttribute('aria-expanded')).toBe('true');
    expect(custom.getAttribute('aria-controls')).toBe('panel');
  });
});
