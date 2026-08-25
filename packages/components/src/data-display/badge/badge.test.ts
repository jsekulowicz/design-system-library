import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsBadge } from './badge.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-badge')) {
    customElements.define('ds-badge', DsBadge);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-badge>', () => {
  it('renders the default slot content', async () => {
    const el = await mount<DsBadge>('<ds-badge>Beta</ds-badge>');
    const part = el.shadowRoot!.querySelector('[part="badge"]');
    const slot = el.shadowRoot!.querySelector('slot');
    const label = slot?.assignedNodes({ flatten: true })[0]?.textContent?.trim();
    expect(part).not.toBeNull();
    expect(label).toBe('Beta');
  });

  it('reflects tone changes to an attribute', async () => {
    const el = await mount<DsBadge>('<ds-badge>Info</ds-badge>');
    el.tone = 'accent';
    await el.updateComplete;
    expect(el.getAttribute('tone')).toBe('accent');
  });
});
