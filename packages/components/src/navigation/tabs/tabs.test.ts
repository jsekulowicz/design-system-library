import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsTabs } from './tabs.js';
import { DsTab } from './tab.js';
import { DsTabPanel } from './tab-panel.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-tabs')) {
    customElements.define('ds-tabs', DsTabs);
  }
  if (!customElements.get('ds-tab')) {
    customElements.define('ds-tab', DsTab);
  }
  if (!customElements.get('ds-tab-panel')) {
    customElements.define('ds-tab-panel', DsTabPanel);
  }
});

beforeEach(() => {
  resetTestDom();
});

function template(): string {
  return `
    <ds-tabs>
      <ds-tab slot="tab" value="overview">Overview</ds-tab>
      <ds-tab slot="tab" value="activity" disabled>Activity</ds-tab>
      <ds-tab slot="tab" value="settings">Settings</ds-tab>
      <ds-tab-panel value="overview">Overview content</ds-tab-panel>
      <ds-tab-panel value="activity">Activity content</ds-tab-panel>
      <ds-tab-panel value="settings">Settings content</ds-tab-panel>
    </ds-tabs>
  `;
}

async function syncSlots(el: DsTabs): Promise<void> {
  const slots = el.shadowRoot!.querySelectorAll('slot');
  slots.forEach((slot) => {
    slot.dispatchEvent(new Event('slotchange'));
  });
  await el.updateComplete;
}

describe('<ds-tabs>', () => {
  it('selects first tab by default and syncs tab/panel attributes', async () => {
    const el = await mount<DsTabs>(template());
    await syncSlots(el);

    const tabs = Array.from(el.querySelectorAll<DsTab>('ds-tab'));
    const panels = Array.from(el.querySelectorAll<DsTabPanel>('ds-tab-panel'));

    expect(el.value).toBe('overview');
    expect(tabs[0].selected).toBe(true);
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].selected).toBe(false);
    expect(tabs[1].tabIndex).toBe(-1);
    expect(tabs[0].getAttribute('aria-controls')).toContain('overview');
    expect(panels[0].active).toBe(true);
    expect(panels[1].active).toBe(false);
    expect(panels[0].getAttribute('aria-labelledby')).toContain('overview');
  });

  it('changes value on ds-tab-activate and does not leak that event outside', async () => {
    document.body.innerHTML = `<div id="host">${template()}</div>`;
    const host = document.getElementById('host')!;
    const el = host.querySelector('ds-tabs') as DsTabs;
    await el.updateComplete;
    await syncSlots(el);

    let leaked = 0;
    host.addEventListener('ds-tab-activate', () => {
      leaked += 1;
    });

    const changes: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => {
      changes.push(event as CustomEvent);
    });

    const tab = el.querySelector<DsTab>('ds-tab[value="settings"]')!;
    tab.click();
    await el.updateComplete;

    expect(el.value).toBe('settings');
    expect(changes.at(-1)?.detail).toEqual({ value: 'settings' });
    expect(leaked).toBe(0);
  });

  it('does not emit ds-change when activating the already selected tab', async () => {
    const el = await mount<DsTabs>(template());
    await syncSlots(el);
    const changes: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => {
      changes.push(event as CustomEvent);
    });

    const selectedTab = el.querySelector<DsTab>('ds-tab[value="overview"]')!;
    selectedTab.click();
    await el.updateComplete;

    expect(el.value).toBe('overview');
    expect(changes).toHaveLength(0);
  });

  it('supports keyboard navigation and skips disabled targets', async () => {
    const el = await mount<DsTabs>(template());
    await syncSlots(el);
    const tablist = el.shadowRoot!.querySelector('.tablist') as HTMLElement;

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('overview');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('settings');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('overview');

    el.value = 'settings';
    await el.updateComplete;
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('settings');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('overview');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('settings');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('settings');
  });

  it('handles empty tab collections and removes listeners on disconnect', async () => {
    const el = await mount<DsTabs>('<ds-tabs></ds-tabs>');
    const tablist = el.shadowRoot!.querySelector('.tablist') as HTMLElement;

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('');

    const changes: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => {
      changes.push(event as CustomEvent);
    });

    el.remove();
    el.dispatchEvent(new CustomEvent('ds-tab-activate', { detail: { value: 'overview' }, bubbles: true }));
    expect(changes).toHaveLength(0);
  });

  it('skips syncSelection when update does not include value changes', async () => {
    const el = await mount<DsTabs>(template());
    await syncSlots(el);

    el.requestUpdate();
    await el.updateComplete;

    expect(el.value).toBe('overview');
  });
});
