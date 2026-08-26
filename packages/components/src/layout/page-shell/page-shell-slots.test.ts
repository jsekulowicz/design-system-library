import { describe, expect, it } from 'vitest';
import type { DsPageShell } from './page-shell.test-helpers.js';
import {
  forceDesktopLayout,
  mount,
  pageShellTemplate,
  pageShellWithFooterTemplate,
} from './page-shell.test-helpers.js';

describe('<ds-page-shell>', () => {
  describe('empty aside slot', () => {
    it('reflects aside-empty when nothing is slotted in aside', async () => {
      const el = await mount<DsPageShell>(`<ds-page-shell brand="Brand"><div>Content</div></ds-page-shell>`);
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
      const el = await mount<DsPageShell>(`<ds-page-shell brand="Brand"><div>Content</div></ds-page-shell>`);
      await el.updateComplete;
      expect(el.hasAttribute('footer-empty')).toBe(true);
    });

    it('does not render footer markup when nothing is slotted in footer', async () => {
      const el = await mount<DsPageShell>(`<ds-page-shell brand="Brand"><div>Content</div></ds-page-shell>`);
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
});
