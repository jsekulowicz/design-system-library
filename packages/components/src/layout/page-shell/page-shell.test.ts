import { describe, expect, it } from 'vitest';
import type { DsButton, DsPageShell } from './page-shell.test-helpers.js';
import { forceDesktopLayout, forceMobileLayout, mount, pageShellTemplate } from './page-shell.test-helpers.js';

describe('<ds-page-shell>', () => {
  it('keeps the optional page header outside the main scroller', async () => {
    const el = await mount<DsPageShell>(`
      <ds-page-shell>
        <header slot="page-header">Page heading</header>
        <section>Page content</section>
      </ds-page-shell>
    `);

    const pageHeader = el.shadowRoot!.querySelector('[part="page-header"]')!;
    const scroller = el.shadowRoot!.querySelector('[part="main-scroller"]')!;
    const content = el.shadowRoot!.querySelector('[part="main-content"]')!;
    expect(pageHeader.hasAttribute('hidden')).toBe(false);
    expect(pageHeader.parentElement).toBe(scroller.parentElement);
    expect(content.parentElement).toBe(scroller);
    expect(el.hasAttribute('page-header-empty')).toBe(false);
  });

  it('delegates main scrolling to a direct scrollable page child', async () => {
    const el = await mount<DsPageShell>(`
      <ds-page-shell>
        <ds-scrollable-page>Content</ds-scrollable-page>
      </ds-page-shell>
    `);

    expect(el.hasAttribute('scrollable-main')).toBe(true);
  });

  it('starts with closed mobile navigation', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle');
    expect(menuToggle).not.toBeNull();
    expect(menuToggle!.getAttribute('aria-expanded')).toBe('false');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(false);
  });

  it('does not emit aria-controls references across nested shadow roots', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceDesktopLayout(el);
    const toggles = el.shadowRoot!.querySelectorAll<DsButton>('ds-button.menu-toggle, ds-button.aside-toggle');

    for (const toggle of toggles) {
      await toggle.updateComplete;
      expect(toggle.hasAttribute('aria-controls')).toBe(false);
      expect(toggle.shadowRoot!.querySelector('button')!.hasAttribute('aria-controls')).toBe(false);
    }
  });

  it('opens navigation and clears collapsed state from slotted aside', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    const slottedAside = el.querySelector<HTMLElement>('[slot="aside"]')!;
    expect(slottedAside.hasAttribute('collapsed')).toBe(true);

    menuToggle.click();
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(true);
    expect(slottedAside.hasAttribute('collapsed')).toBe(false);
  });

  it('keeps the mobile menu trigger as a bars icon while navigation is open', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const icon = menuToggle.querySelector('ds-icon')!;
    expect(icon.getAttribute('name')).toBe('bars-3');
    expect(icon.getAttribute('size')).toBe('3xl');
  });

  it('closes navigation when the mobile drawer emits ds-close (Escape, backdrop, etc.)', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceMobileLayout(el);
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;
    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');

    const drawer = el.shadowRoot!.querySelector('ds-drawer')!;
    drawer.dispatchEvent(new CustomEvent('ds-close'));
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(false);
  });

  it('closes mobile navigation when clicking a nav link inside aside', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceMobileLayout(el);
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const navLink = el.querySelector('[slot="aside"] a') as HTMLAnchorElement;
    navLink.click();
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(false);
  });
});
