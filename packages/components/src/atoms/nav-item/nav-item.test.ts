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

  it('renders a non-interactive <span> when disabled', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/" disabled>Home</ds-nav-item>');
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
    const link = el.shadowRoot!.querySelector('[part="link"]')!;
    expect(link.tagName).toBe('SPAN');
    expect(link.getAttribute('aria-disabled')).toBe('true');
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

  it('does not set aria-label in non-compact mode', async () => {
    const el = await mount<DsNavItem>('<ds-nav-item href="/">Home</ds-nav-item>');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-label')).toBeNull();
  });

  it('enables hover-only tooltip mode in compact variant', async () => {
    const el = await mount<DsNavItem>(
      '<ds-nav-item href="/" compact><span slot="icon">*</span>Documentation</ds-nav-item>',
    );
    const tooltip = el.shadowRoot!.querySelector('ds-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip!.hasAttribute('hover-only')).toBe(true);
    expect(tooltip!.getAttribute('delay')).toBe('2000');
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
});
