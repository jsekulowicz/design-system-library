import { describe, expect, it } from 'vitest';

import { fontSize } from './typography.js';

describe('fontSize', () => {
  it('provides non-overlapping body and heading scales', () => {
    expect(fontSize['body-sm']).toBe('0.75rem');
    expect(fontSize['body-md']).toBe('0.875rem');
    expect(fontSize['body-lg']).toBe('1rem');
    expect(fontSize['heading-xs']).toBe('1.125rem');
    expect(fontSize['heading-sm']).toBe('1.25rem');
  });
});
