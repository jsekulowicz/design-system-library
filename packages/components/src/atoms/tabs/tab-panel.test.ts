import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsTabPanel } from './tab-panel.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-tab-panel')) {
    customElements.define('ds-tab-panel', DsTabPanel);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-tab-panel>', () => {
  it('sets tabpanel semantics on connect', async () => {
    const el = await mount<DsTabPanel>('<ds-tab-panel value="overview">Overview</ds-tab-panel>');
    expect(el.getAttribute('role')).toBe('tabpanel');
    expect(el.tabIndex).toBe(0);
  });

  it('toggles hidden attribute from active state', async () => {
    const el = await mount<DsTabPanel>('<ds-tab-panel value="overview">Overview</ds-tab-panel>');
    el.active = false;
    await el.updateComplete;
    expect(el.hasAttribute('hidden')).toBe(true);

    el.active = true;
    await el.updateComplete;
    expect(el.hasAttribute('hidden')).toBe(false);
  });

  it('does not toggle hidden when active did not change', async () => {
    const el = await mount<DsTabPanel>('<ds-tab-panel value="overview">Overview</ds-tab-panel>');
    expect(el.hasAttribute('hidden')).toBe(true);
    el.value = 'next';
    await el.updateComplete;
    expect(el.hasAttribute('hidden')).toBe(true);
  });
});
