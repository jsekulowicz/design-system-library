import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsPageShell } from './page-shell.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];

  readonly callback: ResizeObserverCallback;
  target?: Element;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }

  observe(target?: Element): void {
    if (target) this.target = target;
  }

  disconnect(): void {
    // no-op
  }

  unobserve(): void {
    // no-op
  }
}

// Other components (e.g. the mobile-nav ds-drawer) also create ResizeObservers,
// so pick the one observing the page shell itself rather than instances[0].
function shellResizeObserver(el: Element): ResizeObserverMock {
  return (
    ResizeObserverMock.instances.find((o) => o.target === el) ??
    ResizeObserverMock.instances[0]
  );
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

  // The mobile drawer renders a <ds-drawer>, which uses a native <dialog>
  // under the hood. jsdom's HTMLDialogElement lacks showModal/close, so
  // shim them the same way the dialog/drawer test files do.
  const proto = HTMLDialogElement.prototype as unknown as {
    showModal?: () => void;
    close?: (returnValue?: string) => void;
  };
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (typeof proto.close !== 'function') {
    proto.close = function close(this: HTMLDialogElement, returnValue?: string) {
      if (returnValue !== undefined) {
        (this as unknown as { returnValue: string }).returnValue = returnValue;
      }
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
});

afterAll(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
});

beforeEach(() => {
  resetTestDom();
  ResizeObserverMock.instances = [];
});

async function forceMobileLayout(el: DsPageShell): Promise<void> {
  const observer = shellResizeObserver(el);
  observer.callback([{ contentRect: { width: 360 } } as ResizeObserverEntry], observer as never);
  await el.updateComplete;
}

