import { describe, it, expect } from 'vitest';
import { space } from './spacing.js';

const REM_IN_PX = 16;

function remToPx(value: string): number {
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
  it('every step is a multiple of 4px so layouts snap to a single grid', () => {
    for (const [name, value] of Object.entries(space)) {
      const px = remToPx(value);
      expect(px % 4, `space[${name}] = ${value} (${px}px) is not a multiple of 4`).toBe(0);
    }
  });

  it('every non-zero step is expressed in rem so it scales with the user root font size', () => {
    for (const [name, value] of Object.entries(space)) {
      if (value === '0') {
        continue;
      }
      expect(value, `space[${name}] should be a rem value`).toMatch(/rem$/);
    }
  });

  it('the step number matches the scale ratio (space[N] = N × 4px)', () => {
    for (const [name, value] of Object.entries(space)) {
      const n = Number(name);
      if (!Number.isFinite(n)) {
        continue;
      }
      expect(remToPx(value), `space[${name}] should equal ${n * 4}px`).toBe(n * 4);
    }
  });
});
