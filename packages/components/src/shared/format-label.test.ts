import { describe, expect, it } from 'vitest';
import { formatLabel } from './format-label.js';

describe('formatLabel', () => {
  it('substitutes every named placeholder it has a value for', () => {
    expect(formatLabel('{done} of {total}', { done: 1, total: 'two' })).toBe('1 of two');
  });

  it('leaves a placeholder it has no value for in place', () => {
    expect(formatLabel('{done} of {total}', { done: 1 })).toBe('1 of {total}');
  });

  it('leaves a placeholder named after an inherited object member in place', () => {
    expect(formatLabel('{constructor} {toString}', { done: 1 })).toBe('{constructor} {toString}');
  });

  it('substitutes a value that is itself brace-shaped without recursing', () => {
    expect(formatLabel('{done}', { done: '{done}' })).toBe('{done}');
  });
});
