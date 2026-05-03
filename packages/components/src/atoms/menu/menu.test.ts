import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DsMenu } from './menu.js';
import type { DsMenuItem } from './menu-item.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

const TEMPLATE = `
  <ds-menu label="Actions">
    <ds-menu-item value="save">Save</ds-menu-item>
    <ds-menu-item value="save-as">Save As</ds-menu-item>
    <ds-menu-item value="open" disabled>Open</ds-menu-item>
    <ds-menu-item value="close">Close</ds-menu-item>
  </ds-menu>
`;

function getItems(host: DsMenu): DsMenuItem[] {
  return Array.from(host.querySelectorAll<DsMenuItem>('ds-menu-item'));
}

function getMenuRegion(host: DsMenu): HTMLElement {
  return host.shadowRoot!.querySelector('[role="menu"]') as HTMLElement;
}

describe('<ds-menu>', () => {
  it('exposes role=menu with aria-orientation and aria-label on the inner region', async () => {
    const el = await mount<DsMenu>(TEMPLATE);
    const region = getMenuRegion(el);
    expect(region.getAttribute('role')).toBe('menu');
    expect(region.getAttribute('aria-orientation')).toBe('vertical');
    expect(region.getAttribute('aria-label')).toBe('Actions');
  });

  it('seeds roving tabindex: first enabled item is tabindex=0, others are -1', async () => {
    const el = await mount<DsMenu>(TEMPLATE);
    await el.updateComplete;
    const items = getItems(el);
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');
    expect(items[3]?.getAttribute('tabindex')).toBe('-1');
  });

  it('ArrowDown / ArrowUp move focus, skipping disabled and wrapping', async () => {
    const el = await mount<DsMenu>(TEMPLATE);
    await el.updateComplete;
    const items = getItems(el);
    const region = getMenuRegion(el);

    items[0]?.focus();
    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[1]);

    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[3]);

    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[0]);

    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(items[3]);
  });

  it('Home / End jump to first / last enabled', async () => {
    const el = await mount<DsMenu>(TEMPLATE);
    await el.updateComplete;
    const items = getItems(el);
    const region = getMenuRegion(el);

    items[1]?.focus();
    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(items[3]);

    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it('emits ds-select when an item is activated', async () => {
    const el = await mount<DsMenu>(TEMPLATE);
    await el.updateComplete;
    const items = getItems(el);
    const events: CustomEvent<{ value: string }>[] = [];
    el.addEventListener('ds-select', (event) =>
      events.push(event as CustomEvent<{ value: string }>),
    );
    items[1]?.click();
    expect(events).toHaveLength(1);
    expect(events[0]?.detail.value).toBe('save-as');
  });

  it('does not stop Escape from bubbling so a host popover can close', async () => {
    const el = await mount<DsMenu>(TEMPLATE);
    await el.updateComplete;
    const items = getItems(el);
    items[0]?.focus();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    let bubbled = false;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') bubbled = true;
    });
    items[0]?.dispatchEvent(event);
    expect(bubbled).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });

  it('updates roving tabindex when focus moves between items', async () => {
    const el = await mount<DsMenu>(TEMPLATE);
    await el.updateComplete;
    const items = getItems(el);
    items[3]?.focus();
    await el.updateComplete;
    expect(items[0]?.getAttribute('tabindex')).toBe('-1');
    expect(items[3]?.getAttribute('tabindex')).toBe('0');
  });

  it('renders header and footer slots, hidden when empty', async () => {
    const el = await mount<DsMenu>(`
      <ds-menu label="View">
        <span slot="header">Group</span>
        <ds-menu-item>One</ds-menu-item>
        <span slot="footer">Manage…</span>
      </ds-menu>
    `);
    await el.updateComplete;
    const header = el.shadowRoot!.querySelector('.header') as HTMLElement;
    const footer = el.shadowRoot!.querySelector('.footer') as HTMLElement;
    expect(header.hidden).toBe(false);
    expect(footer.hidden).toBe(false);

    const empty = await mount<DsMenu>(
      '<ds-menu label="X"><ds-menu-item>One</ds-menu-item></ds-menu>',
    );
    await empty.updateComplete;
    expect((empty.shadowRoot!.querySelector('.header') as HTMLElement).hidden).toBe(true);
    expect((empty.shadowRoot!.querySelector('.footer') as HTMLElement).hidden).toBe(true);
  });

  describe('type-ahead', () => {
    it('accumulates a buffer to disambiguate items with shared prefixes', async () => {
      const el = await mount<DsMenu>(`
        <ds-menu label="Fruit">
          <ds-menu-item>Apple</ds-menu-item>
          <ds-menu-item>Apricot</ds-menu-item>
          <ds-menu-item>Banana</ds-menu-item>
        </ds-menu>
      `);
      await el.updateComplete;
      const items = getItems(el);
      const region = getMenuRegion(el);

      items[2]?.focus();
      region.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(document.activeElement).toBe(items[0]);

      region.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));
      expect(document.activeElement).toBe(items[0]);

      region.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }));
      expect(document.activeElement).toBe(items[1]);
    });

    it('resets the buffer after the timeout', async () => {
      vi.useFakeTimers();
      try {
        const el = await mount<DsMenu>(`
          <ds-menu label="Files">
            <ds-menu-item>Apple</ds-menu-item>
            <ds-menu-item>Banana</ds-menu-item>
          </ds-menu>
        `);
        await el.updateComplete;
        const items = getItems(el);
        const region = getMenuRegion(el);

        items[0]?.focus();
        region.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
        expect(document.activeElement).toBe(items[1]);

        vi.advanceTimersByTime(600);

        region.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
      } finally {
        vi.useRealTimers();
      }
    });

    it('is case-insensitive and matches start-of-primary text only', async () => {
      const el = await mount<DsMenu>(`
        <ds-menu label="Files">
          <ds-menu-item>apricot<span slot="description">a fruit</span></ds-menu-item>
          <ds-menu-item>Berry</ds-menu-item>
          <ds-menu-item>Cherry</ds-menu-item>
        </ds-menu>
      `);
      await el.updateComplete;
      const items = getItems(el);
      const region = getMenuRegion(el);

      items[1]?.focus();
      region.dispatchEvent(new KeyboardEvent('keydown', { key: 'A', bubbles: true }));
      expect(document.activeElement).toBe(items[0]);
    });
  });
});
