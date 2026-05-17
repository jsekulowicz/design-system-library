import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsPageShell } from './page-shell.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];

  readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }

  observe(): void {
    // no-op
  }

  disconnect(): void {
    // no-op
  }

  unobserve(): void {
    // no-op
  }
}

const OriginalResizeObserver = globalThis.ResizeObserver;

function pageShellTemplate(): string {
  return `
    <ds-page-shell brand="Brand">
      <div slot="aside" collapsed>
        <a href="#settings">Settings</a>
      </div>
      <div>Content</div>
    </ds-page-shell>
  `;
}

function pageShellWithFooterTemplate(): string {
  return `
    <ds-page-shell brand="Brand">
      <div slot="aside" collapsed>
        <a href="#settings">Settings</a>
      </div>
      <div>Content</div>
      <div slot="footer">Footer</div>
    </ds-page-shell>
  `;
}

beforeAll(() => {
  if (!customElements.get('ds-page-shell')) {
    customElements.define('ds-page-shell', DsPageShell);
  }
  globalThis.ResizeObserver = ResizeObserverMock as never;
});

afterAll(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
});

beforeEach(() => {
  resetTestDom();
  ResizeObserverMock.instances = [];
});

describe('<ds-page-shell>', () => {
  it('starts with closed mobile navigation', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle');
    expect(menuToggle).not.toBeNull();
    expect(menuToggle!.getAttribute('aria-expanded')).toBe('false');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(false);
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

  it('closes navigation on Escape', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(false);
  });

  it('keeps navigation open for non-Escape key presses', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(true);
  });

  it('closes mobile navigation when clicking a nav link inside aside', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const navLink = el.querySelector('[slot="aside"] a') as HTMLAnchorElement;
    navLink.click();
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(false);
  });

  it('closes mobile navigation when composed path includes ds-nav-item', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;
    el.setAttribute('mobile-layout', '');

    const aside = el.shadowRoot!.querySelector('aside') as HTMLElement;
    const fakeNavItem = document.createElement('ds-nav-item');
    const event = new Event('click', { bubbles: true, composed: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [fakeNavItem, aside],
    });
    aside.dispatchEvent(event);
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes mobile navigation when composed path contains an element with href attribute', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;
    el.setAttribute('mobile-layout', '');

    const aside = el.shadowRoot!.querySelector('aside') as HTMLElement;
    const fakeLinkLike = document.createElement('span');
    fakeLinkLike.setAttribute('href', '#settings');
    const event = new Event('click', { bubbles: true, composed: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [fakeLinkLike, aside],
    });
    aside.dispatchEvent(event);
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not close navigation on aside click when not in mobile layout', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    el.removeAttribute('mobile-layout');
    const navLink = el.querySelector('[slot="aside"] a') as HTMLAnchorElement;
    navLink.click();
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(true);
  });

  it('keeps mobile navigation open when aside click path is not a nav target', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;
    el.setAttribute('mobile-layout', '');

    const aside = el.shadowRoot!.querySelector('aside') as HTMLElement;
    const plainNode = document.createElement('span');
    const event = new Event('click', { bubbles: true, composed: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [plainNode, aside],
    });
    aside.dispatchEvent(event);
    await el.updateComplete;

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.hasAttribute('data-mobile-nav-open')).toBe(true);
  });

  it('closes open mobile navigation when layout resizes to desktop', async () => {
    const el = await mount<DsPageShell>(pageShellTemplate());
    const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
    menuToggle.click();
    await el.updateComplete;

    const observer = ResizeObserverMock.instances[0];
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

  describe('empty aside slot', () => {
    it('reflects aside-empty when nothing is slotted in aside', async () => {
      const el = await mount<DsPageShell>(
        `<ds-page-shell brand="Brand"><div>Content</div></ds-page-shell>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute('aside-empty')).toBe(true);
      expect(el.shadowRoot!.querySelector('ds-button.menu-toggle')).toBeNull();
    });

    it('keeps aside markup when content is slotted', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      expect(el.hasAttribute('aside-empty')).toBe(false);
      expect(el.shadowRoot!.querySelector('aside')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('ds-button.menu-toggle')).not.toBeNull();
    });
  });

  describe('empty footer slot', () => {
    it('reflects footer-empty when nothing is slotted in footer', async () => {
      const el = await mount<DsPageShell>(
        `<ds-page-shell brand="Brand"><div>Content</div></ds-page-shell>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute('footer-empty')).toBe(true);
    });

    it('does not render footer markup when nothing is slotted in footer', async () => {
      const el = await mount<DsPageShell>(
        `<ds-page-shell brand="Brand"><div>Content</div></ds-page-shell>`,
      );
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('footer')).toBeNull();
    });

    it('does not reflect footer-empty when footer slot has content', async () => {
      const el = await mount<DsPageShell>(
        `<ds-page-shell brand="Brand"><div>Content</div><div slot="footer">© 2026</div></ds-page-shell>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute('footer-empty')).toBe(false);
    });

    it('renders footer as a bare slot wrapper', async () => {
      const el = await mount<DsPageShell>(pageShellWithFooterTemplate());
      await el.updateComplete;
      const footer = el.shadowRoot!.querySelector('footer')!;
      expect(footer).not.toBeNull();
      expect(footer.querySelector('.shell-inner')).toBeNull();
      expect(footer.querySelector('slot[name="footer"]')).not.toBeNull();
    });
  });

  describe('content column', () => {
    it('wraps header content and body in capped containers', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const root = el.shadowRoot!;
      const headerInner = root.querySelector('header > .shell-inner');
      const body = root.querySelector('.shell-body');
      expect(headerInner).not.toBeNull();
      expect(body).not.toBeNull();
      // body wraps aside + main as siblings of the same column
      expect(body!.querySelector('aside')).not.toBeNull();
      expect(body!.querySelector('main')).not.toBeNull();
    });

    it('exposes a body part for consumer styling', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const body = el.shadowRoot!.querySelector('[part="body"]')!;
      expect(body).not.toBeNull();
      expect(body.classList.contains('shell-body')).toBe(true);
    });

    it('lets the main grid track shrink below intrinsic content width and contains overflow', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/main\s*{[^}]*min-width:\s*0/);
      expect(css).toMatch(/main\s*{[^}]*overflow:\s*auto/);
    });

    it('keeps the desktop aside flush with its column edge (no scrollbar gutter)', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      // The base aside selector intentionally omits scrollbar-gutter so that
      // <main>'s padding solely owns the horizontal gap between aside and main.
      const baseAsideRule = css.match(/(?<![\w-\]"])aside\s*{[^}]*}/)?.[0];
      expect(baseAsideRule).toBeTruthy();
      expect(baseAsideRule).not.toMatch(/scrollbar-gutter:\s*stable/);
    });
  });

  describe('aside-end slot', () => {
    it('does not render the inline-end column when the slot is empty', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const asideEnd = el.shadowRoot!.querySelector('aside[part="aside-end"]');
      expect(asideEnd?.hasAttribute('hidden')).toBe(true);
      expect(el.hasAttribute('aside-end-empty')).toBe(true);
    });

    it('renders the inline-end column when content is slotted into aside-end', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand">
          <div slot="aside-end">Table of contents</div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await el.updateComplete;
      const asideEnd = el.shadowRoot!.querySelector('aside[part="aside-end"]');
      expect(asideEnd).not.toBeNull();
      expect(asideEnd?.hasAttribute('hidden')).toBe(false);
      expect(el.hasAttribute('aside-end-empty')).toBe(false);
    });

    it('applies the configurable end-label to the secondary aside', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand" end-label="On this page">
          <div slot="aside-end">TOC</div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await el.updateComplete;
      const asideEnd = el.shadowRoot!.querySelector('aside[part="aside-end"]');
      expect(asideEnd?.getAttribute('aria-label')).toBe('On this page');
    });

    it('keeps the inline-end column independent of the inline-start column presence', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand">
          <div slot="aside-end">TOC</div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await el.updateComplete;
      expect(el.hasAttribute('aside-empty')).toBe(true);
      expect(el.hasAttribute('aside-end-empty')).toBe(false);
    });
  });
});
