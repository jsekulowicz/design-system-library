import { beforeEach, describe, expect, it } from 'vitest';

import { countOverflowTiles } from './select.shared.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';
import type { DsSelect } from './select.js';
import type { DsSearchableSelect } from '../searchable-select/searchable-select.js';
import './define.js';
import '../searchable-select/define.js';

beforeEach(resetTestDom);

describe('the max-lines attribute', () => {
  it('reaches ds-select in its documented kebab-case form', async () => {
    const el = await mount<DsSelect>('<ds-select label="People" multiple max-lines="2"></ds-select>');
    expect(el.maxLines).toBe(2);
  });

  it('reaches ds-searchable-select too', async () => {
    const el = await mount<DsSearchableSelect>(
      '<ds-searchable-select label="People" multiple max-lines="2"></ds-searchable-select>',
    );
    expect(el.maxLines).toBe(2);
  });

  it('is undefined when unset, so the whole tile list renders', async () => {
    const el = await mount<DsSelect>('<ds-select label="People" multiple></ds-select>');
    expect(el.maxLines).toBeUndefined();
  });
});

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
