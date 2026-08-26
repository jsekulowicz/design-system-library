import { describe, expect, it } from 'vitest';
import { DsPageShell, mount, pageShellTemplate } from './page-shell.test-helpers.js';

describe('<ds-page-shell>', () => {
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

    it('forwards a header-status slot into the top bar actions, before header-actions', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const topBar = el.shadowRoot!.querySelector('header > ds-top-bar')!;
      const actions = [...topBar.children].filter((c) => c.getAttribute('slot') === 'actions');
      const statusIndex = actions.findIndex((c) => c.getAttribute('name') === 'header-status');
      const actionsIndex = actions.findIndex((c) => c.getAttribute('name') === 'header-actions');
      expect(statusIndex).toBeGreaterThanOrEqual(0);
      expect(statusIndex).toBeLessThan(actionsIndex);
    });

    it('renders the menu toggle after header-actions by default (end)', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const topBar = el.shadowRoot!.querySelector('header > ds-top-bar')!;
      const actions = [...topBar.children].filter((c) => c.getAttribute('slot') === 'actions');
      const actionsIndex = actions.findIndex((c) => c.getAttribute('name') === 'header-actions');
      const toggleIndex = actions.findIndex((c) => c.classList.contains('menu-toggle'));
      expect(el.mobileMenuButtonPosition).toBe('end');
      expect(toggleIndex).toBeGreaterThan(actionsIndex);
    });

    it('renders the menu toggle before header-actions when position is start', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      el.mobileMenuButtonPosition = 'start';
      await el.updateComplete;
      const topBar = el.shadowRoot!.querySelector('header > ds-top-bar')!;
      const actions = [...topBar.children].filter((c) => c.getAttribute('slot') === 'actions');
      const statusIndex = actions.findIndex((c) => c.getAttribute('name') === 'header-status');
      const toggleIndex = actions.findIndex((c) => c.classList.contains('menu-toggle'));
      const actionsIndex = actions.findIndex((c) => c.getAttribute('name') === 'header-actions');
      expect(statusIndex).toBeLessThan(toggleIndex);
      expect(toggleIndex).toBeLessThan(actionsIndex);
    });

    it('exposes the menu toggle as a part', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const toggle = el.shadowRoot!.querySelector('ds-button.menu-toggle')!;
      expect(toggle.getAttribute('part')).toBe('menu-toggle');
    });

    it('lets consumers size the menu toggle via a custom property', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(
        /\.menu-toggle::part\(button\)\s*{[^}]*width:\s*var\(--ds-page-shell-menu-toggle-size,\s*var\(--ds-size-sm\)\)/,
      );
    });

    it('exposes a body part for consumer styling', async () => {
      const el = await mount<DsPageShell>(pageShellTemplate());
      await el.updateComplete;
      const body = el.shadowRoot!.querySelector('[part="body"]')!;
      expect(body).not.toBeNull();
      expect(body.classList.contains('shell-body')).toBe(true);
    });

    it('makes the embedded ds-top-bar background transparent so the sticky header bg shows through', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/\.chrome\s*{[^}]*--ds-top-bar-bg:\s*transparent/);
    });

    it('constrains the shell to the viewport so main owns page scrolling', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/:host\s*{[^}]*height:\s*100vh/);
      expect(css).toMatch(/:host\s*{[^}]*height:\s*100dvh/);
    });

    it('defaults the page content column to fluid width', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/:host\s*{[^}]*--ds-page-shell-max-width:\s*none/);
    });

    it('hides the drawer toggle by default and shows it only in mobile-layout', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/\.menu-toggle\s*{[^}]*display:\s*none/);
      expect(css).toMatch(/:host\(\[mobile-layout\]\)\s*\.menu-toggle\s*{[^}]*display:\s*inline-flex/);
    });

    it('uses the below-768px boundary for the pre-upgrade mobile fallback', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      const fallback = css.match(/@media \(max-width: calc\(768px - 0\.02px\)\)\s*{([\s\S]*?)\n {2}\}/)?.[1];
      expect(fallback).toMatch(/:host\(:not\(\[mobile-layout\]\)\)\s+\.aside-start-cluster/);
      expect(fallback).toMatch(/:host\(:not\(\[mobile-layout\]\)\)\s+\.menu-toggle\s*{[^}]*display:\s*inline-flex/);
    });

    it('lets the main grid track shrink while its inner region owns scrolling', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/main\s*{[^}]*min-width:\s*0/);
      expect(css).toMatch(/main\s*{[^}]*overflow:\s*hidden/);
      expect(css).toMatch(/\.main-scroller\s*{[^}]*overflow-x:\s*clip/);
      expect(css).toMatch(/\.main-scroller\s*{[^}]*overflow-y:\s*auto/);
    });

    it('keeps the desktop aside flush with its column edge (no scrollbar gutter)', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      const baseAsideRule = css.match(/(?<![\w-\]"])aside\s*{[^}]*}/)?.[0];
      expect(baseAsideRule).toBeTruthy();
      expect(baseAsideRule).not.toMatch(/scrollbar-gutter:\s*stable/);
    });

    it('hides aside scrollbars and applies the shared scroll fade mask', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/aside\s*{[^}]*scrollbar-width:\s*none/);
      expect(css).toMatch(/aside\s*{[^}]*mask-image:\s*var\(--ds-scroll-fade-mask\)/);
      expect(css).toMatch(/aside::-webkit-scrollbar\s*{[^}]*display:\s*none/);
    });

    it('reserves balanced gutters around the edge-aligned main scroller', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/\.main-scroller\s*{[^}]*scrollbar-gutter:\s*stable\s+both-edges/);
    });

    it('pads the page header and content instead of the scroller', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/\.page-header\s*{[^}]*padding-inline:\s*var\(--ds-page-shell-page-padding-inline\)/);
      expect(css).toMatch(/\.main-content\s*{[^}]*padding:\s*var\(--ds-page-shell-page-padding-block\)/);
      expect(css).not.toMatch(/main\s*{[^}]*padding:/);
      expect(css).toContain('@media (max-width: calc(1024px - 0.02px))');
      expect(css).toContain('--ds-page-shell-page-padding-block: var(--ds-space-4)');
      expect(css).toContain('--ds-page-shell-page-padding-inline: var(--ds-space-4)');
    });
  });
});
