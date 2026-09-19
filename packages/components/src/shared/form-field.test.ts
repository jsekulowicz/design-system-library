import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsCheckbox } from '../forms/checkbox/checkbox.js';
import { DsCheckboxGroup } from '../forms/checkbox-group/checkbox-group.js';
import { DsFieldset } from '../forms/fieldset/fieldset.js';
import { DsRadioGroup } from '../forms/radio-group/radio-group.js';
import { DsRangeInput } from '../forms/range-input/range-input.js';
import { DsSearchableSelect } from '../forms/searchable-select/searchable-select.js';
import { DsSegmentedControl } from '../forms/segmented-control/segmented-control.js';
import { DsSelect } from '../forms/select/select.js';
import { DsTextArea } from '../forms/text-area/text-area.js';
import { DsTextField } from '../forms/text-field/text-field.js';
import { DsColorPicker } from '../forms/color-picker/color-picker.js';
import '../forms/checkbox-group/define.js';
import '../forms/color-picker/define.js';
import '../forms/fieldset/define.js';
import '../forms/radio-group/define.js';
import '../forms/range-input/define.js';
import '../forms/searchable-select/define.js';
import '../forms/segmented-control/define.js';
import '../forms/select/define.js';
import '../forms/text-area/define.js';
import '../forms/text-field/define.js';
import { formFieldStyles } from './form-field.js';
import { mount, resetTestDom } from '../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-text-field')) {
    customElements.define('ds-text-field', DsTextField);
  }
});

beforeEach(() => {
  resetTestDom();
});

function footer(el: DsTextField): HTMLElement | null {
  return el.shadowRoot!.querySelector('.field-footer');
}

describe('field message space', () => {
  it('renders no message row by default', async () => {
    const el = await mount<DsTextField>('<ds-text-field label="Email"></ds-text-field>');

    expect(footer(el)).toBeNull();
  });

  it('holds the row open when requested', async () => {
    const el = await mount<DsTextField>('<ds-text-field label="Email" message-space></ds-text-field>');

    expect(footer(el)?.querySelector('.subtext-spacer')).not.toBeNull();
  });

  it('renders an error without reserved space', async () => {
    const el = await mount<DsTextField>('<ds-text-field label="Email" error="Required"></ds-text-field>');
    el.invalid = true;
    await el.updateComplete;

    expect(footer(el)?.querySelector('.subtext-spacer')).toBeNull();
    expect(footer(el)?.querySelector('.error')?.textContent).toContain('Required');
  });

  it('swaps the description for the error in place', async () => {
    const el = await mount<DsTextField>(
      '<ds-text-field label="Email" description="Work address" error="Required"></ds-text-field>',
    );
    expect(footer(el)!.querySelector('.description')).not.toBeNull();

    el.invalid = true;
    await el.updateComplete;

    expect(footer(el)!.querySelector('.description')).toBeNull();
    expect(footer(el)!.querySelector('.error')).not.toBeNull();
  });

  // The spacer carries no text, so it can only be floored by a line box it
  // sizes itself - hence the shared typography rather than a floor alone.
  it('reserves one line on the message row, spacer included', () => {
    expect(formFieldStyles.cssText).toMatch(
      /\.description,\s*\.error,\s*\.warning,\s*\.subtext-spacer\s*{[^}]*font-size: var\(--ds-font-size-body-sm\)[^}]*line-height: var\(--ds-line-height-none\)[^}]*min-block-size: 1lh/,
    );
  });

  it('never multiplies a line-height token, which resolves to a length', () => {
    expect(formFieldStyles.cssText).not.toMatch(/\*\s*var\(--ds-line-height-/);
  });

  // Both must track the same token, or the taller one sets the row height.
  it('sizes the message text and its icon off the same step', () => {
    expect(formFieldStyles.cssText).toMatch(
      /\.description,\s*\.error,\s*\.warning,\s*\.subtext-spacer\s*{[^}]*line-height: var\(--ds-line-height-none\)/,
    );
    expect(formFieldStyles.cssText).toMatch(/\.error-icon,\s*\.warning-icon\s*{[^}]*width: 1em/s);
    expect(formFieldStyles.cssText).not.toMatch(/-icon\s*{[^}]*width: 1rem/s);
  });

  it.each([
    DsTextField,
    DsTextArea,
    DsRangeInput,
    DsSelect,
    DsSearchableSelect,
    DsRadioGroup,
    DsCheckboxGroup,
    DsSegmentedControl,
    DsCheckbox,
    DsFieldset,
    DsColorPicker,
  ])('exposes the reflected message-space property on %s', (component) => {
    expect(component.elementProperties.get('messageSpace')).toMatchObject({
      attribute: 'message-space',
      reflect: true,
      type: Boolean,
    });
  });
});

