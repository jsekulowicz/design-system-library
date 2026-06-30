import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsTextArea } from './text-area.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-text-area')) {
    customElements.define('ds-text-area', DsTextArea);
  }
});

beforeEach(() => {
  resetTestDom();
});

function textarea(el: DsTextArea): HTMLTextAreaElement {
  return el.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
}

function counter(el: DsTextArea): HTMLElement | null {
  return el.shadowRoot!.querySelector('.char-count');
}

describe('<ds-text-area> character counter', () => {
  it('renders the current value length and maxLength when enabled', async () => {
    const el = await mount<DsTextArea>('<ds-text-area char-count max-length="30"></ds-text-area>');

    expect(counter(el)?.textContent).toBe('0/30');

    textarea(el).value = 'hello';
    textarea(el).dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;

    expect(counter(el)?.textContent).toBe('5/30');
  });

  it('stays hidden unless both charCount and maxLength are set', async () => {
    const noToggle = await mount<DsTextArea>('<ds-text-area max-length="30"></ds-text-area>');
    const noLimit = await mount<DsTextArea>('<ds-text-area char-count></ds-text-area>');

    expect(counter(noToggle)).toBeNull();
    expect(counter(noLimit)).toBeNull();
  });
});
