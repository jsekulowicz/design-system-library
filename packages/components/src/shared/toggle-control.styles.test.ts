import { describe, expect, it } from 'vitest';
import { formFieldStyles } from './form-field.js';
import { toggleControlStyles } from './toggle-control.styles.js';

describe('toggle control typography', () => {
  it('uses the medium font size for checkbox and radio option labels', () => {
    expect(toggleControlStyles.cssText).toContain('font-size: var(--ds-font-size-body-lg)');
    expect(toggleControlStyles.cssText).not.toContain('font-size: var(--ds-font-size-body-md)');
  });

  it('leaves descender room in the label line box so the host box contains it', () => {
    expect(toggleControlStyles.cssText).toMatch(
      /label\s*{[^}]*line-height: var\(--ds-line-height-snug\)/s,
    );
    expect(toggleControlStyles.cssText).not.toMatch(/label\s*{[^}]*line-height: 1;/s);
  });

  it('takes the host baseline from the label text, not the control box', () => {
    expect(toggleControlStyles.cssText).toMatch(
      /\[part~='label'\]\s*{[^}]*align-self: baseline/s,
    );
  });

  it('keeps labels above grouped fields at the small font size', () => {
    expect(formFieldStyles.cssText).toMatch(
      /\.label\s*{[^}]*font-size: var\(--ds-font-size-body-md\)/s,
    );
  });
});
