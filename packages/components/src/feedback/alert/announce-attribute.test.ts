import { describe, expect, it, beforeEach } from 'vitest';

import { mount, resetTestDom } from '../../test-utils/mount.js';
import type { DsAlert } from './alert.js';
import './define.js';

beforeEach(resetTestDom);

function liveRegionText(): string {
  return Array.from(document.querySelectorAll('[aria-live]'))
    .map((region) => region.textContent ?? '')
    .join('');
}

async function flushAnnouncement(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

describe('ds-alert announce-on-connect', () => {
  it('reads the kebab-case attribute', async () => {
    const el = await mount<DsAlert>('<ds-alert announce-on-connect heading="Offline">Body</ds-alert>');
    expect(el.announceOnConnect).toBe(true);
  });

  it('is off without it', async () => {
    const el = await mount<DsAlert>('<ds-alert heading="Offline">Body</ds-alert>');
    expect(el.announceOnConnect).toBe(false);
  });

  it('announces the heading on mount, which is what the attribute is for', async () => {
    await mount<DsAlert>('<ds-alert announce-on-connect heading="You are offline">Body</ds-alert>');
    await flushAnnouncement();
    expect(liveRegionText()).toContain('You are offline');
  });

  it('stays silent without the attribute', async () => {
    await mount<DsAlert>('<ds-alert heading="You are offline">Body</ds-alert>');
    await flushAnnouncement();
    expect(liveRegionText()).not.toContain('You are offline');
  });

  it('announces a danger alert assertively', async () => {
    await mount<DsAlert>('<ds-alert tone="danger" announce-on-connect heading="Payment failed">Body</ds-alert>');
    await flushAnnouncement();
    expect(document.querySelector('[aria-live="assertive"]')?.textContent).toContain('Payment failed');
  });
});
