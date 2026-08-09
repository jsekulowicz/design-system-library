import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DsFieldset } from './fieldset.js';
import { fieldsetStyles } from './fieldset.styles.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

describe('<ds-fieldset>', () => {
  it('renders the label as a legend on a native fieldset', async () => {
    const el = await mount<DsFieldset>('<ds-fieldset label="Difficulty"><span>min</span></ds-fieldset>');

    const legend = el.shadowRoot!.querySelector('legend[part="legend"]')!;
    expect(el.shadowRoot!.querySelector('fieldset[part="fieldset"]')).not.toBeNull();
    expect(legend.textContent).toContain('Difficulty');
  });

  it('marks a required group in the legend', async () => {
    const el = await mount<DsFieldset>('<ds-fieldset label="Difficulty" required></ds-fieldset>');

    const marker = el.shadowRoot!.querySelector('legend .required')!;
    expect(marker.textContent).toContain('*');
    expect(marker.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders the description, and swaps it for the error when invalid', async () => {
    const el = await mount<DsFieldset>(
      '<ds-fieldset label="Difficulty" description="1 is the easiest."></ds-fieldset>',
    );
    expect(el.shadowRoot!.textContent).toContain('1 is the easiest.');

    el.error = 'Pick a range.';
    el.invalid = true;
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain('Pick a range.');
  });

  it('lays the controls out in a wrapping row by default', async () => {
    expect(fieldsetStyles.cssText).toMatch(/\.items\s*{[^}]*flex-wrap:\s*wrap/s);
    expect(fieldsetStyles.cssText).toMatch(
      /:host\(\[orientation='vertical'\]\) \.items\s*{[^}]*flex-direction:\s*column/s,
    );
  });

  it('warns when no label is given', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await mount<DsFieldset>('<ds-fieldset></ds-fieldset>');

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ds-fieldset'));
    warn.mockRestore();
  });
});
