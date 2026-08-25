import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { DsSettingsPage } from './settings-page.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-settings-page')) {
    customElements.define('ds-settings-page', DsSettingsPage);
  }
});

beforeEach(() => {
  resetTestDom();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('<ds-settings-page>', () => {
  it('renders a plain sections container when no sections are provided', async () => {
    const el = await mount<DsSettingsPage>('<ds-settings-page heading="Settings"></ds-settings-page>');

    expect(el.shadowRoot!.querySelector('nav')).toBeNull();
    expect(el.shadowRoot!.querySelector('.sections')).not.toBeNull();
  });

  it('renders navigation and updates active link on click via document.getElementById', async () => {
    const el = await mount<DsSettingsPage>(`
      <ds-settings-page heading="Settings" description="Manage account"></ds-settings-page>
    `);
    el.sections = [
      { id: 'profile', label: 'Profile' },
      { id: 'security', label: 'Security' },
    ];
    await el.updateComplete;

    const section = document.createElement('section');
    section.id = 'security';
    section.scrollIntoView = vi.fn();
    const getById = vi.spyOn(document, 'getElementById').mockReturnValue(section);

    const links = el.shadowRoot!.querySelectorAll('nav a');
    (links[1] as HTMLAnchorElement).click();
    await el.updateComplete;

    expect(getById).toHaveBeenCalledWith('security');
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect((links[1] as HTMLAnchorElement).getAttribute('aria-current')).toBe('true');
    expect((links[0] as HTMLAnchorElement).getAttribute('aria-current')).toBe('false');
    expect(el.shadowRoot!.querySelector('.hero p')?.textContent?.trim()).toBe('Manage account');
  });

  it('falls back to host querySelector when getElementById misses and CSS.escape is unavailable', async () => {
    const originalCss = globalThis.CSS;
    globalThis.CSS = undefined as never;
    try {
      const el = await mount<DsSettingsPage>(`
        <ds-settings-page></ds-settings-page>
      `);
      el.sections = [{ id: 'billing', label: 'Billing' }];
      await el.updateComplete;

      const slotSection = document.createElement('section');
      slotSection.id = 'billing';
      slotSection.scrollIntoView = vi.fn();
      el.append(slotSection);

      vi.spyOn(document, 'getElementById').mockReturnValue(null);

      const link = el.shadowRoot!.querySelector('nav a') as HTMLAnchorElement;
      link.click();
      await el.updateComplete;

      expect(slotSection.scrollIntoView).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.CSS = originalCss;
    }
  });

  it('uses CSS.escape when it is available for selector fallback', async () => {
    const originalCss = globalThis.CSS;
    const calls: string[] = [];
    globalThis.CSS = {
      escape: (value: string) => {
        calls.push(value);
        return value;
      },
    } as never;

    try {
      const el = await mount<DsSettingsPage>('<ds-settings-page></ds-settings-page>');
      el.sections = [{ id: 'privacy', label: 'Privacy' }];
      await el.updateComplete;

      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      const section = document.createElement('section');
      section.id = 'privacy';
      section.scrollIntoView = vi.fn();
      el.append(section);

      const link = el.shadowRoot!.querySelector('nav a') as HTMLAnchorElement;
      link.click();
      await el.updateComplete;

      expect(calls).toContain('privacy');
      expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.CSS = originalCss;
    }
  });
});
