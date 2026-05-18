import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsTopBar } from './top-bar.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-top-bar')) {
    customElements.define('ds-top-bar', DsTopBar);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-top-bar>', () => {
  it('renders a <nav> landmark with default aria-label', async () => {
    const el = await mount<DsTopBar>(`
      <ds-top-bar>
        <strong slot="brand">Brand</strong>
        <button slot="actions">Sign in</button>
      </ds-top-bar>
    `);
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Primary');
  });

  it('honors a custom label', async () => {
    const el = await mount<DsTopBar>('<ds-top-bar label="Tertiary"></ds-top-bar>');
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Tertiary');
  });

  it('exposes only brand and actions slots', async () => {
    const el = await mount<DsTopBar>(`
      <ds-top-bar>
        <strong slot="brand">Brand</strong>
        <button slot="actions">Sign in</button>
      </ds-top-bar>
    `);
    expect(el.shadowRoot!.querySelector('slot[name="brand"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot[name="actions"]')).not.toBeNull();
    // No default slot — the bar intentionally does not own primary nav links.
    expect(el.shadowRoot!.querySelector('slot:not([name])')).toBeNull();
  });

  it('uses a fixed 48px chrome height on nav and 16px inline padding on the inner content wrapper', () => {
    const css = (DsTopBar as unknown as { styles: { cssText: string }[] }).styles
      .map((s) => s.cssText)
      .join('\n');
    // Full-width chrome (height + border-bottom + bg) lives on nav itself.
    expect(css).toMatch(/nav\s*{[^}]*height:\s*48px/);
    // The inner wrapper holds the 16px symmetric padding and centers
    // brand + actions horizontally — its width is capped by the
    // optional --ds-top-bar-content-max-width custom property.
    expect(css).toMatch(/\.inner\s*{[^}]*padding-inline:\s*var\(--ds-space-4\)/);
    expect(css).toMatch(/\.inner\s*{[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.inner\s*{[^}]*max-width:\s*var\(--ds-top-bar-content-max-width/);
  });
});
