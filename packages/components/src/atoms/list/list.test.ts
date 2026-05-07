import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsList } from './list.js';
import { DsListItem } from './list-item.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-list')) {
    customElements.define('ds-list', DsList);
  }
  if (!customElements.get('ds-list-item')) {
    customElements.define('ds-list-item', DsListItem);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-list>', () => {
  it('renders a ul with role list and the bordered variant by default', async () => {
    const el = await mount<DsList>(`
      <ds-list>
        <ds-list-item>One</ds-list-item>
        <ds-list-item>Two</ds-list-item>
      </ds-list>
    `);
    const ul = el.shadowRoot!.querySelector('ul')!;
    expect(ul.getAttribute('role')).toBe('list');
    expect(el.getAttribute('variant')).toBe('bordered');
  });

  it('reflects the plain variant', async () => {
    const el = await mount<DsList>('<ds-list variant="plain"></ds-list>');
    expect(el.getAttribute('variant')).toBe('plain');
  });
});

describe('<ds-list-item>', () => {
  it('exposes leading, default and trailing slots', async () => {
    const el = await mount<DsListItem>(`
      <ds-list-item>
        <span slot="leading">L</span>
        body
        <span slot="trailing">T</span>
      </ds-list-item>
    `);
    const slots = el.shadowRoot!.querySelectorAll('slot');
    const names = Array.from(slots).map((s) => s.getAttribute('name') ?? 'default');
    expect(names).toContain('leading');
    expect(names).toContain('trailing');
    expect(names).toContain('default');
  });
});
