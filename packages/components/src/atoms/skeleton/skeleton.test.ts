import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSkeleton } from './skeleton.js';
import { mount, mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-skeleton')) {
    customElements.define('ds-skeleton', DsSkeleton);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-skeleton>', () => {
  it('renders one decorative item by default', async () => {
    const el = await mount<DsSkeleton>('<ds-skeleton></ds-skeleton>');
    expect(el.shadowRoot!.querySelectorAll('[part="item"]')).toHaveLength(1);
    expect(el.shadowRoot!.querySelector('.stack')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders multiple text lines with a shorter last line', async () => {
    const el = await mountWithProps<DsSkeleton>('<ds-skeleton></ds-skeleton>', { lines: 3 });
    const items = el.shadowRoot!.querySelectorAll<HTMLElement>('[part="item"]');
    expect(items).toHaveLength(3);
    expect(items[2].getAttribute('style')).toContain('--ds-skeleton-item-width: 72%');
  });

  it('applies custom dimensions through CSS properties', async () => {
    const el = await mountWithProps<DsSkeleton>('<ds-skeleton></ds-skeleton>', {
      variant: 'rectangle',
      width: '12rem',
      height: '4rem',
    });
    const item = el.shadowRoot!.querySelector<HTMLElement>('[part="item"]')!;
    expect(el.variant).toBe('rectangle');
    expect(el.style.getPropertyValue('--ds-skeleton-width')).toBe('12rem');
    expect(el.style.getPropertyValue('--ds-skeleton-height')).toBe('4rem');
    expect(item.getAttribute('style')).toContain('--ds-skeleton-item-width: 12rem');
  });

  it('keeps circle placeholders square from their responsive width', () => {
    const css = (DsSkeleton as unknown as { styles: { cssText: string }[] }).styles
      .map(style => style.cssText)
      .join('\n');
    expect(css).toContain(":host([variant='circle']) .item");
    expect(css).toContain('aspect-ratio: 1');
  });
});
