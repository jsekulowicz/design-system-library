import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSidenav } from './sidenav.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-sidenav')) {
    customElements.define('ds-sidenav', DsSidenav);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-sidenav>', () => {
  it('renders a <nav> with default aria-label "Secondary"', async () => {
    const el = await mount<DsSidenav>(`
      <ds-sidenav>
        <strong slot="header">Forma</strong>
        <a href="/">Home</a>
        <span slot="footer">Help</span>
      </ds-sidenav>
    `);
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Secondary');
  });

  it('exposes header, default, and footer slots', async () => {
    const el = await mount<DsSidenav>(`
      <ds-sidenav>
        <strong slot="header">Forma</strong>
        <a href="/">Home</a>
        <span slot="footer">Help</span>
      </ds-sidenav>
    `);
    expect(el.shadowRoot!.querySelector('slot[name="header"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot[name="footer"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('slot:not([name])')).not.toBeNull();
  });

  it('reflects the collapsed attribute on the host', async () => {
    const el = await mount<DsSidenav>(`
      <ds-sidenav collapsed>
        <strong slot="header">Forma</strong>
        <a href="/">Home</a>
        <span slot="footer">Help</span>
      </ds-sidenav>
    `);
    expect(el.collapsed).toBe(true);
    expect(el.hasAttribute('collapsed')).toBe(true);
  });

  it('removes collapsed when the property is set false', async () => {
    const el = await mount<DsSidenav>(`
      <ds-sidenav collapsed>
        <strong slot="header">Forma</strong>
        <a href="/">Home</a>
        <span slot="footer">Help</span>
      </ds-sidenav>
    `);
    el.collapsed = false;
    await el.updateComplete;
    expect(el.hasAttribute('collapsed')).toBe(false);
  });

  it('honors a custom label', async () => {
    const el = await mount<DsSidenav>('<ds-sidenav label="Workspace"></ds-sidenav>');
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Workspace');
  });

  it('propagates collapsed -> compact to ds-nav-item and ds-nav-group children', async () => {
    const el = await mount<DsSidenav>(`
      <ds-sidenav>
        <ds-nav-item href="/">Home</ds-nav-item>
        <ds-nav-group label="Workspace">
          <ds-nav-item href="/projects">Projects</ds-nav-item>
        </ds-nav-group>
      </ds-sidenav>
    `);
    const item = el.querySelector('ds-nav-item')!;
    const group = el.querySelector('ds-nav-group')!;
    expect(item.hasAttribute('compact')).toBe(false);
    expect(group.hasAttribute('compact')).toBe(false);

    el.collapsed = true;
    await el.updateComplete;
    expect(item.hasAttribute('compact')).toBe(true);
    expect(group.hasAttribute('compact')).toBe(true);

    el.collapsed = false;
    await el.updateComplete;
    expect(item.hasAttribute('compact')).toBe(false);
    expect(group.hasAttribute('compact')).toBe(false);
  });
});
