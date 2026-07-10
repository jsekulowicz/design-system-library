import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { TableColumn, TableRow } from './types.js';

type AriaSort = 'ascending' | 'descending' | undefined;

type TableBodyOptions<T extends TableRow> = {
  rows: readonly T[];
  columns: readonly TableColumn<T>[];
  rowKey?: string;
  clickableRows: boolean;
  rowActionsDisabled: boolean;
  rowActionLabel: (row: T, index: number) => string;
  onRowClick: (event: MouseEvent, row: T, index: number) => void;
  onRowPointerDown: (event: PointerEvent) => void;
  onRowPointerMove: (event: PointerEvent) => void;
  onRowAction: (row: T, index: number) => void;
};

function renderCell<T extends TableRow>(column: TableColumn<T>, row: T, index: number): unknown {
  if (column.render) {
    return column.render(row, index);
  }
  const value = row[column.field];
  return value == null ? '' : String(value);
}

function renderCellLabel<T extends TableRow>(column: TableColumn<T>): TemplateResult | typeof nothing {
  if (!column.label) {
    return nothing;
  }
  return html`<div class="cell-label" aria-hidden="true">${column.label}</div>`;
}

function renderRowAction<T extends TableRow>(
  options: TableBodyOptions<T>,
  row: T,
  index: number,
): TemplateResult {
  return html`
    <button
      class="row-action visually-hidden"
      part="row-action"
      type="button"
      aria-label=${options.rowActionLabel(row, index)}
      ?disabled=${options.rowActionsDisabled}
      @click=${() => options.onRowAction(row, index)}
    ></button>
  `;
}

// A per-cell slot lets consumers project framework-rendered content (keyed by
// column + row key), falling back to `render`/`field` when nothing is slotted —
// so existing tables are unaffected. Needs `row-key` set to be unique per cell.
function renderCellValue<T extends TableRow>(
  options: TableBodyOptions<T>,
  column: TableColumn<T>,
  row: T,
  rowIndex: number,
): unknown {
  const fallback = renderCell(column, row, rowIndex);
  if (!options.rowKey) {
    return fallback;
  }
  const name = `cell:${column.name}:${String(row[options.rowKey] ?? '')}`;
  return html`<slot name=${name}>${fallback}</slot>`;
}

function renderCellContent<T extends TableRow>(
  options: TableBodyOptions<T>,
  column: TableColumn<T>,
  row: T,
  rowIndex: number,
  columnIndex: number,
): TemplateResult {
  return html`
    <div class="cell-content">
      ${options.clickableRows && columnIndex === 0 ? renderRowAction(options, row, rowIndex) : nothing}
      ${renderCellValue(options, column, row, rowIndex)}
    </div>
  `;
}

function renderCells<T extends TableRow>(
  options: TableBodyOptions<T>,
  columns: readonly TableColumn<T>[],
  row: T,
  index: number,
): TemplateResult[] {
  return columns.map((column, columnIndex) => html`
    <td part="cell" class=${`align-${column.align ?? 'left'}`} data-label=${column.label}>
      ${renderCellLabel(column)}
      ${renderCellContent(options, column, row, index, columnIndex)}
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
      @pointerdown=${options.onRowPointerDown}
      @pointermove=${options.onRowPointerMove}
      @click=${(e: MouseEvent) => options.onRowClick(e, row, index)}
    >
      ${renderCells(options, options.columns, row, index)}
    </tr>
  `;
}

function renderRow<T extends TableRow>(options: TableBodyOptions<T>, row: T, index: number): TemplateResult {
  if (options.clickableRows) {
    return renderClickableRow(options, row, index);
  }
  return html`
    <tr part="row">
      ${renderCells(options, options.columns, row, index)}
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
