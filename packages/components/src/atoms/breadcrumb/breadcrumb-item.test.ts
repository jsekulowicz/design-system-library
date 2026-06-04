import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsBreadcrumbItem } from './breadcrumb-item.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-breadcrumb-item')) {
    customElements.define('ds-breadcrumb-item', DsBreadcrumbItem);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-breadcrumb-item>', () => {
  it('sets role="listitem" on the host', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item>Home</ds-breadcrumb-item>');
    expect(el.getAttribute('role')).toBe('listitem');
  });

  it('renders an <a> with href when not current', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item href="/home">Home</ds-breadcrumb-item>');
    const link = el.shadowRoot!.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('/home');
  });

  it('forwards target, rel, download, hreflang, type, referrerpolicy to the <a>', async () => {
    const el = await mount<DsBreadcrumbItem>(
      '<ds-breadcrumb-item href="/x" target="_blank" rel="noopener" download="file.pdf" hreflang="en" type="application/pdf" referrerpolicy="no-referrer">Home</ds-breadcrumb-item>',
    );
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');
    expect(link.getAttribute('download')).toBe('file.pdf');
    expect(link.getAttribute('hreflang')).toBe('en');
    expect(link.getAttribute('type')).toBe('application/pdf');
    expect(link.getAttribute('referrerpolicy')).toBe('no-referrer');
  });

  it('renders an <a> when current and href is present', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item href="/x" current>Here</ds-breadcrumb-item>');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('/x');
  });

  it('renders a non-link <span> when href is missing', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item>Here</ds-breadcrumb-item>');
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
    const text = el.shadowRoot!.querySelector('[part="current"]')!;
    expect(text.tagName).toBe('SPAN');
    expect(text.getAttribute('aria-current')).toBeNull();
  });

  it('sets aria-current="page" on a non-link current item', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item current>Here</ds-breadcrumb-item>');
    const text = el.shadowRoot!.querySelector('[part="current"]')!;
    expect(text.getAttribute('aria-current')).toBe('page');
  });

  it('renders a non-link <span> when href is empty', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item href="">Here</ds-breadcrumb-item>');
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="current"]')).not.toBeNull();
  });

  it('renders the chevron separator when not last', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item>Home</ds-breadcrumb-item>');
    expect(el.shadowRoot!.querySelector('[part="separator"]')).not.toBeNull();
  });

  it('omits the chevron separator when last', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item last current>Current</ds-breadcrumb-item>');
    expect(el.shadowRoot!.querySelector('[part="separator"]')).toBeNull();
  });

  it('marks the chevron aria-hidden', async () => {
    const el = await mount<DsBreadcrumbItem>('<ds-breadcrumb-item>Home</ds-breadcrumb-item>');
    const sep = el.shadowRoot!.querySelector('[part="separator"]')!;
    expect(sep.getAttribute('aria-hidden')).toBe('true');
    expect(sep.getAttribute('role')).toBe('presentation');
  });
});
