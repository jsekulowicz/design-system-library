import type { ResolvedColumn, TableColumn, TableRow } from './types.js';

// Gathers pinned columns into a contiguous left region, preserving each group's
// original relative order. Unknown names and `pinnable: false` columns are ignored.
export function resolvePinnedColumns<T extends TableRow>(
  columns: readonly TableColumn<T>[],
  pinnedNames: readonly string[],
): ResolvedColumn<T>[] {
  const pinnedSet = new Set(pinnedNames);
  const isPinned = (column: TableColumn<T>): boolean =>
    pinnedSet.has(column.name) && column.pinnable !== false;

  const pinned = columns.filter(isPinned);
  const rest = columns.filter(column => !isPinned(column));
  const lastPinnedName = pinned.at(-1)?.name;

  return [...pinned, ...rest].map(column => {
    const index = pinned.indexOf(column);
    return {
      column,
      pinIndex: index >= 0 ? index : null,
      lastPinned: column.name === lastPinnedName,
    };
  });
}
