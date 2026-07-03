import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsIcon, getIcon, registerIcon } from './icon.js';
import './define.js';
import './icons/user-circle.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-icon')) {
    customElements.define('ds-icon', DsIcon);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-icon>', () => {
  it('registers and reads icons from the registry', () => {
    registerIcon('unit-test-icon', '<svg><path d="M0 0h1v1z"/></svg>');
    expect(getIcon('unit-test-icon')).toContain('<path');
    expect(getIcon('missing-icon')).toBeUndefined();
  });

  it('registers the user-circle icon by name', () => {
    expect(getIcon('user-circle')).toContain('17.982 18.725');
  });

  it('registers generated Heroicons by package name', async () => {
    await import('./icons/academic-cap.js');
    expect(getIcon('academic-cap')).toContain('M4.26 10.147');
  });

  it('registers all generated Heroicons from the all module', async () => {
    await import('./icons/all.js');
    expect(getIcon('arrow-right')).toContain('M13.5 4.5');
  });

  it('renders slot fallback when no icon name is provided', async () => {
    const el = await mount<DsIcon>('<ds-icon>Fallback</ds-icon>');
    const span = el.shadowRoot!.querySelector('span') as HTMLSpanElement;

    expect(span.getAttribute('aria-hidden')).toBe('true');
    expect(span.getAttribute('role')).toBeNull();
    expect(el.shadowRoot!.querySelector('slot')).not.toBeNull();

    registerIcon('fallback-reset-icon', '<svg><circle cx="1" cy="1" r="1"/></svg>');
    el.name = 'fallback-reset-icon';
    await el.updateComplete;
    el.name = '';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('slot')).not.toBeNull();
  });

  it('renders registered icon markup and accessible label when name is known', async () => {
    registerIcon('known-test-icon', '<svg viewBox="0 0 1 1"><rect width="1" height="1"/></svg>');
    const el = await mount<DsIcon>('<ds-icon name="known-test-icon" label="Status icon"></ds-icon>');
    const span = el.shadowRoot!.querySelector('span') as HTMLSpanElement;

    expect(span.getAttribute('aria-hidden')).toBe('false');
    expect(span.getAttribute('role')).toBe('img');
    expect(span.getAttribute('aria-label')).toBe('Status icon');
    expect(el.shadowRoot!.innerHTML).toContain('rect');
  });

  it('uses lg as the default icon size', () => {
    const icon = new DsIcon();
    expect(icon.size).toBe('lg');
  });

  it('supports the full icon size scale', () => {
    const css = (DsIcon as unknown as { styles: { cssText: string }[] }).styles
      .map((s) => s.cssText)
      .join('\n');
    expect(css).toMatch(/:host\s*{[^}]*width:\s*1\.125rem/);
    expect(css).toMatch(/:host\(\[size='sm'\]\)\s*{[^}]*width:\s*0\.875rem/);
    expect(css).toMatch(/:host\(\[size='md'\]\)\s*{[^}]*width:\s*1rem/);
    expect(css).toMatch(/:host\(\[size='lg'\]\)\s*{[^}]*width:\s*1\.125rem/);
    expect(css).toMatch(/:host\(\[size='xl'\]\)\s*{[^}]*width:\s*1\.25rem/);
    expect(css).toMatch(/:host\(\[size='2xl'\]\)\s*{[^}]*width:\s*1\.5rem/);
    expect(css).toMatch(/:host\(\[size='3xl'\]\)\s*{[^}]*width:\s*1\.75rem/);
    expect(css).toMatch(/:host\(\[size='4xl'\]\)\s*{[^}]*width:\s*1\.875rem/);
  });

  it('warns and falls back to slot when icon name is unknown', async () => {
    const originalWarn = console.warn;
    const warns: unknown[][] = [];
    console.warn = (...args: unknown[]) => {
      warns.push(args);
    };

    try {
      const el = await mount<DsIcon>('<ds-icon name="unknown-icon">Fallback</ds-icon>');
      expect(warns.some((args) => String(args[0]).includes('unknown icon'))).toBe(true);
      expect(el.shadowRoot!.querySelector('slot')).not.toBeNull();
    } finally {
      console.warn = originalWarn;
    }
  });
});
