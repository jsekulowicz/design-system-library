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

  it('reserves exactly one line, measured from the tokens', () => {
    expect(formFieldStyles.cssText).toContain(
      'min-block-size: calc(var(--ds-font-size-body-sm) * var(--ds-line-height-none))',
    );
  });

  // Both must track the same token, or the taller one sets the row height.
  it('sizes the message text and its icon off the same step', () => {
    expect(formFieldStyles.cssText).toMatch(/\.error\s*{[^}]*line-height: var\(--ds-line-height-none\)/s);
    expect(formFieldStyles.cssText).toMatch(/\.error-icon\s*{[^}]*width: 1em/s);
    expect(formFieldStyles.cssText).not.toMatch(/\.error-icon\s*{[^}]*width: 1rem/s);
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
