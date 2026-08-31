import { describe, expect, it } from 'vitest';
import { formatLabel } from './format-label.js';

describe('formatLabel', () => {
  it('substitutes every named placeholder it has a value for', () => {
    expect(formatLabel('{a} of {b}', { a: 1, b: 'two' })).toBe('1 of two');
  });

  it('leaves a placeholder it has no value for in place', () => {
    expect(formatLabel('{a} of {b}', { a: 1 })).toBe('1 of {b}');
  });

  it('leaves a placeholder named after an inherited object member in place', () => {
    expect(formatLabel('{constructor} {toString}', { a: 1 })).toBe('{constructor} {toString}');
  });

  it('substitutes a value that is itself brace-shaped without recursing', () => {
    expect(formatLabel('{a}', { a: '{a}' })).toBe('{a}');
  });
});
