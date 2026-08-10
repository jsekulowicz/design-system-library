import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsTextField } from '../atoms/text-field/text-field.js';
import '../atoms/text-field/define.js';
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
  it('holds the row open on a field with nothing to say', async () => {
    const el = await mount<DsTextField>('<ds-text-field label="Email"></ds-text-field>');

    expect(footer(el)).not.toBeNull();
    expect(footer(el)!.querySelector('.subtext-spacer')).not.toBeNull();
  });

  it('swaps the spacer for the error without adding a row', async () => {
    const el = await mount<DsTextField>('<ds-text-field label="Email" error="Required"></ds-text-field>');
    el.invalid = true;
    await el.updateComplete;

    expect(footer(el)!.querySelector('.subtext-spacer')).toBeNull();
    expect(footer(el)!.querySelector('.error')?.textContent).toContain('Required');
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
      'min-block-size: calc(var(--ds-font-size-body-sm) * var(--ds-line-height-normal))',
    );
  });

  it('lets a dense layout drop the reserved row', () => {
    expect(formFieldStyles.cssText).toMatch(/:host\(\[no-message-space\]\) \.subtext-spacer\s*{[^}]*display: none/s);
  });
});
