import type { TemplateResult } from 'lit';

export type TableColumnAlign = 'left' | 'right' | 'center';

export type TableResponsiveMode = 'stack' | 'scroll';

export type TableSortDirection = 'asc' | 'desc' | null;

export type TableRow = Record<string, unknown>;

export interface TableColumn<T extends TableRow = TableRow> {
  name: string;
  field: keyof T & string;
  label: string;
  align?: TableColumnAlign;
  sortable?: boolean;
  render?: (row: T, index: number) => TemplateResult | string | number | null;
  width?: string;
  /** Set `false` to exclude the column from the pinned region. */
  pinnable?: boolean;
}

// `pinIndex` is the 0-based position within the pinned region, or null when not pinned.
export interface ResolvedColumn<T extends TableRow = TableRow> {
  column: TableColumn<T>;
  pinIndex: number | null;
  lastPinned: boolean;
}

export interface TableSortState {
  name: string;
  direction: TableSortDirection;
}

export interface TableRowClickDetail<T extends TableRow = TableRow> {
  row: T;
  index: number;
}

export interface TableSortDetail {
  direction: TableSortDirection;
}

export interface TablePageChangeDetail {
  page: number;
  pageSize: number;
}

export interface TablePageSizeChangeDetail {
  pageSize: number;
  page: number;
}
