import { describe, expect, it } from 'vitest';
import { selectCommonStyles } from './select.common-styles.js';

describe('selectCommonStyles', () => {
  it('fits one selected tile inside each configured control size', () => {
    expect(selectCommonStyles.cssText).toMatch(
      /padding:\s*max\(1px,\s*calc\(\(var\(--ds-select-size\)\s*-\s*30px\)\s*\/\s*2\)\)/,
    );
  });
});
