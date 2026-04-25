import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSidenav } from './sidenav.js';
import './define.js';

beforeAll(() => {
  if (!customElements.get('ds-sidenav')) {
    customElements.define('ds-sidenav', DsSidenav);
  }
});

beforeEach(() => {
  document.body.innerHTML = '';
});

async function mount(attrs = ''): Promise<DsSidenav> {
  document.body.innerHTML = `<ds-sidenav ${attrs}>
    <strong slot="header">Forma</strong>
    <a href="/">Home</a>
    <span slot="footer">Help</span>
  </ds-sidenav>`;
  const el = document.body.firstElementChild as DsSidenav;
  await el.updateComplete;
  return el;
}

describe('<ds-sidenav>', () => {
  it('renders a <nav> with default aria-label "Secondary"', async () => {
    const el = await mount();
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Secondary');
  });

  it('exposes header, default, and footer slots', async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelector('slot[name="header"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot[name="footer"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot:not([name])')).not.toBeNull();
  });

  it('reflects the collapsed attribute on the host', async () => {
    const el = await mount('collapsed');
    expect(el.collapsed).toBe(true);
    expect(el.hasAttribute('collapsed')).toBe(true);
  });

  it('removes collapsed when the property is set false', async () => {
    const el = await mount('collapsed');
    el.collapsed = false;
    await el.updateComplete;
    expect(el.hasAttribute('collapsed')).toBe(false);
  });

  it('honors a custom label', async () => {
    document.body.innerHTML = `<ds-sidenav label="Workspace"></ds-sidenav>`;
    const el = document.body.firstElementChild as DsSidenav;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Workspace');
  });
});
