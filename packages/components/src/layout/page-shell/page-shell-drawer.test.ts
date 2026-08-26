import { describe, expect, it } from 'vitest';
import type { DsPageShell } from './page-shell.test-helpers.js';
import { forceDesktopLayout, forceMobileLayout, mount, pageShellTemplate } from './page-shell.test-helpers.js';

describe('<ds-page-shell>', () => {
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

    it("forwards the drawer-brand slot into ds-drawer's title slot", async () => {
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
