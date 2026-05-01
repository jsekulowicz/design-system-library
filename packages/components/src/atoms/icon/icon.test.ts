import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsIcon, getIcon, registerIcon } from './icon.js';
import './define.js';
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
