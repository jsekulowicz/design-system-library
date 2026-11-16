import { describe, it, expect } from 'vitest';
import { space } from './spacing.js';

const REM_IN_PX = 16;
const LAST_CONTIGUOUS_STEP = 10;

function convertRemToPx(value: string): number {
  if (value === '0') {
    return 0;
  }
  const match = /^(-?\d*\.?\d+)rem$/.exec(value);
  if (!match) {
    throw new Error(`Expected a rem value (or 0), got "${value}"`);
  }
  return Number(match[1]) * REM_IN_PX;
}

describe('space tokens', () => {
  it('put every step on a multiple of 4px so layouts snap to a single grid', () => {
    for (const [name, value] of Object.entries(space)) {
      const pixels = convertRemToPx(value);
      expect(pixels % 4, `space[${name}] = ${value} (${pixels}px) is not a multiple of 4`).toBe(0);
    }
  });

  it('express every non-zero step in rem so it scales with the user root font size', () => {
    for (const [name, value] of Object.entries(space)) {
      if (value === '0') {
        continue;
      }
      expect(value, `space[${name}] should be a rem value`).toMatch(/rem$/);
    }
  });

  it('match each step number to the scale ratio, space[N] = N × 4px', () => {
    for (const [name, value] of Object.entries(space)) {
      const step = Number(name);
      if (!Number.isFinite(step)) {
        continue;
      }
      expect(convertRemToPx(value), `space[${name}] should equal ${step * 4}px`).toBe(step * 4);
    }
  });

  it('has a step for every 4px up to space-10, where control and row heights live', () => {
    for (let step = 0; step <= LAST_CONTIGUOUS_STEP; step++) {
      expect(space, `space[${step}] is missing from the contiguous range`).toHaveProperty(String(step));
    }
  });
});
