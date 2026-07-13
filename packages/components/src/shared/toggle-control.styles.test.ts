import { describe, expect, it } from 'vitest';
import { formFieldStyles } from './form-field.js';
import { toggleControlStyles } from './toggle-control.styles.js';

describe('toggle control typography', () => {
  it('uses the medium font size for checkbox and radio option labels', () => {
    expect(toggleControlStyles.cssText).toContain('font-size: var(--ds-font-size-md)');
    expect(toggleControlStyles.cssText).not.toContain('font-size: var(--ds-font-size-sm)');
  });

  it('keeps labels above grouped fields at the small font size', () => {
    expect(formFieldStyles.cssText).toMatch(
      /\.label\s*{[^}]*font-size: var\(--ds-font-size-sm\)/s,
    );
  });
});
