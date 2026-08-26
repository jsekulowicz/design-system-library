import { describe, expect, it } from 'vitest';
import type { DsPageShell } from './page-shell.test-helpers.js';
import {
  ResizeObserverMock,
  forceDesktopLayout,
  forceMobileLayout,
  mount,
  pageShellTemplate,
  shellResizeObserver,
} from './page-shell.test-helpers.js';

describe('<ds-page-shell>', () => {
  it('closes mobile navigation when composed path includes ds-nav-item', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceMobileLayout(el);
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const drawer = el.shadowRoot!.querySelector('ds-drawer') as HTMLElement;
    const fakeNavItem = document.createElement('ds-nav-item');
    const event = new Event('click', { bubbles: true, composed: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [fakeNavItem, drawer],
    });
    drawer.dispatchEvent(event);
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes mobile navigation when composed path contains an element with href attribute', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceMobileLayout(el);
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const drawer = el.shadowRoot!.querySelector('ds-drawer') as HTMLElement;
    const fakeLinkLike = document.createElement('span');
    fakeLinkLike.setAttribute('href', '#settings');
    const event = new Event('click', { bubbles: true, composed: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [fakeLinkLike, drawer],
    });
    drawer.dispatchEvent(event);
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not close navigation on aside click when not in mobile layout', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceDesktopLayout(el);
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const navLink = el.querySelector('[slot="aside"] a') as HTMLAnchorElement;
    navLink.click();
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(true);
  });

  it('keeps mobile navigation open when aside click path is not a nav target', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceMobileLayout(el);
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const drawer = el.shadowRoot!.querySelector('ds-drawer') as HTMLElement;
    const plainNode = document.createElement('span');
    const event = new Event('click', { bubbles: true, composed: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [plainNode, drawer],
    });
    drawer.dispatchEvent(event);
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(true);
  });

  it('closes open mobile navigation when layout resizes to desktop', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    await forceMobileLayout(el);
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const observer = shellResizeObserver(el);
    observer.callback([{ contentRect: { width: 1024 } } as ResizeObserverEntry], observer as never);
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(false);
  });

  it('ignores resize callbacks with no entries', async () => {
    await mount<DsPageShell>(pageShellTemplate());
    const observer = ResizeObserverMock.instances[0];
    expect(() => {
      observer.callback([], observer as never);
    }).not.toThrow();
  });
});
