import { describe, it, expect } from 'vitest';
import { resolvePinnedColumns } from './pinned-columns.js';
import type { TableColumn } from './types.js';

type Row = { a: string; b: string; c: string; d: string };

const COLUMNS: readonly TableColumn<Row>[] = [
  { name: 'a', field: 'a', label: 'A' },
  { name: 'b', field: 'b', label: 'B' },
  { name: 'c', field: 'c', label: 'C' },
  { name: 'd', field: 'd', label: 'D' },
];

const order = (resolved: ReturnType<typeof resolvePinnedColumns<Row>>): string[] => resolved.map((r) => r.column.name);

describe('resolvePinnedColumns', () => {
  it('leaves order untouched and marks nothing pinned when no names are given', () => {
    const resolved = resolvePinnedColumns(COLUMNS, []);
    expect(order(resolved)).toEqual(['a', 'b', 'c', 'd']);
    expect(resolved.every((r) => r.pinIndex === null && !r.lastPinned)).toBe(true);
  });

  it('gathers pinned columns on the left without pinning the columns before them', () => {
    const resolved = resolvePinnedColumns(COLUMNS, ['c']);
    expect(order(resolved)).toEqual(['c', 'a', 'b', 'd']);
    expect(resolved[0]).toMatchObject({ pinIndex: 0, lastPinned: true });
    expect(resolved.find((r) => r.column.name === 'a')?.pinIndex).toBeNull();
  });

  it('preserves the pinned columns original relative order regardless of the array order', () => {
    const resolved = resolvePinnedColumns(COLUMNS, ['d', 'b']);
    expect(order(resolved)).toEqual(['b', 'd', 'a', 'c']);
    expect(resolved[0]).toMatchObject({ pinIndex: 0, lastPinned: false });
    expect(resolved[1]).toMatchObject({ pinIndex: 1, lastPinned: true });
  });

  it('ignores unknown names', () => {
    const resolved = resolvePinnedColumns(COLUMNS, ['nope', 'b']);
    expect(order(resolved)).toEqual(['b', 'a', 'c', 'd']);
    expect(resolved.filter((r) => r.pinIndex !== null)).toHaveLength(1);
  });

  it('ignores columns marked pinnable: false', () => {
    const columns: TableColumn<Row>[] = [
      { name: 'a', field: 'a', label: 'A' },
      { name: 'b', field: 'b', label: 'B', pinnable: false },
    ];
    const resolved = resolvePinnedColumns(columns, ['a', 'b']);
    expect(order(resolved)).toEqual(['a', 'b']);
    expect(resolved[0].pinIndex).toBe(0);
    expect(resolved[1].pinIndex).toBeNull();
  });
});
