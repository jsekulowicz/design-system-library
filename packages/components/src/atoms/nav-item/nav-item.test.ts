import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsNavItem } from './nav-item.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-nav-item')) {
    customElements.define('ds-nav-item', DsNavItem);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-nav-item>', () => {
  it('renders an <a> with href', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/docs">Home</ds-nav-item>');
    const link = el.shadowRoot!.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('/docs');
  });

  it('sets aria-current="page" when current', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/" current>Home</ds-nav-item>');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('omits aria-current when not current', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/">Home</ds-nav-item>');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-current')).toBeNull();
  });

  it('reflects current attribute on the host', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/" current>Home</ds-nav-item>');
    expect(el.hasAttribute('current')).toBe(true);
  });

  it('keeps the link focusable and blocks navigation when disabled', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/" disabled>Home</ds-nav-item>');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-disabled')).toBe('true');

    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(link);

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });

  it('forwards target and rel to the <a>', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="https://example.com" target="_blank" rel="noopener">Home</ds-nav-item>',
    );
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');
  });

  it('exposes role="listitem" on the host', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/">Home</ds-nav-item>');
    expect(el.getAttribute('role')).toBe('listitem');
  });

  it('renders both icon and label slots', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/">Home</ds-nav-item>');
    expect(el.shadowRoot!.querySelector('slot[name="icon"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('[part="label"] slot:not([name])')).not.toBeNull();
  });

  it('stretches the control when rendered inside a nav group', () => {
    const css = (DsNavItem as unknown as { styles: { cssText: string }[] }).styles
      .map(style => style.cssText)
      .join('\n');
    expect(css).toMatch(
      /:host\(\[role='listitem'\]:not\(\[compact\]\)\):host-context\(ds-nav-group\) \.nav-control\s*{[^}]*width: 100%;[^}]*padding-inline-start: var\(--ds-space-5\);/s,
    );
  });

  it('reflects the compact attribute on the host', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact><ds-icon slot="icon" name="home"></ds-icon>Home</ds-nav-item>',
    );
    expect(el.compact).toBe(true);
    expect(el.hasAttribute('compact')).toBe(true);
  });

  it('sets aria-label on the link to the slotted text in compact mode', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact><span slot="icon">*</span>Documentation</ds-nav-item>',
    );
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-label')).toBe('Documentation');
  });

  it('sets aria-label on disabled compact link content', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact disabled><span slot="icon">*</span>Documentation</ds-nav-item>',
    );
    const slot = el.shadowRoot!.querySelector('[part="label"] slot') as HTMLSlotElement;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    const link = el.shadowRoot!.querySelector('[part="link"]') as HTMLElement;
    expect(link.getAttribute('aria-label')).toBe('Documentation');
  });

  it('renders a focusable loading state and blocks navigation', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" loading><span slot="icon">*</span>Documentation</ds-nav-item>',
    );
    const link = el.shadowRoot!.querySelector('a')!;

    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot!.querySelector('.spinner')).not.toBeNull();

    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(link);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });

  it('does not set aria-label in non-compact mode', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/">Home</ds-nav-item>');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-label')).toBeNull();
  });

  it('allows the compact tooltip to open on keyboard focus', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact><span slot="icon">*</span>Documentation</ds-nav-item>',
    );
    const tooltip = el.shadowRoot!.querySelector('ds-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip!.hasAttribute('hover-only')).toBe(false);
    expect(tooltip!.getAttribute('delay')).toBe('1000');
  });

  it('configures the compact tooltip delay', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact compact-hover-tooltip-delay="250"><span slot="icon">*</span>Documentation</ds-nav-item>',
    );
    const tooltip = el.shadowRoot!.querySelector('ds-tooltip');
    expect(el.compactHoverTooltipDelay).toBe(250);
    expect(tooltip!.getAttribute('delay')).toBe('250');
  });

  it('renders rich compact tooltip content with the label as fallback', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact><span slot="icon">*</span>Quick play<span slot="tooltip"><strong>Quick play</strong><br>Uses saved preferences.</span></ds-nav-item>',
    );
    const slot = el.shadowRoot!.querySelector('slot[name="tooltip"]') as HTMLSlotElement;

    expect(slot.assignedElements()[0]?.querySelector('strong')?.textContent).toBe('Quick play');
    expect(slot.assignedElements()[0]?.textContent).toContain('Uses saved preferences.');

    const fallback = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact><span slot="icon">*</span>Documentation</ds-nav-item>',
    );
    const fallbackSlot = fallback.shadowRoot!.querySelector('slot[name="tooltip"]')!;
    expect(fallbackSlot.textContent).toBe('Documentation');
  });

  it('logs a console.error when compact is set without an icon', async () => {
    const errors: unknown[][] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args);
    };
    try {
      await mount<DsNavItem>('<ds-nav-item href="/" compact>No icon here</ds-nav-item>');
      expect(errors.some((args) => String(args[0]).includes('compact mode requires'))).toBe(true);
    } finally {
      console.error = original;
    }
  });

  it('handles missing icon slot lookup safely', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/">Home</ds-nav-item>');
    const originalError = console.error;
    console.error = () => {};
    try {
      const root = el.shadowRoot as ShadowRoot & {
        querySelector: (selectors: string) => Element | null;
      };
      const original = root.querySelector.bind(root);
      root.querySelector = ((selectors: string) => {
        if (selectors === 'slot[name="icon"]') {
          return null;
        }
        return original(selectors);
      }) as typeof root.querySelector;

      el.compact = true;
      await el.updateComplete;
      expect(el.hasAttribute('compact')).toBe(true);
    } finally {
      console.error = originalError;
    }
  });

  it('handles slotted nodes with null textContent', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/">Home</ds-nav-item>');
    const slot = el.shadowRoot!.querySelector('[part="label"] slot') as HTMLSlotElement & {
      assignedNodes: (options?: AssignedNodesOptions) => Node[];
    };
    const original = slot.assignedNodes.bind(slot);
    slot.assignedNodes = () => [{ textContent: null } as unknown as Node];
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    slot.assignedNodes = original;
    expect(el.shadowRoot!.querySelector('[part="label"]')).not.toBeNull();
  });
});
