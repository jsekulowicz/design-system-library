import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { TableColumn, TableRow } from './types.js';

type AriaSort = 'ascending' | 'descending' | 'none' | undefined;

type TableBodyOptions<T extends TableRow> = {
  rows: readonly T[];
  columns: readonly TableColumn<T>[];
  clickableRows: boolean;
  onRowClick: (event: MouseEvent, row: T, index: number) => void;
  onRowKeydown: (event: KeyboardEvent, row: T, index: number) => void;
};

function renderCell<T extends TableRow>(column: TableColumn<T>, row: T, index: number): unknown {
  if (column.render) {
    return column.render(row, index);
  }
  const value = row[column.field];
  return value == null ? '' : String(value);
}

function renderCells<T extends TableRow>(
  columns: readonly TableColumn<T>[],
  row: T,
  index: number,
): TemplateResult[] {
  return columns.map(column => html`
    <td part="cell" class=${`align-${column.align ?? 'left'}`} data-label=${column.label}>
      ${renderCell(column, row, index)}
    </td>
  `);
}

function renderClickableRow<T extends TableRow>(
  options: TableBodyOptions<T>,
  row: T,
  index: number,
): TemplateResult {
  return html`
    <tr
      part="row row-clickable"
      class="clickable"
      role="button"
      tabindex="0"
      @click=${(e: MouseEvent) => options.onRowClick(e, row, index)}
      @keydown=${(e: KeyboardEvent) => options.onRowKeydown(e, row, index)}
    >
      ${renderCells(options.columns, row, index)}
    </tr>
  `;
}

function renderRow<T extends TableRow>(options: TableBodyOptions<T>, row: T, index: number): TemplateResult {
  if (options.clickableRows) {
    return renderClickableRow(options, row, index);
  }
  return html`
    <tr part="row">
      ${renderCells(options.columns, row, index)}
    </tr>
  `;
}

export function renderTableBody<T extends TableRow>(options: TableBodyOptions<T>): TemplateResult {
  if (options.rows.length === 0) {
    return html`
      <tr>
        <td part="empty" class="empty" colspan=${options.columns.length || 1}>
          <slot name="empty">No data</slot>
        </td>
      </tr>
    `;
  }
  return html`${options.rows.map((row, index) => renderRow(options, row, index))}`;
}

export function renderTableHeader<T extends TableRow>(
  columns: readonly TableColumn<T>[],
  ariaSort: (column: TableColumn<T>) => AriaSort,
): TemplateResult[] {
  return columns.map(column => html`
    <th
      part="header-cell"
      scope="col"
      class=${`align-${column.align ?? 'left'}`}
      aria-sort=${ifDefined(ariaSort(column))}
    >
      <slot name=${`header-${column.name}`}>${column.label}</slot>
    </th>
  `);
}
