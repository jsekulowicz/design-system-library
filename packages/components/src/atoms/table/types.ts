import type { TemplateResult } from 'lit';

export type TableColumnAlign = 'left' | 'right' | 'center';

export type TableSortDirection = 'asc' | 'desc' | null;

export type TableRow = Record<string, unknown>;

export type TableColumn<T extends TableRow = TableRow> = {
  name: string;
  field: keyof T & string;
  label: string;
  align?: TableColumnAlign;
  sortable?: boolean;
  render?: (row: T, index: number) => TemplateResult | string | number | null;
  width?: string;
};

export type TableSortState = { name: string; direction: TableSortDirection };

export type TableRowClickDetail<T extends TableRow = TableRow> = {
  row: T;
  index: number;
};

export type TableSortDetail = { direction: TableSortDirection };

export type TablePageChangeDetail = { page: number; pageSize: number };

export type TablePageSizeChangeDetail = { pageSize: number; page: number };
