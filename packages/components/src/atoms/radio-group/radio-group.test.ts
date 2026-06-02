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

  async function mountGroup(value = ''): Promise<DsRadioGroup> {
    const el = await mount<DsRadioGroup>(`
      <ds-radio-group label="Plan" name="plan">
        <ds-radio radiovalue="basic">Basic</ds-radio>
        <ds-radio radiovalue="pro">Pro</ds-radio>
        <ds-radio radiovalue="team">Team</ds-radio>
      </ds-radio-group>
    `);
    if (value) el.value = value;
    await el.updateComplete;
    el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
    await settle(el);
    return el;
  }

  async function settle(el: DsRadioGroup): Promise<void> {
    await el.updateComplete;
    await Promise.all(
      Array.from(el.querySelectorAll<DsRadio>('ds-radio')).map((radio) => radio.updateComplete),
    );
  }

  function tabIndexes(el: DsRadioGroup): (string | null)[] {
    return Array.from(el.querySelectorAll<DsRadio>('ds-radio')).map((radio) =>
      radio.shadowRoot!.querySelector('input')!.getAttribute('tabindex'),
    );
  }

  function pressKey(el: DsRadioGroup, key: string): void {
    el.shadowRoot!.querySelector('.fieldset')!.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
  }

  it('keeps a single tab stop on the selected radio (roving tabindex)', async () => {
    const el = await mountGroup('pro');
    expect(tabIndexes(el)).toEqual(['-1', '0', '-1']);
  });

  it('falls back the tab stop to the first radio when nothing is selected', async () => {
    const el = await mountGroup('');
    expect(tabIndexes(el)).toEqual(['0', '-1', '-1']);
  });

  it('moves selection and the tab stop with ArrowDown (selection follows focus)', async () => {
    const el = await mountGroup('basic');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    pressKey(el, 'ArrowDown');
    await settle(el);

    expect(el.value).toBe('pro');
    expect(events.at(-1)?.detail).toEqual({ value: 'pro' });
    expect(tabIndexes(el)).toEqual(['-1', '0', '-1']);
  });

  it('wraps to the last radio with ArrowUp from the first', async () => {
    const el = await mountGroup('basic');
    pressKey(el, 'ArrowUp');
    await settle(el);
    expect(el.value).toBe('team');
  });

  it('jumps to first/last with Home and End', async () => {
    const el = await mountGroup('pro');
    pressKey(el, 'End');
    await settle(el);
    expect(el.value).toBe('team');
    pressKey(el, 'Home');
    await settle(el);
    expect(el.value).toBe('basic');
  });

  it('ignores arrow keys when the group is disabled', async () => {
    const el = await mountGroup('pro');
    el.disabled = true;
    await settle(el);
    pressKey(el, 'ArrowDown');
    await settle(el);
    expect(el.value).toBe('pro');
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
