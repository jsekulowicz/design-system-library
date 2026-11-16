import { describe, expect, it } from 'vitest';
import { resolveRovingTarget } from './roving-focus.js';

describe('the roving target', () => {
  it('starts from the first index when the current index is -1 because nothing is focused yet', () => {
    expect(resolveRovingTarget({ key: 'ArrowRight', currentIndex: -1, count: 3 })).toBe(0);
  });

  it('wraps past either end and skips indices that cannot take the selection', () => {
    const isDisabled = (index: number): boolean => index === 0;
    expect(resolveRovingTarget({ key: 'ArrowDown', currentIndex: 2, count: 3, isDisabled })).toBe(1);
  });

  it('answers null for a key that does not navigate, so the caller leaves the event untouched', () => {
    expect(resolveRovingTarget({ key: 'a', currentIndex: 0, count: 3 })).toBeNull();
  });

  it('listens to both arrow axes unless an orientation narrows them', () => {
    expect(resolveRovingTarget({ key: 'ArrowDown', currentIndex: 0, count: 3 })).toBe(1);
    expect(resolveRovingTarget({ key: 'ArrowDown', currentIndex: 0, count: 3, orientation: 'horizontal' })).toBeNull();
  });
});
