import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsRadioGroup } from './radio-group.js';
import { DsRadio } from '../radio/radio.js';
import './define.js';
import '../radio/define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-radio-group')) {
    customElements.define('ds-radio-group', DsRadioGroup);
  }
  if (!customElements.get('ds-radio')) {
    customElements.define('ds-radio', DsRadio);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-radio-group>', () => {
  it('warns when label is missing', async () => {
    const warnings: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => warnings.push(args);
    try {
      await mount<DsRadioGroup>('<ds-radio-group></ds-radio-group>');
      expect(warnings.some((args) => String(args[0]).includes('label'))).toBe(true);
    } finally {
      console.warn = original;
    }
  });

  it('wires child attributes and syncs checked radio from value', async () => {
    const el = await mount<DsRadioGroup>(`
      <ds-radio-group label="Plan" name="plan" required disabled value="pro">
        <ds-radio radiovalue="basic">Basic</ds-radio>
        <ds-radio radiovalue="pro">Pro</ds-radio>
      </ds-radio-group>
    `);
    const slot = el.shadowRoot!.querySelector('slot')!;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;

    const radios = Array.from(el.querySelectorAll<DsRadio>('ds-radio'));
    expect(radios[0].getAttribute('name')).toBe('plan');
    expect(radios[0].hasAttribute('required')).toBe(true);
    expect(radios[0].hasAttribute('disabled')).toBe(true);
    expect(radios[0].hasAttribute('checked')).toBe(false);
    expect(radios[1].hasAttribute('checked')).toBe(true);

    el.required = false;
    el.disabled = false;
    await el.updateComplete;
    expect(radios[0].hasAttribute('required')).toBe(false);
    expect(radios[0].hasAttribute('disabled')).toBe(false);
  });

  it('updates value and emits ds-change when child radio emits', async () => {
    const el = await mount<DsRadioGroup>(`
      <ds-radio-group label="Plan">
        <ds-radio radiovalue="basic">Basic</ds-radio>
      </ds-radio-group>
    `);
    const radio = el.querySelector<DsRadio>('ds-radio')!;
    el.invalid = true;
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    radio.dispatchEvent(new CustomEvent('ds-change', { bubbles: true, composed: true, detail: { value: 'basic' } }));
    await el.updateComplete;

    expect(el.value).toBe('basic');
    expect(el.invalid).toBe(false);
    expect(events.at(-1)?.detail).toEqual({ value: 'basic' });
  });

  it('syncs checked radio from value on slotchange', async () => {
    const el = await mount<DsRadioGroup>(`
      <ds-radio-group label="Plan">
        <ds-radio radiovalue="basic">Basic</ds-radio>
        <ds-radio radiovalue="pro">Pro</ds-radio>
      </ds-radio-group>
    `);
    el.value = 'pro';
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;

    const radios = Array.from(el.querySelectorAll<DsRadio>('ds-radio'));
    expect(radios[0].hasAttribute('checked')).toBe(false);
    expect(radios[1].hasAttribute('checked')).toBe(true);
  });

  it('ignores ds-change events dispatched by the group itself', async () => {
    const el = await mount<DsRadioGroup>(`
      <ds-radio-group label="Plan">
        <ds-radio radiovalue="basic">Basic</ds-radio>
      </ds-radio-group>
    `);
    el.value = 'basic';
    await el.updateComplete;

    el.dispatchEvent(new CustomEvent('ds-change', { bubbles: true, composed: true, detail: { value: 'pro' } }));
    await el.updateComplete;

    expect(el.value).toBe('basic');
  });

  it('handles slotchange with empty value and undefined radio metadata', async () => {
    const el = await mount<DsRadioGroup>(`
      <ds-radio-group label="Plan">
        <ds-radio checked>Basic</ds-radio>
      </ds-radio-group>
    `);
    const radio = el.querySelector<DsRadio>('ds-radio') as DsRadio & { radioValue?: string };
    radio.radioValue = undefined;
    el.value = 'pro';
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;

    expect(radio.hasAttribute('checked')).toBe(false);
  });
});
