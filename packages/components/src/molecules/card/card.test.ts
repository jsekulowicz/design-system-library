import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsCard } from './card.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-card')) {
    customElements.define('ds-card', DsCard);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-card>', () => {
  it('renders header, body, actions and footer regions', async () => {
    const el = await mount<DsCard>(`
      <ds-card>
        <span slot="eyebrow">New</span>
        <h3 slot="title">Title</h3>
        Body
        <button slot="actions">Act</button>
        <small slot="footer">Footer</small>
      </ds-card>
    `);
    const eyebrowSlot = el.shadowRoot!.querySelector('slot[name="eyebrow"]')!;
    const defaultSlot = el.shadowRoot!.querySelector('.body slot')!;
    const footerSlot = el.shadowRoot!.querySelector('slot[name="footer"]')!;
    const eyebrow = eyebrowSlot.assignedNodes({ flatten: true })[0]?.textContent?.trim();
    const body = defaultSlot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .join(' ')
      .trim();
    const footer = footerSlot.assignedNodes({ flatten: true })[0]?.textContent?.trim();
    expect(eyebrow).toBe('New');
    expect(body).toBe('Body');
    expect(footer).toBe('Footer');
  });

  it('toggles actions visibility based on actions slot content', async () => {
    const el = await mount<DsCard>('<ds-card><span slot="title">Title</span></ds-card>');
    const actions = el.shadowRoot!.querySelector('.actions')!;
    expect(actions.hasAttribute('hidden')).toBe(true);

    el.innerHTML = '<button slot="actions">Action</button>';
    await el.updateComplete;
    const slot = el.shadowRoot!.querySelector('slot[name="actions"]')!;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    expect(actions.hasAttribute('hidden')).toBe(false);
  });

  it('reflects visual variant attributes', async () => {
    const el = await mount<DsCard>('<ds-card></ds-card>');
    el.elevation = 'md';
    el.orientation = 'horizontal';
    el.interactive = true;
    await el.updateComplete;
    expect(el.getAttribute('elevation')).toBe('md');
    expect(el.getAttribute('orientation')).toBe('horizontal');
    expect(el.hasAttribute('interactive')).toBe(true);
  });
});
