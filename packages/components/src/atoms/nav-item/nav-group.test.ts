import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsNavGroup } from './nav-group.js';
import './define.js';

beforeAll(() => {
  if (!customElements.get('ds-nav-group')) {
    customElements.define('ds-nav-group', DsNavGroup);
  }
});

beforeEach(() => {
  document.body.innerHTML = '';
});

async function mount(attrs = ''): Promise<DsNavGroup> {
  document.body.innerHTML = `<ds-nav-group label="Workspace" ${attrs}>
    <ds-nav-item href="/projects">Projects</ds-nav-item>
  </ds-nav-group>`;
  const el = document.body.firstElementChild as DsNavGroup;
  await el.updateComplete;
  return el;
}

describe('<ds-nav-group>', () => {
  it('renders a <button> heading with the label', async () => {
    const el = await mount();
    const heading = el.shadowRoot!.querySelector('button[part="heading"]')!;
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain('Workspace');
  });

  it('starts collapsed by default and hides items', async () => {
    const el = await mount();
    expect(el.expanded).toBe(false);
    const items = el.shadowRoot!.querySelector('[part="items"]')!;
    expect(items.hasAttribute('hidden')).toBe(true);
  });

  it('shows items when expanded', async () => {
    const el = await mount('expanded');
    expect(el.expanded).toBe(true);
    const items = el.shadowRoot!.querySelector('[part="items"]')!;
    expect(items.hasAttribute('hidden')).toBe(false);
  });

  it('toggles expanded and emits ds-group-toggle on click', async () => {
    const el = await mount();
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
    const el = await mount();
    const heading = el.shadowRoot!.querySelector('button[part="heading"]')!;
    expect(heading.getAttribute('aria-expanded')).toBe('false');

    el.expanded = true;
    await el.updateComplete;
    expect(heading.getAttribute('aria-expanded')).toBe('true');
  });

  it('does not toggle when collapsible is false', async () => {
    document.body.innerHTML = `<ds-nav-group label="Workspace"></ds-nav-group>`;
    const el = document.body.firstElementChild as DsNavGroup;
    el.collapsible = false;
    await el.updateComplete;
    const heading = el.shadowRoot!.querySelector('button[part="heading"]') as HTMLButtonElement;
    heading.click();
    await el.updateComplete;
    expect(el.expanded).toBe(false);
    const items = el.shadowRoot!.querySelector('[part="items"]')!;
    expect(items.hasAttribute('hidden')).toBe(false);
  });
});
