import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsBreadcrumb } from './breadcrumb.js';
import { DsBreadcrumbItem } from './breadcrumb-item.js';
import './define.js';

beforeAll(() => {
  if (!customElements.get('ds-breadcrumb')) {
    customElements.define('ds-breadcrumb', DsBreadcrumb);
  }
  if (!customElements.get('ds-breadcrumb-item')) {
    customElements.define('ds-breadcrumb-item', DsBreadcrumbItem);
  }
});

beforeEach(() => {
  document.body.innerHTML = '';
});

async function mount(inner: string): Promise<DsBreadcrumb> {
  document.body.innerHTML = `<ds-breadcrumb>${inner}</ds-breadcrumb>`;
  const el = document.body.firstElementChild as DsBreadcrumb;
  await el.updateComplete;
  await Promise.all(
    Array.from(el.querySelectorAll('ds-breadcrumb-item'))
      .map(child => (child as DsBreadcrumbItem).updateComplete),
  );
  return el;
}

function items(el: DsBreadcrumb): DsBreadcrumbItem[] {
  return Array.from(el.querySelectorAll('ds-breadcrumb-item')) as DsBreadcrumbItem[];
}

describe('<ds-breadcrumb>', () => {
  it('renders a <nav> with aria-label="Breadcrumb" by default', async () => {
    const el = await mount('<ds-breadcrumb-item>Home</ds-breadcrumb-item>');
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('honors the label attribute', async () => {
    document.body.innerHTML = '<ds-breadcrumb label="Section"><ds-breadcrumb-item>Home</ds-breadcrumb-item></ds-breadcrumb>';
    const el = document.body.firstElementChild as DsBreadcrumb;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Section');
  });

  it('marks only the last item as last + current', async () => {
    const el = await mount(`
      <ds-breadcrumb-item href="/">Home</ds-breadcrumb-item>
      <ds-breadcrumb-item href="/p">Products</ds-breadcrumb-item>
      <ds-breadcrumb-item>Widget</ds-breadcrumb-item>
    `);
    const [a, b, c] = items(el);
    expect(a.hasAttribute('last')).toBe(false);
    expect(a.hasAttribute('current')).toBe(false);
    expect(b.hasAttribute('last')).toBe(false);
    expect(b.hasAttribute('current')).toBe(false);
    expect(c.hasAttribute('last')).toBe(true);
    expect(c.hasAttribute('current')).toBe(true);
  });

  it('re-syncs when items are added', async () => {
    const el = await mount(`
      <ds-breadcrumb-item href="/">Home</ds-breadcrumb-item>
      <ds-breadcrumb-item>Page</ds-breadcrumb-item>
    `);
    const [first, second] = items(el);
    expect(second.hasAttribute('last')).toBe(true);

    const newItem = document.createElement('ds-breadcrumb-item') as DsBreadcrumbItem;
    newItem.textContent = 'Deeper';
    el.appendChild(newItem);
    await el.updateComplete;
    await newItem.updateComplete;

    expect(first.hasAttribute('last')).toBe(false);
    expect(second.hasAttribute('last')).toBe(false);
    expect(newItem.hasAttribute('last')).toBe(true);
    expect(newItem.hasAttribute('current')).toBe(true);
  });

  it('renders an <ol> with role="list"', async () => {
    const el = await mount('<ds-breadcrumb-item>Home</ds-breadcrumb-item>');
    const ol = el.shadowRoot!.querySelector('ol')!;
    expect(ol.getAttribute('role')).toBe('list');
  });
});