describe('the message row a consumer can fill themselves', () => {
  it.each(['description', 'warning', 'error'])('takes slotted content in place of its %s text', async (kind) => {
    const el = await mount<DsTextField>(
      `<ds-text-field label="Word" ${kind}="Plain text"><span slot="${kind}">Rich text</span></ds-text-field>`,
    );
    el.invalid = true;
    await el.updateComplete;
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${kind}"]`);

    expect(slot).not.toBeNull();
    expect(slot!.assignedNodes()[0]?.textContent).toBe('Rich text');
  });

  it.each(['description', 'warning', 'error'])('falls back to the %s text nobody slotted over', async (kind) => {
    const el = await mount<DsTextField>(`<ds-text-field label="Word" ${kind}="Plain text"></ds-text-field>`);
    el.invalid = true;
    await el.updateComplete;
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${kind}"]`);

    expect(slot!.assignedNodes().length).toBe(0);
    expect(slot!.textContent).toBe('Plain text');
  });

  it.each([
    ['<ds-select label="Word" description="A note"></ds-select>', 'ds-select', '#trigger'],
    [
      '<ds-searchable-select label="Word" description="A note"></ds-searchable-select>',
      'ds-searchable-select',
      '#search-input',
    ],
    ['<ds-text-field label="Word" description="A note"></ds-text-field>', 'ds-text-field', 'input'],
    ['<ds-text-area label="Word" description="A note"></ds-text-area>', 'ds-text-area', 'textarea'],
    ['<ds-range-input label="Word" description="A note"></ds-range-input>', 'ds-range-input', 'input'],
    ['<ds-color-picker label="Word" description="A note"></ds-color-picker>', 'ds-color-picker', '#trigger'],
  ])('hands %s its own focus on, now that the shadow root delegates none', async (markup, tag, control) => {
    const el = await mount<HTMLElement>(markup, tag);
    el.focus();

    expect((el.constructor as typeof DsSelect).shadowRootOptions.delegatesFocus).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector(control));
  });

  it.each([
    ['<ds-select label="Word" required></ds-select>', 'ds-select', '#trigger'],
    ['<ds-searchable-select label="Word" required></ds-searchable-select>', 'ds-searchable-select', '#search-input'],
  ])('anchors what %s reports invalid to its control, which a form focuses', async (markup, tag, control) => {
    const anchors: (HTMLElement | undefined)[] = [];
    const prototype = customElements.get(tag)!.prototype as { setValidity: unknown };
    const original = prototype.setValidity;
    prototype.setValidity = function (_flags: unknown, _message: unknown, anchor?: HTMLElement) {
      anchors.push(anchor);
    };
    const el = await mount<HTMLElement>(markup, tag);
    prototype.setValidity = original;

    expect(anchors.at(-1)).toBe(el.shadowRoot!.querySelector(control));
  });

  it.each([
    ['<ds-select label="Word"></ds-select>', 'ds-select'],
    ['<ds-searchable-select label="Word"></ds-searchable-select>', 'ds-searchable-select'],
  ])('opens %s from a click on its label, the way the control under it would', async (markup, tag) => {
    const el = await mount<HTMLElement & { _open: boolean }>(markup, tag);
    el.shadowRoot!.querySelector<HTMLElement>('label.label')!.click();

    expect(el._open).toBe(true);
  });

  it.each([
    ['<ds-select label="Word"></ds-select>', 'ds-select', '#trigger'],
    ['<ds-searchable-select label="Word"></ds-searchable-select>', 'ds-searchable-select', '#search-input'],
  ])('focuses what %s opens, for a click that missed the control itself', async (markup, tag, control) => {
    const el = await mount<HTMLElement & { _open: boolean }>(markup, tag);
    el.shadowRoot!.querySelector<HTMLElement>('.trigger')!.click();

    expect(el._open).toBe(true);
    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector(control));
  });

  it('leaves a disabled select shut when its label is clicked', async () => {
    const el = await mount<HTMLElement & { _open: boolean }>(
      '<ds-select label="Word" disabled></ds-select>',
      'ds-select',
    );
    el.shadowRoot!.querySelector<HTMLElement>('label.label')!.click();

    expect(el._open).toBe(false);
  });

  it.each([
    ['<ds-text-field label="Word" description="A note"></ds-text-field>', 'ds-text-field', 'input'],
    ['<ds-range-input label="Word" description="A note"></ds-range-input>', 'ds-range-input', 'input'],
  ])('focuses what %s holds when the click lands on the box around it', async (markup, tag, control) => {
    const el = await mount<HTMLElement>(markup, tag);
    el.shadowRoot!.querySelector<HTMLElement>('.wrap')!.click();

    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector(control));
  });

  it('leaves an adornment that takes its own clicks holding them', async () => {
    const el = await mount<HTMLElement>(
      '<ds-text-field label="Password"><button slot="trailing">Show</button></ds-text-field>',
      'ds-text-field',
    );
    el.querySelector('button')!.click();

    expect(el.shadowRoot!.activeElement).toBeNull();
  });

  it('focuses the color picker a click on its label names, which a ds-button cannot be', async () => {
    const el = await mount<HTMLElement>('<ds-color-picker label="Accent"></ds-color-picker>', 'ds-color-picker');
    el.shadowRoot!.querySelector<HTMLElement>('label.label')!.click();

    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector('#trigger'));
  });

  it('sits its icon on the first line of a message that wraps', () => {
    expect(formFieldStyles.cssText).toMatch(/\.error,\s*\.warning\s*{[^}]*align-items: flex-start/);
    expect(formFieldStyles.cssText).toMatch(/\.error-icon,\s*\.warning-icon\s*{[^}]*margin-block-start/s);
  });
});

