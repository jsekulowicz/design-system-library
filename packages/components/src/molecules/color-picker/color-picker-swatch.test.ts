import { beforeEach, describe, expect, it } from 'vitest';
import type { DsColorPickerSwatch } from './color-picker-swatch.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

async function mountSwatch(
  props: Partial<DsColorPickerSwatch> = {},
): Promise<DsColorPickerSwatch> {
  return mountWithProps<DsColorPickerSwatch>(
    '<ds-color-picker-swatch></ds-color-picker-swatch>',
    { value: '#7C3AED', label: 'Violet', ...props },
    'ds-color-picker-swatch',
  );
}

function keydown(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

beforeEach(() => {
  resetTestDom();
});

describe('<ds-color-picker-swatch>', () => {
  it('reflects accessible radio state', async () => {
    const el = await mountSwatch({ selected: true });

    expect(el.getAttribute('role')).toBe('radio');
    expect(el.getAttribute('aria-label')).toBe('Violet #7C3AED');
    expect(el.getAttribute('aria-checked')).toBe('true');
  });

  it('emits selection on click and keyboard activation', async () => {
    const el = await mountSwatch();
    const events: CustomEvent[] = [];
    el.addEventListener('ds-color-picker-swatch-select', (event) => {
      events.push(event as CustomEvent);
    });

    el.click();
    keydown(el, 'Enter');
    keydown(el, ' ');

    expect(events.map((event) => event.detail)).toEqual([
      { value: '#7C3AED' },
      { value: '#7C3AED' },
      { value: '#7C3AED' },
    ]);
  });

  it('does not emit when disabled', async () => {
    const el = await mountSwatch({ disabled: true });
    const events: CustomEvent[] = [];
    el.addEventListener('ds-color-picker-swatch-select', (event) => {
      events.push(event as CustomEvent);
    });

    el.click();
    keydown(el, 'Enter');

    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(events).toHaveLength(0);
  });
});
