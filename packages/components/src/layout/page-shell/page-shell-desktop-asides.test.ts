import { describe, expect, it } from 'vitest';
import { DsPageShell, forceDesktopLayout, forceMobileLayout, mount } from './page-shell.test-helpers.js';

describe('<ds-page-shell>', () => {
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

    it('toggles start aside between visible and compact', async () => {
      const el = await mount<DsPageShell>(`
        <ds-page-shell brand="Brand" aside-toggle>
          <ds-sidenav slot="aside">Navigation</ds-sidenav>
          <div>Content</div>
        </ds-page-shell>
      `);
      await forceDesktopLayout(el);
      const toggle = el.shadowRoot!.querySelector('.aside-toggle-start') as HTMLElement;
      const aside = el.querySelector<HTMLElement>('[slot="aside"]')!;
      const desktopAside = el.shadowRoot!.querySelector('aside[part="aside"]')!;
      expect(toggle.getAttribute('variant')).toBe('secondary');
      expect(toggle.getAttribute('size')).toBe('sm');
      expect(toggle.hasAttribute('square')).toBe(true);
      expect(toggle.querySelector('ds-icon')?.getAttribute('size')).toBe('lg');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.querySelector('ds-icon')?.getAttribute('name')).toBe('chevron-left');

      toggle.click();
      await el.updateComplete;
      expect(el.asideState).toBe('compact');
      expect(el.getAttribute('aside-state')).toBe('compact');
      expect(aside.hasAttribute('collapsed')).toBe(true);
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(toggle.querySelector('ds-icon')?.getAttribute('name')).toBe('chevron-right');
      expect(desktopAside.getAttribute('aria-hidden')).toBeNull();
      expect(desktopAside.hasAttribute('inert')).toBe(false);

      toggle.click();
      await el.updateComplete;
      expect(el.asideState).toBe('visible');
      expect(el.getAttribute('aside-state')).toBe('visible');
      expect(aside.hasAttribute('collapsed')).toBe(false);
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.querySelector('ds-icon')?.getAttribute('name')).toBe('chevron-left');
      expect(desktopAside.getAttribute('aria-hidden')).toBeNull();
      expect(desktopAside.hasAttribute('inert')).toBe(false);
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
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(/\.aside-toggle-rail\s*{[^}]*position:\s*absolute/);
      expect(css).toMatch(
        /\.aside-toggle-start-rail\s*{[^}]*inset-inline-end:\s*calc\(var\(--ds-size-sm\)\s*\/\s*-2\)/,
      );
      expect(css).toMatch(/:host\(\[aside-toggle\]\)\s*aside\[part=['"]aside['"]\]\s*{[^}]*padding-inline-end:/);
      expect(css).toMatch(
        /:host\(\[aside-end-toggle\]\)\s*aside\[part=['"]aside-end['"]\]\s*{[^}]*padding-inline-start:/,
      );
    });

    it('collapses asides with an animatable grid track and keeps toggle clearance', () => {
      const css = (DsPageShell as unknown as { styles: { cssText: string }[] }).styles.map((s) => s.cssText).join('\n');
      expect(css).toMatch(
        /\.aside-start-cluster,\s*\.aside-end-cluster\s*{[^}]*grid-template-columns:\s*1fr[^}]*transition:\s*grid-template-columns/s,
      );
      expect(css).toMatch(
        /:host\(\[aside-end-state='hidden'\]\)\s*\.aside-end-cluster\s*{[^}]*grid-template-columns:\s*0fr;[^}]*min-width:\s*calc\(var\(--ds-size-sm\)\s*\/\s*2\s*\+\s*var\(--ds-space-2\)\)/s,
      );
    });
  });
});
