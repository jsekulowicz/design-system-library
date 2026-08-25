import { beforeEach, describe, expect, it } from 'vitest';
import { mount, resetTestDom } from '../../test-utils/mount.js';
import type { DsScrollablePage } from './scrollable-page.js';
import './define.js';

beforeEach(() => {
  resetTestDom();
});

describe('<ds-scrollable-page>', () => {
  it('keeps the optional header outside the content scroller', async () => {
    const el = await mount<DsScrollablePage>(`
      <ds-scrollable-page>
        <div slot="header">Page heading</div>
        <section>Page content</section>
      </ds-scrollable-page>
    `);

    const header = el.shadowRoot!.querySelector<HTMLElement>('.header')!;
    const scroller = el.shadowRoot!.querySelector('.scroller')!;

    expect(header.hidden).toBe(false);
    expect(header.querySelector('slot[name="header"]')).not.toBeNull();
    expect(scroller.querySelector('slot:not([name])')).not.toBeNull();
    expect(scroller.contains(header)).toBe(false);
  });

  it('collapses the header region when the slot is empty', async () => {
    const el = await mount<DsScrollablePage>(`
      <ds-scrollable-page><section>Page content</section></ds-scrollable-page>
    `);

    expect(el.hasAttribute('header-empty')).toBe(true);
    expect(el.shadowRoot!.querySelector<HTMLElement>('.header')!.hidden).toBe(true);
  });
});
