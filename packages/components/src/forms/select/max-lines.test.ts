import { describe, expect, it } from 'vitest';

import { countOverflowTiles } from './select.shared.js';

function tileList(offsets: number[]): HTMLElement {
  const host = document.createElement('div');
  for (const top of offsets) {
    const tile = document.createElement('span');
    tile.className = 'tile';
    tile.dataset['value'] = String(top);
    Object.defineProperty(tile, 'offsetTop', { value: top, configurable: true });
    host.appendChild(tile);
  }
  return host;
}

describe('countOverflowTiles', () => {
  // 32px per row: two tiles to a row here, three rows asked for, five rendered.
  it('counts the rows past max-lines', () => {
    expect(countOverflowTiles(tileList([0, 0, 32, 32, 64, 64, 96, 96, 128, 128]), 3)).toBe(4);
  });

  it('measures from the first tile, not from the offset parent', () => {
    const pushedDown = [41, 41, 73, 73, 105, 105, 137, 137, 169, 169];
    expect(countOverflowTiles(tileList(pushedDown), 3)).toBe(4);
  });

  it('counts nothing without max-lines', () => {
    expect(countOverflowTiles(tileList([0, 32, 64, 96]), undefined)).toBe(0);
  });
});
