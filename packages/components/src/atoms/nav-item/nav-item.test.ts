import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsNavItem } from './nav-item.js';
import './define.js';

beforeAll(() => {
  if (!customElements.get('ds-nav-item')) {
    customElements.define('ds-nav-item', DsNavItem);
  }
});

beforeEach(() => {
  document.body.innerHTML = '';
});

async function mount(attrs = '', inner = 'Home'): Promise<DsNavItem> {
  document.body.innerHTML = `<ds-nav-item ${attrs}>${inner}</ds-nav-item>`;
  const el = document.body.firstElementChild as DsNavItem;
  await el.updateComplete;
  return el;
}

describe('<ds-nav-item>', () => {
  it('renders an <a> with href', async () => {
    const el = await mount('href="/docs"');
    const link = el.shadowRoot!.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('/docs');
  });

  it('sets aria-current="page" when current', async () => {
    const el = await mount('href="/" current');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('omits aria-current when not current', async () => {
    const el = await mount('href="/"');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('aria-current')).toBeNull();
  });

  it('reflects current attribute on the host', async () => {
    const el = await mount('href="/" current');
    expect(el.hasAttribute('current')).toBe(true);
  });

  it('renders a non-interactive <span> when disabled', async () => {
    const el = await mount('href="/" disabled');
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
    const link = el.shadowRoot!.querySelector('[part="link"]')!;
    expect(link.tagName).toBe('SPAN');
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });

  it('forwards target and rel to the <a>', async () => {
    const el = await mount('href="https://example.com" target="_blank" rel="noopener"');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');
  });

  it('exposes role="listitem" on the host', async () => {
    const el = await mount('href="/"');
    expect(el.getAttribute('role')).toBe('listitem');
  });

  it('renders both icon and label slots', async () => {
    const el = await mount('href="/"');
    expect(el.shadowRoot!.querySelector('slot[name="icon"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('[part="label"] slot:not([name])')).not.toBeNull();
  });
});
