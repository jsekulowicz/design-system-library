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

describe('<ds-text-area>', () => {
  it('reflects input and change value updates and emits events', async () => {
    const el = await mount<DsTextArea>('<ds-text-area name="bio"></ds-text-area>');
    const inputEvents: CustomEvent[] = [];
    const changeEvents: CustomEvent[] = [];
    el.addEventListener('ds-input', (event) => inputEvents.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => changeEvents.push(event as CustomEvent));

    const input = textarea(el);
    input.value = 'first line';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = 'first line\nsecond line';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(el.value).toBe('first line\nsecond line');
    expect(inputEvents[0]?.detail).toEqual({ value: 'first line' });
    expect(changeEvents[0]?.detail).toEqual({ value: 'first line\nsecond line' });
  });

  it('does not update value or emit when disabled', async () => {
    const el = await mount<DsTextArea>('<ds-text-area disabled></ds-text-area>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-input', (event) => events.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    const input = textarea(el);
    input.value = 'blocked';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(el.value).toBeNull();
    expect(events).toHaveLength(0);
  });

  it('sizes the textarea to exactly `rows` rows, defaulting to 3', async () => {
    const def = await mount<DsTextArea>('<ds-text-area></ds-text-area>');
    expect(textarea(def).rows).toBe(3);

    const el = await mount<DsTextArea>('<ds-text-area rows="6"></ds-text-area>');
    expect(textarea(el).rows).toBe(6);
  });

  it('reflects placeholder and readonly into the inner textarea; disabled maps to readonly', async () => {
    const el = await mount<DsTextArea>(
      '<ds-text-area placeholder="Write a reply" readonly disabled></ds-text-area>',
    );
    const input = textarea(el);
    expect(input.placeholder).toBe('Write a reply');
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
  });

  it('supports an accessible input label without rendering a visible label', async () => {
    const el = await mount<DsTextArea>('<ds-text-area input-label="Reply"></ds-text-area>');
    expect(el.shadowRoot!.querySelector('label')).toBeNull();
    expect(textarea(el).getAttribute('aria-label')).toBe('Reply');
  });

  it('renders a visible label and surfaces the error when validation fails', async () => {
    const el = await mount<DsTextArea>(
      '<ds-text-area label="Bio" error="This field is required" required></ds-text-area>',
    );
    expect(el.shadowRoot!.querySelector('label')?.textContent).toContain('Bio');
    expect(el.invalid).toBe(true);
    expect(el.shadowRoot!.querySelector('.error')?.textContent).toContain('This field is required');
    expect(textarea(el).getAttribute('aria-invalid')).toBe('true');
  });
});
