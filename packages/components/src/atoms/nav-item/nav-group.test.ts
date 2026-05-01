import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsNavGroup } from './nav-group.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-nav-group')) {
    customElements.define('ds-nav-group', DsNavGroup);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-nav-group>', () => {
  it('renders a <button> heading with the label', async () => {
    const el = await mount<DsNavGroup>(`
      <ds-nav-group label="Workspace">
        <ds-nav-item href="/projects">Projects</ds-nav-item>
      </ds-nav-group>
    `);
    const heading = el.shadowRoot!.querySelector('button[part="heading"]')!;
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain('Workspace');
  });

  it('starts collapsed by default and hides items', async () => {
    const el = await mount<DsNavGroup>(`
      <ds-nav-group label="Workspace">
        <ds-nav-item href="/projects">Projects</ds-nav-item>
      </ds-nav-group>
    `);
    expect(el.expanded).toBe(false);
    const items = el.shadowRoot!.querySelector('[part="items"]')!;
    expect(items.hasAttribute('hidden')).toBe(true);
  });

  it('shows items when expanded', async () => {
    const el = await mount<DsNavGroup>(`
      <ds-nav-group label="Workspace" expanded>
        <ds-nav-item href="/projects">Projects</ds-nav-item>
      </ds-nav-group>
    `);
    expect(el.expanded).toBe(true);
    const items = el.shadowRoot!.querySelector('[part="items"]')!;
    expect(items.hasAttribute('hidden')).toBe(false);
  });

  it('toggles expanded and emits ds-group-toggle on click', async () => {
    const el = await mount<DsNavGroup>(`
      <ds-nav-group label="Workspace">
        <ds-nav-item href="/projects">Projects</ds-nav-item>
      </ds-nav-group>
    `);
    let received: { expanded: boolean } | null = null;
    el.addEventListener('ds-group-toggle', (event) => {
      received = (event as CustomEvent<{ expanded: boolean }>).detail;
    });
    const heading = el.shadowRoot!.querySelector('button[part="heading"]') as HTMLButtonElement;
    heading.click();
    await el.updateComplete;
    expect(el.expanded).toBe(true);
    expect(received).toEqual({ expanded: true });

    heading.click();
    await el.updateComplete;
    expect(el.expanded).toBe(false);
  });

  it('reflects aria-expanded on the heading', async () => {
    const el = await mount<DsNavGroup>(`
      <ds-nav-group label="Workspace">
        <ds-nav-item href="/projects">Projects</ds-nav-item>
      </ds-nav-group>
    `);
    const heading = el.shadowRoot!.querySelector('button[part="heading"]')!;
    expect(heading.getAttribute('aria-expanded')).toBe('false');

    el.expanded = true;
    await el.updateComplete;
    expect(heading.getAttribute('aria-expanded')).toBe('true');
  });

  it('does not toggle when collapsible is false', async () => {
    const el = await mount<DsNavGroup>('<ds-nav-group label="Workspace"></ds-nav-group>');
    el.collapsible = false;
    await el.updateComplete;
    const heading = el.shadowRoot!.querySelector('button[part="heading"]') as HTMLButtonElement;
    heading.click();
    await el.updateComplete;
    expect(el.expanded).toBe(false);
    const items = el.shadowRoot!.querySelector('[part="items"]')!;
    expect(items.hasAttribute('hidden')).toBe(false);
  });

  it('reflects the compact attribute and sets aria-label on the heading', async () => {
    const el = await mount<DsNavGroup>(
      '<ds-nav-group label="Workspace" compact><span slot="icon">*</span></ds-nav-group>',
    );
    expect(el.compact).toBe(true);
    expect(el.hasAttribute('compact')).toBe(true);
    const heading = el.shadowRoot!.querySelector('button[part="heading"]')!;
    expect(heading.getAttribute('aria-label')).toBe('Workspace');
  });

  it('enables hover-only tooltip mode in compact variant', async () => {
    const el = await mount<DsNavGroup>(
      '<ds-nav-group label="Workspace" compact><span slot="icon">*</span></ds-nav-group>',
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
      await mount<DsNavGroup>('<ds-nav-group label="Workspace" compact></ds-nav-group>');
      expect(errors.some((args) => String(args[0]).includes('compact mode requires'))).toBe(true);
    } finally {
      console.error = original;
    }
  });
});
