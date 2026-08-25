import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsLink } from './link.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-link')) {
    customElements.define('ds-link', DsLink);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-link>', () => {
  it('renders an anchor with href and slot text', async () => {
    const el = await mount<DsLink>('<ds-link href="/docs">Docs</ds-link>');
    const anchor = el.shadowRoot!.querySelector('a')!;
    const slot = el.shadowRoot!.querySelector('slot');
    const label = slot?.assignedNodes({ flatten: true })[0]?.textContent?.trim();
    expect(anchor.getAttribute('href')).toBe('/docs');
    expect(label).toBe('Docs');
  });

  it('uses explicit rel when provided', async () => {
    const el = await mount<DsLink>('<ds-link href="/" rel="nofollow">Docs</ds-link>');
    const anchor = el.shadowRoot!.querySelector('a')!;
    expect(anchor.getAttribute('rel')).toBe('nofollow');
  });

  it('sets safe rel when external is true', async () => {
    const el = await mount<DsLink>('<ds-link href="/" external>Docs</ds-link>');
    const anchor = el.shadowRoot!.querySelector('a')!;
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('sets safe rel when target is _blank', async () => {
    const el = await mount<DsLink>('<ds-link href="/" target="_blank">Docs</ds-link>');
    const anchor = el.shadowRoot!.querySelector('a')!;
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('omits rel when not external and target is not _blank', async () => {
    const el = await mount<DsLink>('<ds-link href="/" target="_self">Docs</ds-link>');
    const anchor = el.shadowRoot!.querySelector('a')!;
    expect(anchor.getAttribute('rel')).toBeNull();
  });
});
