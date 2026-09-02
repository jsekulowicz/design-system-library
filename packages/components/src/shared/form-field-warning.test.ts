import { describe, expect, it } from 'vitest';

import { mountWithProps } from '../test-utils/mount.js';
import type { DsTextField } from '../forms/text-field/text-field.js';
import '../forms/text-field/define.js';

async function mount(props: Record<string, unknown>) {
  return mountWithProps<DsTextField>('<ds-text-field label="Name"></ds-text-field>', props, 'ds-text-field');
}

describe('field warning message', () => {
  it('shows above the description and below an error', async () => {
    const el = await mount({ description: 'A description', warning: 'A warning' });
    expect(el.shadowRoot!.querySelector('.warning')?.textContent).toContain('A warning');
    expect(el.shadowRoot!.querySelector('.description')).toBeNull();

    el.error = 'A problem';
    el.invalid = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.error')?.textContent).toContain('A problem');
    expect(el.shadowRoot!.querySelector('.warning')).toBeNull();
  });

  it('announces politely and leaves the field valid', async () => {
    const el = await mount({ warning: 'A warning' });
    expect(el.shadowRoot!.querySelector('.warning')?.getAttribute('role')).toBe('status');
    expect(el.invalid).toBe(false);
  });

  it('carries its own icon, not the error one', async () => {
    const el = await mount({ warning: 'A warning' });
    expect(el.shadowRoot!.querySelector('.warning .warning-icon')).not.toBeNull();

    el.error = 'A problem';
    el.invalid = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.error .error-icon')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.warning-icon')).toBeNull();
  });

  it('sits in the same row a description would, so nothing shifts', async () => {
    const withDescription = await mount({ description: 'A description' });
    const withWarning = await mount({ warning: 'A warning' });
    const row = (el: DsTextField) => el.shadowRoot!.querySelector('.field-footer')!.children.length;
    expect(row(withWarning)).toBe(row(withDescription));
  });
});
