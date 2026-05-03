import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsColorPicker } from './color-picker.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  const proto = DsColorPicker.prototype as unknown as Record<string, (value: string | null) => void>;
  proto['setAriaLabel'] = () => {};
  proto['setAriaDescription'] = () => {};
});

const COLORS = [
  { value: '#0ea5e9', label: 'Ocean' },
  { value: '#22c55e', label: 'Leaf' },
  { value: '#7c3aed', label: 'Violet' },
  { value: '#f97316', label: 'Sunset', disabled: true },
];

async function mountColorPicker(props: Partial<DsColorPicker> = {}): Promise<DsColorPicker> {
  return mountWithProps<DsColorPicker>(
    '<ds-color-picker label="Accent"></ds-color-picker>',
    { colors: COLORS, ...props },
    'ds-color-picker',
  );
}

function getTrigger(el: DsColorPicker): HTMLButtonElement {
  return el.shadowRoot!.querySelector('#trigger')!;
}

function getPanel(el: DsColorPicker): HTMLElement | null {
  return el.shadowRoot!.querySelector('.panel');
}

function getSwatches(el: DsColorPicker): HTMLButtonElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.swatch'));
}

function keydown(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

async function openPicker(el: DsColorPicker): Promise<void> {
  getTrigger(el).click();
  await el.updateComplete;
}

function clickDsButton(el: DsColorPicker, text: string): void {
  const buttons = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>('ds-button'));
  const button = buttons.find((item) => item.textContent?.trim() === text);
  const inner = button?.shadowRoot?.querySelector<HTMLButtonElement>('button');
  if (!inner) {
    throw new Error(`Button "${text}" not found`);
  }
  inner.click();
}

beforeEach(() => {
  resetTestDom();
});

describe('<ds-color-picker>', () => {
  it('normalizes short and lowercase Hex RGB values', async () => {
    const el = await mountColorPicker({ value: '#abc' });
    expect(el.value).toBe('#AABBCC');

    el.value = '#12abef';
    await el.updateComplete;

    expect(el.value).toBe('#12ABEF');
  });

  it('rejects unsupported color formats', async () => {
    const el = await mountColorPicker();
    el.value = 'red';
    await el.updateComplete;

    expect(el.value).toBe('');
    expect(el.invalid).toBe(true);
  });

  it('selects a preset color, emits ds-change, and closes the panel', async () => {
    const el = await mountColorPicker();
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    await openPicker(el);
    getSwatches(el)[1].click();
    await el.updateComplete;

    expect(el.value).toBe('#22C55E');
    expect(events[0]?.detail).toEqual({ value: '#22C55E' });
    expect(getPanel(el)).toBeNull();
  });

  it('emits ds-input for native color edits and ds-change on commit', async () => {
    const el = await mountColorPicker();
    const inputEvents: CustomEvent[] = [];
    const changeEvents: CustomEvent[] = [];
    el.addEventListener('ds-input', (event) => inputEvents.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => changeEvents.push(event as CustomEvent));

    await openPicker(el);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.native-color')!;
    input.value = '#abcdef';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(el.value).toBe('#ABCDEF');
    expect(inputEvents[0]?.detail).toEqual({ value: '#ABCDEF' });
    expect(changeEvents[0]?.detail).toEqual({ value: '#ABCDEF' });
  });

  it('validates text Hex input and accepts corrected values', async () => {
    const el = await mountColorPicker();
    await openPicker(el);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.hex-input')!;

    input.value = 'red';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;

    expect(el.invalid).toBe(true);
    expect(el.value).toBe('');

    input.value = '#0f0';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;

    expect(el.invalid).toBe(false);
    expect(el.value).toBe('#00FF00');
  });

  it('clears the value when clearable', async () => {
    const el = await mountColorPicker({ clearable: true, value: '#0ea5e9' });
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    await openPicker(el);
    clickDsButton(el, 'Clear');
    await el.updateComplete;

    expect(el.value).toBe('');
    expect(events[0]?.detail).toEqual({ value: '' });
  });

  it('reports valueMissing when required and empty', async () => {
    const el = await mountColorPicker({ required: true });

    await el.updateComplete;

    expect(el.invalid).toBe(true);
  });

  it('does not open when disabled', async () => {
    const el = await mountColorPicker({ disabled: true });
    getTrigger(el).click();
    await el.updateComplete;

    expect(getPanel(el)).toBeNull();
  });

  it('moves through swatches with roving keyboard focus and selects with Enter', async () => {
    const el = await mountColorPicker();
    await openPicker(el);

    getSwatches(el)[0].focus();
    keydown(getSwatches(el)[0], 'ArrowRight');
    await el.updateComplete;

    expect(el.shadowRoot!.activeElement).toBe(getSwatches(el)[1]);

    keydown(getSwatches(el)[1], 'End');
    await el.updateComplete;
    const focused = el.shadowRoot!.activeElement as HTMLElement;
    keydown(focused, 'Enter');
    await el.updateComplete;

    expect(el.value).toBe('#7C3AED');
  });

  it('closes on Escape and restores trigger focus', async () => {
    const el = await mountColorPicker();
    getTrigger(el).focus();
    await openPicker(el);

    keydown(getTrigger(el), 'Escape');
    await el.updateComplete;

    expect(getPanel(el)).toBeNull();
    expect(el.shadowRoot!.activeElement).toBe(getTrigger(el));
  });
});
