import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsRangeInput } from './range-input.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-range-input')) {
    customElements.define('ds-range-input', DsRangeInput);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-range-input>', () => {
  it('updates value and emits numeric input and change events', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input name="volume"></ds-range-input>');
    const inputEvents: CustomEvent[] = [];
    const changeEvents: CustomEvent[] = [];

    el.addEventListener('ds-input', (event) => inputEvents.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => changeEvents.push(event as CustomEvent));

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = '40';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = '75';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(el.value).toBe('75');
    expect(inputEvents[0]?.detail).toEqual({ value: 40 });
    expect(changeEvents[0]?.detail).toEqual({ value: 75 });
  });

  it('does not update value or emit when disabled', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input disabled></ds-range-input>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-input', (event) => events.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = '50';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(events).toHaveLength(0);
  });

  it('reflects min, max and step onto the inner input', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input min="10" max="20" step="2"></ds-range-input>');
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('min')).toBe('10');
    expect(input.getAttribute('max')).toBe('20');
    expect(input.getAttribute('step')).toBe('2');
  });

  it('defaults the value to min and clamps an out-of-range value', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input min="10" max="20"></ds-range-input>');
    expect(el.value).toBe('10');
    expect(el.valueAsNumber).toBe(10);

    el.value = '99';
    await el.updateComplete;
    expect(el.valueAsNumber).toBe(20);
  });

  it('renders an output with the current value when show-value is set', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input show-value value="33"></ds-range-input>');
    const output = el.shadowRoot!.querySelector('output');

    expect(output).not.toBeNull();
    expect(output?.textContent?.trim()).toBe('33');
  });

  it('stays focusable when disabled and announces the disabled state', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input disabled></ds-range-input>');
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-disabled')).toBe('true');

    input.focus();
    expect(el.shadowRoot!.activeElement).toBe(input);
  });

  it('blocks keyboard and pointer interaction when disabled', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input disabled></ds-range-input>');
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

    const keydown = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    input.dispatchEvent(keydown);
    const pointerdown = new Event('pointerdown', { bubbles: true, cancelable: true });
    input.dispatchEvent(pointerdown);

    expect(keydown.defaultPrevented).toBe(true);
    expect(pointerdown.defaultPrevented).toBe(true);
  });

  it('renders label, description and invalid error state', async () => {
    const el = await mount<DsRangeInput>(
      '<ds-range-input label="Volume" description="Set the level" error="Required"></ds-range-input>',
    );
    expect(el.shadowRoot!.querySelector('.label')?.textContent).toContain('Volume');
    expect(el.shadowRoot!.querySelector('.description')?.textContent).toContain('Set the level');

    el.invalid = true;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(el.shadowRoot!.querySelector('.error')?.getAttribute('role')).toBe('alert');
    expect(el.shadowRoot!.querySelector('.error')?.textContent).toContain('Required');
  });

  it('supports an accessible input label without rendering a visible label', async () => {
    const el = await mount<DsRangeInput>('<ds-range-input input-label="Brightness"></ds-range-input>');
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('aria-label')).toBe('Brightness');
    expect(el.shadowRoot!.querySelector('.label')).toBeNull();
  });
});
