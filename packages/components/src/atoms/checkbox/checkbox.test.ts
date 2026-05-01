import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsCheckbox } from './checkbox.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-checkbox')) {
    customElements.define('ds-checkbox', DsCheckbox);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-checkbox>', () => {
  it('syncs form value from checked and checkboxValue', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox checkboxvalue="yes">Accept</ds-checkbox>');
    el.checked = true;
    await el.updateComplete;
    expect(el.value).toBe('yes');

    el.checked = false;
    await el.updateComplete;
    expect(el.value).toBeNull();

    el.checkboxValue = '';
    el.checked = true;
    await el.updateComplete;
    expect(el.value).toBe('on');
  });

  it('marks required unchecked state as invalid and clears invalid when checked', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox required>Accept</ds-checkbox>');
    el.checkboxValue = 'accept';
    await el.updateComplete;
    expect(el.invalid).toBe(true);

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');

    el.checked = true;
    await el.updateComplete;
    expect(el.invalid).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('handles change input events and emits ds-change', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox indeterminate>Accept</ds-checkbox>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    const input = el.shadowRoot!.querySelector('input')!;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(el.indeterminate).toBe(false);
    expect(events[0]?.detail).toEqual({ checked: true });
  });

  it('toggles with Space and Enter keys only', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox>Accept</ds-checkbox>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));
    const label = el.shadowRoot!.querySelector('label')!;

    label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(false);

    label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(true);

    label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(events.map((event) => event.detail)).toEqual([{ checked: true }, { checked: false }]);
  });
});
