import { describe, it, expect } from 'vitest';
import { resolvePinnedColumns } from './pinned-columns.js';
import type { TableColumn } from './types.js';

interface Row {
  a: string;
  b: string;
  c: string;
  d: string;
}

const COLUMNS: readonly TableColumn<Row>[] = [
  { name: 'a', field: 'a', label: 'A' },
  { name: 'b', field: 'b', label: 'B' },
  { name: 'c', field: 'c', label: 'C' },
  { name: 'd', field: 'd', label: 'D' },
];

function getColumnOrder(resolved: ReturnType<typeof resolvePinnedColumns<Row>>): string[] {
  return resolved.map((entry) => entry.column.name);
}

describe('resolvePinnedColumns', () => {
  it('leaves order untouched and marks nothing pinned when no names are given', () => {
    const resolved = resolvePinnedColumns(COLUMNS, []);
    expect(getColumnOrder(resolved)).toEqual(['a', 'b', 'c', 'd']);
    expect(resolved.every((entry) => entry.indexInPinnedRegion === null && !entry.lastPinned)).toBe(true);
  });

  it('gathers pinned columns on the left without pinning the columns before them', () => {
    const resolved = resolvePinnedColumns(COLUMNS, ['c']);
    expect(getColumnOrder(resolved)).toEqual(['c', 'a', 'b', 'd']);
    expect(resolved[0]).toMatchObject({ indexInPinnedRegion: 0, lastPinned: true });
    expect(resolved.find((entry) => entry.column.name === 'a')?.indexInPinnedRegion).toBeNull();
  });

  it('preserves the pinned columns original relative order regardless of the array order', () => {
    const resolved = resolvePinnedColumns(COLUMNS, ['d', 'b']);
    expect(getColumnOrder(resolved)).toEqual(['b', 'd', 'a', 'c']);
    expect(resolved[0]).toMatchObject({ indexInPinnedRegion: 0, lastPinned: false });
    expect(resolved[1]).toMatchObject({ indexInPinnedRegion: 1, lastPinned: true });
  });

  it('ignores unknown names', () => {
    const resolved = resolvePinnedColumns(COLUMNS, ['nope', 'b']);
    expect(getColumnOrder(resolved)).toEqual(['b', 'a', 'c', 'd']);
    expect(resolved.filter((entry) => entry.indexInPinnedRegion !== null)).toHaveLength(1);
  });

  it('ignores columns marked pinnable: false', () => {
    const columns: TableColumn<Row>[] = [
      { name: 'a', field: 'a', label: 'A' },
      { name: 'b', field: 'b', label: 'B', pinnable: false },
    ];
    const resolved = resolvePinnedColumns(columns, ['a', 'b']);
    expect(getColumnOrder(resolved)).toEqual(['a', 'b']);
    expect(resolved[0].indexInPinnedRegion).toBe(0);
    expect(resolved[1].indexInPinnedRegion).toBeNull();
  });
});