describe('the field label a consumer can style', () => {
  it.each([
    '<ds-text-field label="Email"></ds-text-field>',
    '<ds-text-area label="Reply"></ds-text-area>',
    '<ds-range-input label="Brightness"></ds-range-input>',
    '<ds-select label="Country"></ds-select>',
    '<ds-searchable-select label="Country"></ds-searchable-select>',
    '<ds-segmented-control label="View"></ds-segmented-control>',
    '<ds-color-picker label="Accent"></ds-color-picker>',
  ])('is a part on %s', async (markup) => {
    const el = await mount<HTMLElement>(markup);

    expect(el.shadowRoot!.querySelector('label.label')?.getAttribute('part')).toBe('label');
  });

  it.each([
    '<ds-fieldset label="Difficulty"></ds-fieldset>',
    '<ds-radio-group label="Size"></ds-radio-group>',
    '<ds-checkbox-group label="Tags"></ds-checkbox-group>',
  ])('reaches the legend of %s under the same name, without dropping its own', async (markup) => {
    const el = await mount<HTMLElement>(markup);
    const legend = el.shadowRoot!.querySelector('legend.label');

    expect(legend!.matches('[part~="label"]')).toBe(true);
    expect(legend!.matches('[part~="legend"]')).toBe(true);
  });

  it('leaves the char counter out of the part, since it is not the label', async () => {
    const el = await mount<HTMLElement>('<ds-text-field label="Email" max-length="20" char-count></ds-text-field>');
    const part = el.shadowRoot!.querySelector('[part="label"]');

    expect(el.shadowRoot!.querySelector('.char-count')?.textContent).toBe('0/20');
    expect(part!.querySelector('.char-count')).toBeNull();
    expect(part!.textContent?.trim()).toBe('Email');
  });
});
