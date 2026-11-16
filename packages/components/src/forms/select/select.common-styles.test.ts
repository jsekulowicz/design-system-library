import { describe, expect, it } from 'vitest';
import { getDeclarationsOf } from '../../shared/css-rules.test-helpers.js';
import { selectCommonStyles } from './select.common-styles.js';

describe('selectCommonStyles', () => {
  it('fits one selected tile inside each configured control size', () => {
    expect(selectCommonStyles.cssText).toMatch(
      /padding:\s*max\(\s*1px,\s*calc\(\(var\(--ds-select-size\)\s*-\s*\(var\(--ds-select-tile-height\)\s*\+\s*2px\)\)\s*\/\s*2\)\s*\)/,
    );
  });
});

describe('the select listbox styles', () => {
  it('lay the listbox out in flow below the trigger where the Popover API is missing', () => {
    expect(getDeclarationsOf(selectCommonStyles, '.listbox')).toContain('position: absolute');
  });

  it('give the listbox a thin scrollbar on a transparent track, since the default one painted over its rounded corners', () => {
    const listbox = getDeclarationsOf(selectCommonStyles, '.listbox');
    expect(listbox).toContain('scrollbar-width: thin');
    expect(listbox).not.toContain('scrollbar-gutter');
  });

  it('anchor the open popover to the trigger at its width, so long options wrap and scrolling needs no script', () => {
    const popover = getDeclarationsOf(selectCommonStyles, '.listbox[popover]:popover-open');
    expect(popover).toContain('position-anchor: --ds-select-trigger');
    expect(popover).toContain('width: anchor-size(width)');
    expect(popover).toContain('position-try-fallbacks: flip-block');
  });
});
