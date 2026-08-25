import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsTab } from './tab.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-tab')) {
    customElements.define('ds-tab', DsTab);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-tab>', () => {
  it('sets tab semantics and reflects selected and disabled aria attributes', async () => {
    const el = await mount<DsTab>('<ds-tab value="overview">Overview</ds-tab>');
    expect(el.getAttribute('role')).toBe('tab');

    el.selected = true;
    el.disabled = true;
    await el.updateComplete;

    expect(el.getAttribute('aria-selected')).toBe('true');
    expect(el.getAttribute('aria-disabled')).toBe('true');

    el.selected = false;
    el.disabled = false;
    await el.updateComplete;

    expect(el.getAttribute('aria-selected')).toBe('false');
    expect(el.getAttribute('aria-disabled')).toBe('false');
  });

  it('emits ds-tab-activate on click when enabled', async () => {
    const el = await mount<DsTab>('<ds-tab value="settings">Settings</ds-tab>');
    const events: CustomEvent[] = [];

    el.addEventListener('ds-tab-activate', (event) => {
      events.push(event as CustomEvent);
    });

    el.click();

    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toEqual({ value: 'settings' });
  });

  it('does not emit ds-tab-activate when disabled', async () => {
    const el = await mount<DsTab>('<ds-tab value="settings" disabled>Settings</ds-tab>');
    const events: CustomEvent[] = [];

    el.addEventListener('ds-tab-activate', (event) => {
      events.push(event as CustomEvent);
    });

    el.click();

    expect(events).toHaveLength(0);
  });

  it('removes the click handler on disconnect', async () => {
    const el = await mount<DsTab>('<ds-tab value="settings">Settings</ds-tab>');
    const events: CustomEvent[] = [];

    el.addEventListener('ds-tab-activate', (event) => {
      events.push(event as CustomEvent);
    });

    el.remove();
    el.click();

    expect(events).toHaveLength(0);
  });

  it('does not change aria-selected/aria-disabled when unrelated props update', async () => {
    const el = await mount<DsTab>('<ds-tab value="overview">Overview</ds-tab>');
    expect(el.getAttribute('aria-selected')).toBe('false');
    expect(el.getAttribute('aria-disabled')).toBe('false');

    el.value = 'changed';
    await el.updateComplete;

    expect(el.getAttribute('aria-selected')).toBe('false');
    expect(el.getAttribute('aria-disabled')).toBe('false');
  });
});
