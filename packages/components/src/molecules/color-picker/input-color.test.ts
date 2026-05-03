import { beforeEach, describe, expect, it } from 'vitest';
import type { DsColorPickerInputColor } from './input-color.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

async function mountInput(
  props: Partial<DsColorPickerInputColor> = {},
): Promise<DsColorPickerInputColor> {
  return mountWithProps<DsColorPickerInputColor>(
    '<ds-color-picker-input-color></ds-color-picker-input-color>',
    props,
    'ds-color-picker-input-color',
  );
}

beforeEach(() => {
  resetTestDom();
});

describe('<ds-color-picker-input-color>', () => {
  it('emits normalized color input and change events', async () => {
    const el = await mountInput();
    const inputEvents: CustomEvent[] = [];
    const changeEvents: CustomEvent[] = [];
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    el.addEventListener('ds-input', (event) => inputEvents.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => changeEvents.push(event as CustomEvent));

    input.value = '#abcdef';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(inputEvents[0]?.detail).toEqual({ value: '#ABCDEF' });
    expect(changeEvents[0]?.detail).toEqual({ value: '#ABCDEF' });
  });

  it('does not emit while disabled', async () => {
    const el = await mountInput({ disabled: true });
    const events: CustomEvent[] = [];
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    el.addEventListener('ds-input', (event) => events.push(event as CustomEvent));

    input.value = '#abcdef';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(events).toHaveLength(0);
  });
});
