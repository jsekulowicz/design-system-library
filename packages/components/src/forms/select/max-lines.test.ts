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

describe('the min-lines attribute', () => {
  it('reserves the rows on the ds-select trigger', async () => {
    const el = await mount<DsSelect>('<ds-select label="People" multiple min-lines="2"></ds-select>');
    const trigger = el.shadowRoot!.querySelector<HTMLElement>('.trigger')!;
    expect(trigger.style.getPropertyValue('--ds-select-min-lines')).toBe('2');
  });

  it('reserves the rows on the ds-searchable-select trigger too', async () => {
    const el = await mount<DsSearchableSelect>(
      '<ds-searchable-select label="People" multiple min-lines="3"></ds-searchable-select>',
    );
    const trigger = el.shadowRoot!.querySelector<HTMLElement>('.trigger')!;
    expect(trigger.style.getPropertyValue('--ds-select-min-lines')).toBe('3');
  });

  it('leaves the trigger at its natural height when unset', async () => {
    const el = await mount<DsSelect>('<ds-select label="People" multiple></ds-select>');
    expect(el.shadowRoot!.querySelector('.trigger')!.hasAttribute('style')).toBe(false);
  });
});

function tileList(offsets: number[], height = 0): HTMLElement {
  const host = document.createElement('div');
  for (const top of offsets) {
    const tile = document.createElement('span');
    tile.className = 'tile';
    tile.dataset['value'] = String(top);
    Object.defineProperty(tile, 'offsetTop', { value: top, configurable: true });
    Object.defineProperty(tile, 'offsetHeight', { value: height, configurable: true });
    host.appendChild(tile);
  }
  return host;
}

describe('countOverflowTiles', () => {
  // 32px per row: two tiles to a row here, three rows asked for, five rendered.
  it('counts the rows past max-lines', () => {
    expect(countOverflowTiles(tileList([0, 0, 32, 32, 64, 64, 96, 96, 128, 128]), 3)).toBe(4);
  });

  it('measures from the first tile, so a search input above them is not read as overflow', () => {
    const pushedDown = [41, 41, 73, 73, 105, 105, 137, 137, 169, 169];
    expect(countOverflowTiles(tileList(pushedDown), 3)).toBe(4);
  });

  it('follows taller tiles, so a consumer tile height still counts whole rows', () => {
    expect(countOverflowTiles(tileList([0, 0, 40, 40, 80, 80], 36), 2)).toBe(2);
  });

  it('counts nothing without max-lines', () => {
    expect(countOverflowTiles(tileList([0, 32, 64, 96]), undefined)).toBe(0);
  });
});
