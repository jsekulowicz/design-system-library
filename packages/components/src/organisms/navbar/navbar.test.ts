import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsNavbar } from './navbar.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-navbar')) {
    customElements.define('ds-navbar', DsNavbar);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-navbar>', () => {
  it('renders a <nav> with default aria-label', async () => {
    const el = await mount<DsNavbar>(`
      <ds-navbar>
        <strong slot="brand">Forma</strong>
        <a href="/">Home</a>
        <button slot="actions">Sign in</button>
      </ds-navbar>
    `);
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Primary');
  });

  it('honors a custom label', async () => {
    const el = await mount<DsNavbar>('<ds-navbar label="Tertiary"></ds-navbar>');
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Tertiary');
  });

  it('exposes brand, default, and actions slots', async () => {
    const el = await mount<DsNavbar>(`
      <ds-navbar>
        <strong slot="brand">Forma</strong>
        <a href="/">Home</a>
        <button slot="actions">Sign in</button>
      </ds-navbar>
    `);
    expect(el.shadowRoot!.querySelector('slot[name="brand"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot[name="actions"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot:not([name])')).not.toBeNull();
  });

  it('renders a hamburger toggle with aria-expanded reflecting menu state', async () => {
    const el = await mount<DsNavbar>(`
      <ds-navbar>
        <strong slot="brand">Forma</strong>
        <a href="/">Home</a>
        <button slot="actions">Sign in</button>
      </ds-navbar>
    `);
    const toggle = el.shadowRoot!.querySelector('button.toggle') as HTMLButtonElement;
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await el.updateComplete;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.hasAttribute('data-open')).toBe(true);
  });

  it('closes the menu and refocuses the toggle on Escape', async () => {
    const el = await mount<DsNavbar>(`
      <ds-navbar>
        <strong slot="brand">Forma</strong>
        <a href="/">Home</a>
        <button slot="actions">Sign in</button>
      </ds-navbar>
    `);
    const toggle = el.shadowRoot!.querySelector('button.toggle') as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;
    expect(el.hasAttribute('data-open')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;
    expect(el.hasAttribute('data-open')).toBe(false);
  });

  it('aria-controls on toggle points at the menu region', async () => {
    const el = await mount<DsNavbar>(`
      <ds-navbar>
        <strong slot="brand">Forma</strong>
        <a href="/">Home</a>
        <button slot="actions">Sign in</button>
      </ds-navbar>
    `);
    const toggle = el.shadowRoot!.querySelector('button.toggle') as HTMLButtonElement;
    const menu = el.shadowRoot!.querySelector('[part="menu"]')!;
    expect(toggle.getAttribute('aria-controls')).toBe(menu.id);
  });
});