// jsdom gives every element a 0×0 bounding rect, so the resize observer's
// initial layout snapshot lands on mobile. Tests that exercise the desktop
// branch need to bump the observed width past the mobile breakpoint first.
async function forceDesktopLayout(el: DsPageShell): Promise<void> {
  const observer = shellResizeObserver(el);
  observer.callback([{ contentRect: { width: 1024 } } as ResizeObserverEntry], observer as never);
  await el.updateComplete;
}

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
      await forceDesktopLayout(el);
      expect(el.hasAttribute('aside-empty')).toBe(false);
      expect(el.shadowRoot!.querySelector('aside[part="aside"]')).not.toBeNull();
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

    it('renders the footer slot as a bare child of <footer> so consumer chrome owns the width', async () => {
      const el = await mount<DsPageShell>(pageShellWithFooterTemplate());
      await el.updateComplete;
      const footer = el.shadowRoot!.querySelector('footer')!;
      expect(footer).not.toBeNull();
      expect(footer.querySelector('.shell-inner')).toBeNull();
      expect(footer.querySelector('slot[name="footer"]')).not.toBeNull();
    });
  });

  describe('content column', () => {
    it('composes ds-top-bar inside the header and slots brand + actions through', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const root = el.shadowRoot!;
      const topBar = root.querySelector('header > ds-top-bar');
      const body = root.querySelector('.shell-body');
      expect(topBar).not.toBeNull();
      expect(root.querySelector('slot[name="brand"][slot="brand"]')).not.toBeNull();
      expect(root.querySelector('slot[name="header-actions"][slot="actions"]')).not.toBeNull();
      expect(body).not.toBeNull();
      expect(body!.querySelector('aside[part="aside"], ds-drawer[part="aside"]')).not.toBeNull();
      expect(body!.querySelector('main')).not.toBeNull();
    });

    it('exposes a body part for consumer styling', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const body = el.shadowRoot!.querySelector('[part="body"]')!;
      expect(body).not.toBeNull();
      expect(body.classList.contains('shell-body')).toBe(true);
    });

    it('makes the embedded ds-top-bar background transparent so the sticky header bg shows through', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/\.chrome\s*{[^}]*--ds-top-bar-bg:\s*transparent/);
    });

    it('constrains the shell to the viewport so main owns page scrolling', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/:host\s*{[^}]*height:\s*100vh/);
      expect(css).toMatch(/:host\s*{[^}]*height:\s*100dvh/);
    });

    it('defaults the page content column to fluid width', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/:host\s*{[^}]*--ds-page-shell-max-width:\s*none/);
    });

    it('hides the drawer toggle by default and shows it only in mobile-layout', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/\.menu-toggle\s*{[^}]*display:\s*none/);
      expect(css).toMatch(
        /:host\(\[mobile-layout\]\)\s*\.menu-toggle\s*{[^}]*display:\s*inline-flex/,
      );
    });

    it('lets the main grid track shrink below intrinsic content width and contains overflow', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/main\s*{[^}]*min-width:\s*0/);
      expect(css).toMatch(/main\s*{[^}]*overflow-x:\s*clip/);
      expect(css).toMatch(/main\s*{[^}]*overflow-y:\s*auto/);
    });

    it('keeps the desktop aside flush with its column edge (no scrollbar gutter)', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      const baseAsideRule = css.match(/(?<![\w-\]"])aside\s*{[^}]*}/)?.[0];
      expect(baseAsideRule).toBeTruthy();
      expect(baseAsideRule).not.toMatch(/scrollbar-gutter:\s*stable/);
    });

    it('hides aside scrollbars and applies the shared scroll fade mask', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/aside\s*{[^}]*scrollbar-width:\s*none/);
      expect(css).toMatch(/aside\s*{[^}]*mask-image:\s*var\(--ds-scroll-fade-mask\)/);
      expect(css).toMatch(/aside::-webkit-scrollbar\s*{[^}]*display:\s*none/);
    });

    it('reserves scrollbar gutters on both inline edges of main for symmetric content', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/main\s*{[^}]*scrollbar-gutter:\s*stable\s+both-edges/);
    });

    it('uses real mobile main padding below desktop', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/main\s*{[^}]*padding:\s*var\(--ds-space-5\)/);
      expect(css).toContain('@media (max-width: calc(1024px - 0.02px))');
      expect(css).toContain('padding-block: var(--ds-space-4)');
      expect(css).toContain('padding-inline: var(--ds-space-4)');
    });
  });

  describe('desktop aside toggles', () => {
    it('does not render aside toggles without opt-in attributes', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand">
          <div slot="aside">Navigation</div>
          <div slot="aside-end">TOC</div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceDesktopLayout(el);
      expect(el.shadowRoot!.querySelector('.aside-toggle-start')).toBeNull();
      expect(el.shadowRoot!.querySelector('.aside-toggle-end')).toBeNull();
    });

    it('does not override consumer-owned collapsed state without aside-toggle', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand">
          <ds-sidenav slot="aside" collapsed>Navigation</ds-sidenav>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceDesktopLayout(el);
      expect(el.querySelector<HTMLElement>('[slot="aside"]')?.hasAttribute('collapsed')).toBe(true);
    });

    it('cycles start aside through visible, compact, hidden, and visible', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand" aside-toggle>
          <ds-sidenav slot="aside">Navigation</ds-sidenav>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceDesktopLayout(el);
      const toggle = el.shadowRoot!.querySelector('.aside-toggle-start') as HTMLElement;
      const aside = el.querySelector<HTMLElement>('[slot="aside"]')!;
      expect(toggle.getAttribute('variant')).toBe('secondary');
      expect(toggle.getAttribute('size')).toBe('sm');
      expect(toggle.hasAttribute('square')).toBe(true);
      expect(toggle.querySelector('ds-icon')?.getAttribute('size')).toBe('lg');

      toggle.click();
      await el.updateComplete;
      expect(el.asideState).toBe('compact');
      expect(el.getAttribute('aside-state')).toBe('compact');
      expect(aside.hasAttribute('collapsed')).toBe(true);
      expect(toggle.querySelector('ds-icon')?.getAttribute('name')).toBe('chevron-left');

      toggle.click();
      await el.updateComplete;
      expect(el.asideState).toBe('hidden');
      expect(aside.hasAttribute('collapsed')).toBe(true);
      expect(el.shadowRoot!.querySelector('aside[part="aside"]')?.getAttribute('aria-hidden')).toBe('true');
      expect(el.shadowRoot!.querySelector('aside[part="aside"]')?.hasAttribute('inert')).toBe(true);
      expect(toggle.querySelector('ds-icon')?.getAttribute('name')).toBe('chevron-right');

      toggle.click();
      await el.updateComplete;
      expect(el.asideState).toBe('visible');
      expect(el.shadowRoot!.querySelector('aside[part="aside"]')?.getAttribute('aria-hidden')).toBe('false');
      expect(el.shadowRoot!.querySelector('aside[part="aside"]')?.hasAttribute('inert')).toBe(false);
    });

    it('cycles end aside between visible and hidden', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand" aside-end-toggle>
          <div slot="aside-end">Table of contents</div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceDesktopLayout(el);
      const toggle = el.shadowRoot!.querySelector('.aside-toggle-end') as HTMLElement;
      expect(toggle.getAttribute('variant')).toBe('secondary');
      expect(toggle.querySelector('ds-icon')?.getAttribute('name')).toBe('chevron-right');

      toggle.click();
      await el.updateComplete;
      expect(el.asideEndState).toBe('hidden');
      expect(el.getAttribute('aside-end-state')).toBe('hidden');
      expect(el.shadowRoot!.querySelector('aside[part="aside-end"]')?.getAttribute('aria-hidden')).toBe('true');
      expect(el.shadowRoot!.querySelector('aside[part="aside-end"]')?.hasAttribute('inert')).toBe(true);
      expect(toggle.querySelector('ds-icon')?.getAttribute('name')).toBe('chevron-left');

      toggle.click();
      await el.updateComplete;
      expect(el.asideEndState).toBe('visible');
      expect(el.shadowRoot!.querySelector('aside[part="aside-end"]')?.getAttribute('aria-hidden')).toBe('false');
      expect(el.shadowRoot!.querySelector('aside[part="aside-end"]')?.hasAttribute('inert')).toBe(false);
    });

    it('emits aside state changes with side and previous state', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand" aside-toggle>
          <div slot="aside">Navigation</div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceDesktopLayout(el);
      const events: CustomEvent[] = [];
      el.addEventListener('ds-aside-state-change', (event) => events.push(event as CustomEvent));
      const toggle = el.shadowRoot!.querySelector('.aside-toggle-start') as HTMLElement;

      toggle.click();
      await el.updateComplete;

      expect(events[0]?.detail).toEqual({
        side: 'start',
        state: 'compact',
        previousState: 'visible',
      });
    });

    it('does not render desktop aside toggles in mobile layout', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand" aside-toggle aside-end-toggle>
          <div slot="aside">Navigation</div>
          <div slot="aside-end">TOC</div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceMobileLayout(el);
      expect(el.shadowRoot!.querySelector('.aside-toggle-start')).toBeNull();
      expect(el.shadowRoot!.querySelector('.aside-toggle-end')).toBeNull();
    });

    it('positions controls over aside borders without reserving a full rail', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(/\.aside-toggle-rail\s*{[^}]*position:\s*absolute/);
      expect(css).toMatch(
        /\.aside-toggle-start-rail\s*{[^}]*inset-inline-end:\s*calc\(var\(--ds-size-sm\)\s*\/\s*-2\)/,
      );
      expect(css).toMatch(
        /:host\(\[aside-toggle\]\)\s*aside\[part="aside"\]\s*{[^}]*padding-inline-end:/,
      );
      expect(css).toMatch(
        /:host\(\[aside-end-toggle\]\)\s*aside\[part="aside-end"\]\s*{[^}]*padding-inline-start:/,
      );
    });

    it('collapses asides with an animatable grid track and keeps toggle clearance', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles
        .map((s) => s.cssText)
        .join('\n');
      expect(css).toMatch(
        /\.aside-start-cluster,\s*\.aside-end-cluster\s*{[^}]*grid-template-columns:\s*1fr[^}]*transition:\s*grid-template-columns/s,
      );
      expect(css).toMatch(
        /:host\(\[aside-state='hidden'\]\)\s*\.aside-start-cluster,[^{]*{[^}]*grid-template-columns:\s*0fr;[^}]*min-width:\s*calc\(var\(--ds-size-sm\)\s*\/\s*2\s*\+\s*var\(--ds-space-2\)\)/s,
      );
    });
  });

  describe('mobile drawer (ds-drawer integration)', () => {
    it('renders a ds-drawer with part="aside" in mobile layout, plain <aside> in desktop', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await forceDesktopLayout(el);
      expect(el.shadowRoot!.querySelector('aside[part="aside"]')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('ds-drawer[part="aside"]')).toBeNull();

      await forceMobileLayout(el);
      expect(el.shadowRoot!.querySelector('ds-drawer[part="aside"]')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('aside[part="aside"]')).toBeNull();
    });

    it('anchors the mobile drawer at the inline start as a small drawer', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await forceMobileLayout(el);
      const drawer = el.shadowRoot!.querySelector('ds-drawer')!;
      expect(drawer.getAttribute('side')).toBe('start');
      expect(drawer.getAttribute('size')).toBe('sm');
    });

    it('forwards the drawer-brand slot into ds-drawer\'s title slot', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand">
          <span slot="drawer-brand">Wide Brand</span>
          <div slot="aside"><a href="#settings">Settings</a></div>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceMobileLayout(el);
      const brandSlot = el.shadowRoot!.querySelector(
        'ds-drawer slot[name="drawer-brand"][slot="title"]',
      ) as HTMLSlotElement | null;
      expect(brandSlot).not.toBeNull();
      expect(brandSlot!.assignedElements()[0]?.textContent).toBe('Wide Brand');
    });

    it('opens and closes the ds-drawer in sync with mobile nav state', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await forceMobileLayout(el);
      const drawer = el.shadowRoot!.querySelector('ds-drawer')! as HTMLElement & { open: boolean };
      expect(drawer.open).toBe(false);

      const menuToggle = el.shadowRoot!.querySelector('ds-button.menu-toggle') as HTMLElement;
      menuToggle.click();
      await el.updateComplete;
      expect(drawer.open).toBe(true);

      menuToggle.click();
      await el.updateComplete;
      expect(drawer.open).toBe(false);
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
