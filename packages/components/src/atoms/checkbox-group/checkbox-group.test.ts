import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsCheckboxGroup } from './checkbox-group.js';
import { DsCheckbox } from '../checkbox/checkbox.js';
import './define.js';
import '../checkbox/define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-checkbox-group')) {
    customElements.define('ds-checkbox-group', DsCheckboxGroup);
  }
  if (!customElements.get('ds-checkbox')) {
    customElements.define('ds-checkbox', DsCheckbox);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-checkbox-group>', () => {
  it('warns when label is missing', async () => {
    const warnings: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => warnings.push(args);
    try {
      await mount<DsCheckboxGroup>('<ds-checkbox-group></ds-checkbox-group>');
      expect(warnings.some((args) => String(args[0]).includes('label'))).toBe(true);
    } finally {
      console.warn = original;
    }
  });

  it('wires child attributes and syncs checked state from value', async () => {
    const el = await mount<DsCheckboxGroup>(`
      <ds-checkbox-group label="Features" name="feature" required disabled>
        <ds-checkbox checkboxvalue="a">A</ds-checkbox>
        <ds-checkbox checkboxvalue="b">B</ds-checkbox>
      </ds-checkbox-group>
    `);
    const slot = el.shadowRoot!.querySelector('slot')!;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;

    const checkboxes = Array.from(el.querySelectorAll<DsCheckbox>('ds-checkbox'));
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0].getAttribute('name')).toBe('feature');
    expect(checkboxes[0].hasAttribute('required')).toBe(true);
    expect(checkboxes[0].hasAttribute('disabled')).toBe(true);

    el.value = ['a'];
    await el.updateComplete;
    expect(checkboxes[0].hasAttribute('checked')).toBe(true);
    expect(checkboxes[1].hasAttribute('checked')).toBe(false);

    el.required = false;
    el.disabled = false;
    await el.updateComplete;
    expect(checkboxes[0].hasAttribute('required')).toBe(false);
    expect(checkboxes[0].hasAttribute('disabled')).toBe(false);
  });

  it('collects selected values on child ds-change and emits group ds-change', async () => {
    const el = await mount<DsCheckboxGroup>(`
      <ds-checkbox-group label="Features">
        <ds-checkbox checkboxvalue="a">A</ds-checkbox>
        <ds-checkbox checkboxvalue="b">B</ds-checkbox>
      </ds-checkbox-group>
    `);
    const checkboxes = Array.from(el.querySelectorAll<DsCheckbox>('ds-checkbox'));
    checkboxes[0].checked = true;
    checkboxes[1].checked = false;
    el.invalid = true;

    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    checkboxes[0].dispatchEvent(new CustomEvent('ds-change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toEqual(['a']);
    expect(el.invalid).toBe(false);
    expect(events.at(-1)?.detail).toEqual({ values: ['a'] });
  });

  it('syncs checked state from preselected values on slotchange', async () => {
    const el = await mount<DsCheckboxGroup>(`
      <ds-checkbox-group label="Features">
        <ds-checkbox checkboxvalue="a">A</ds-checkbox>
        <ds-checkbox checkboxvalue="b">B</ds-checkbox>
      </ds-checkbox-group>
    `);
    el.value = ['b'];
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;

    const checkboxes = Array.from(el.querySelectorAll<DsCheckbox>('ds-checkbox'));
    expect(checkboxes[0].hasAttribute('checked')).toBe(false);
    expect(checkboxes[1].hasAttribute('checked')).toBe(true);
  });

  it('ignores ds-change events dispatched by the group itself', async () => {
    const el = await mount<DsCheckboxGroup>(`
      <ds-checkbox-group label="Features">
        <ds-checkbox checkboxvalue="a">A</ds-checkbox>
      </ds-checkbox-group>
    `);
    el.value = ['a'];
    await el.updateComplete;

    el.dispatchEvent(new CustomEvent('ds-change', { bubbles: true, composed: true, detail: { values: ['b'] } }));
    await el.updateComplete;

    expect(el.value).toEqual(['a']);
  });

  it('handles slotchange with empty values and undefined checkbox metadata', async () => {
    const el = await mount<DsCheckboxGroup>(`
      <ds-checkbox-group label="Features">
        <ds-checkbox>A</ds-checkbox>
      </ds-checkbox-group>
    `);
    const checkbox = el.querySelector<DsCheckbox>('ds-checkbox') as DsCheckbox & { checkboxValue?: string };
    checkbox.checkboxValue = undefined;
    el.value = [];
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
    slot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;

    expect(checkbox.hasAttribute('checked')).toBe(false);
  });
});
