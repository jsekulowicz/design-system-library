import { describe, it, expect } from 'vitest';
import { flatten } from './flatten.js';

describe('flatten', () => {
  it('converts nested tokens into kebab-cased CSS variable map', () => {
    const result = flatten({
      color: { bgSubtle: '#fff', fg: '#000' },
      space: { 1: '4px' },
    });
    expect(result).toEqual({
      '--ds-color-bg-subtle': '#fff',
      '--ds-color-fg': '#000',
      '--ds-space-1': '4px',
    });
  });

  it('coerces numeric values to strings', () => {
    const result = flatten({ z: { base: 0, raised: 10 } });
    expect(result['--ds-z-base']).toBe('0');
    expect(result['--ds-z-raised']).toBe('10');
  });

  it('preserves hyphenated keys without duplication', () => {
    const result = flatten({ 'font-size': { sm: '14px' } });
    expect(result['--ds-font-size-sm']).toBe('14px');
  });
});
