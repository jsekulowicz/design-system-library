import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsTextField } from './text-field.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-text-field')) {
    customElements.define('ds-text-field', DsTextField);
  }
});

beforeEach(() => {
  resetTestDom();
});

function input(el: DsTextField): HTMLInputElement {
  return el.shadowRoot!.querySelector('input') as HTMLInputElement;
}

function counter(el: DsTextField): HTMLElement | null {
  return el.shadowRoot!.querySelector('.char-count');
}

describe('<ds-text-field> character counter', () => {
  it('renders the current value length and maxLength when enabled', async () => {
    const el = await mount<DsTextField>('<ds-text-field char-count max-length="15"></ds-text-field>');

    expect(counter(el)?.textContent).toBe('0/15');

    input(el).value = 'hello';
    input(el).dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;

    expect(counter(el)?.textContent).toBe('5/15');
  });

  it('stays hidden unless both charCount and maxLength are set', async () => {
    const noToggle = await mount<DsTextField>('<ds-text-field max-length="15"></ds-text-field>');
    const noLimit = await mount<DsTextField>('<ds-text-field char-count></ds-text-field>');

    expect(counter(noToggle)).toBeNull();
    expect(counter(noLimit)).toBeNull();
  });
});
