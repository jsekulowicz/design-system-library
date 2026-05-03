import { beforeEach, describe, expect, it } from 'vitest';
import type { DsColorPickerSwatch } from './color-picker-swatch.js';
import type { DsColorPickerSwatchGroup } from './color-picker-swatch-group.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const OPTIONS = [
  { value: '#0ea5e9', label: 'Ocean' },
  { value: '#f97316', label: 'Sunset', disabled: true },
  { value: '#7c3aed', label: 'Violet' },
];

async function mountGroup(
  props: Partial<DsColorPickerSwatchGroup> = {},
): Promise<DsColorPickerSwatchGroup> {
  return mountWithProps<DsColorPickerSwatchGroup>(
    '<ds-color-picker-swatch-group></ds-color-picker-swatch-group>',
    { options: OPTIONS, ...props },
    'ds-color-picker-swatch-group',
  );
}

function getSwatches(el: DsColorPickerSwatchGroup): DsColorPickerSwatch[] {
  return Array.from(el.shadowRoot!.querySelectorAll<DsColorPickerSwatch>('ds-color-picker-swatch'));
}

function keydown(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

beforeEach(() => {
  resetTestDom();
});

describe('<ds-color-picker-swatch-group>', () => {
  it('renders normalized swatches as a radiogroup', async () => {
    const el = await mountGroup({ value: '#7C3AED' });
    const group = el.shadowRoot!.querySelector('[role="radiogroup"]')!;

    expect(group).toBeTruthy();
    expect(getSwatches(el)[2].selected).toBe(true);
    expect(getSwatches(el)[0].value).toBe('#0EA5E9');
  });

  it('emits the selected swatch value', async () => {
    const el = await mountGroup();
    const events: CustomEvent[] = [];
    el.addEventListener('ds-color-picker-swatch-group-select', (event) => {
      events.push(event as CustomEvent);
    });

    getSwatches(el)[2].click();

    expect(events[0]?.detail).toEqual({ value: '#7C3AED' });
  });

  it('moves roving focus through enabled swatches', async () => {
    const el = await mountGroup();

    getSwatches(el)[0].focus();
    keydown(getSwatches(el)[0], 'ArrowRight');
    await el.updateComplete;

    expect(el.shadowRoot!.activeElement).toBe(getSwatches(el)[2]);
  });
});
