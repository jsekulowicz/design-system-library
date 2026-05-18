import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsFooter } from './footer.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-footer')) {
    customElements.define('ds-footer', DsFooter);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-footer>', () => {
  it('renders a native <footer> element', async () => {
    const el = await mount<DsFooter>('<ds-footer></ds-footer>');
    const footer = el.shadowRoot!.querySelector('footer');
    expect(footer).not.toBeNull();
  });

  it('exposes start, middle, and end slots', async () => {
    const el = await mount<DsFooter>('<ds-footer></ds-footer>');
    expect(el.shadowRoot!.querySelector('slot[name="start"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot[name="end"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot:not([name])')).not.toBeNull();
  });

  it('routes slotted content to the correct regions', async () => {
    const el = await mount<DsFooter>(
      '<ds-footer><span slot="start" data-test="s">©</span><span slot="end" data-test="e">end</span></ds-footer>',
    );
    const startSlot = el.shadowRoot!.querySelector('[part="start"] slot') as HTMLSlotElement;
    const endSlot = el.shadowRoot!.querySelector('[part="end"] slot') as HTMLSlotElement;
    const startNodes = startSlot.assignedNodes({ flatten: true }).filter((n) => n.nodeType === 1);
    const endNodes = endSlot.assignedNodes({ flatten: true }).filter((n) => n.nodeType === 1);
    expect((startNodes[0] as HTMLElement).getAttribute('data-test')).toBe('s');
    expect((endNodes[0] as HTMLElement).getAttribute('data-test')).toBe('e');
  });

  it('uses a fixed 36px chrome height on footer and 16px inline padding on the inner content wrapper', () => {
    const css = (DsFooter as unknown as { styles: { cssText: string }[] }).styles
      .map((s) => s.cssText)
      .join('\n');
    // Full-width chrome (height + border-top) lives on footer itself.
    expect(css).toMatch(/footer\s*{[^}]*height:\s*36px/);
    // The inner wrapper holds the 16px symmetric padding and centers
    // start / middle / end — its width is capped by the optional
    // --ds-footer-content-max-width custom property.
    expect(css).toMatch(/\.inner\s*{[^}]*padding-inline:\s*var\(--ds-space-4\)/);
    expect(css).toMatch(/\.inner\s*{[^}]*max-width:\s*var\(--ds-footer-content-max-width/);
  });
});
