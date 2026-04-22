import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tableStyles } from './table.styles.js';
import type { TableColumn, TableRow, TableSortState } from './types.js';

const INTERACTIVE_TAGS = new Set([
  'a', 'button', 'input', 'select', 'textarea', 'label',
  'ds-button', 'ds-link', 'ds-checkbox', 'ds-radio', 'ds-select',
  'ds-searchable-select', 'ds-text-field', 'ds-table-sort-button',
  'ds-table-pagination',
]);

/**
 * @tag ds-table
 * @summary Data table driven by `rows` + `columns` props with optional clickable rows and header slots.
 * @slot caption - Table caption rendered above the header.
 * @slot toolbar - Content placed above the table (filter, search).
 * @slot footer - Content placed below the table (pagination).
 * @slot empty - Shown when `rows` is empty.
 * @slot header-{columnName} - Per-column header override (e.g. inject a ds-table-sort-button).
 * @event ds-row-click - Emitted when `clickable-rows` is set and a row is activated. Detail: `{ row, index }`.
 * @csspart table - The internal `<table>` element.
 * @csspart thead - The `<thead>` element.
 * @csspart tbody - The `<tbody>` element.
 * @csspart row - Each body `<tr>`.
 * @csspart row-clickable - Each body `<tr>` when `clickable-rows` is set.
 * @csspart cell - Each body `<td>`.
 * @csspart header-cell - Each header `<th>`.
 * @csspart caption - The `<caption>` wrapper.
 * @csspart toolbar - The toolbar wrapper.
 * @csspart footer - The footer wrapper.
 * @csspart empty - The empty-state wrapper.
 */
export class DsTable<T extends TableRow = TableRow> extends DsElement {
  static override styles = [...DsElement.styles, tableStyles];

  @property({ attribute: false }) rows: readonly T[] = [];
  @property({ attribute: false }) columns: readonly TableColumn<T>[] = [];
  @property({ attribute: false }) sortState: TableSortState | null = null;
  @property({ type: Boolean, reflect: true, attribute: 'clickable-rows' }) clickableRows = false;
  @property({ attribute: 'row-key' }) rowKey?: string;

  #onRowClick = (event: MouseEvent, row: T, index: number): void => {
    if (this.#pathHasInteractiveBeforeRow(event)) {
      return;
    }
    this.emit('ds-row-click', { detail: { row, index } });
  };

  #onRowKeydown = (event: KeyboardEvent, row: T, index: number): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.emit('ds-row-click', { detail: { row, index } });
  };

  #pathHasInteractiveBeforeRow(event: Event): boolean {
    const path = event.composedPath();
    for (const node of path) {
      if (!(node instanceof Element)) {
        continue;
      }
      if (node.tagName === 'TR') {
        return false;
      }
      const tag = node.tagName.toLowerCase();
      if (INTERACTIVE_TAGS.has(tag)) {
        return true;
      }
      if (node.getAttribute('role') === 'button') {
        return true;
      }
    }
    return false;
  }

  #ariaSort(column: TableColumn<T>): 'ascending' | 'descending' | 'none' | undefined {
    if (!column.sortable) {
      return undefined;
    }
    if (this.sortState?.name !== column.name || !this.sortState.direction) {
      return 'none';
    }
    return this.sortState.direction === 'asc' ? 'ascending' : 'descending';
  }

  #renderCell(column: TableColumn<T>, row: T, index: number): unknown {
    if (column.render) {
      return column.render(row, index);
    }
    const value = row[column.field];
    return value == null ? '' : String(value);
  }

  #renderHeader(column: TableColumn<T>): TemplateResult {
    const align = column.align ?? 'left';
    return html`
      <th
        part="header-cell"
        scope="col"
        class=${`align-${align}`}
        aria-sort=${this.#ariaSort(column) ?? nothing}
      >
        <slot name=${`header-${column.name}`}>${column.label}</slot>
      </th>
    `;
  }

  #renderRow(row: T, index: number): TemplateResult {
    const clickable = this.clickableRows;
    return html`
      <tr
        part=${clickable ? 'row row-clickable' : 'row'}
        class=${clickable ? 'clickable' : ''}
        role=${clickable ? 'button' : nothing}
        tabindex=${clickable ? 0 : nothing}
        @click=${clickable ? (e: MouseEvent) => this.#onRowClick(e, row, index) : nothing}
        @keydown=${clickable ? (e: KeyboardEvent) => this.#onRowKeydown(e, row, index) : nothing}
      >
        ${this.columns.map(column => html`
          <td part="cell" class=${`align-${column.align ?? 'left'}`}>
            ${this.#renderCell(column, row, index)}
          </td>
        `)}
      </tr>
    `;
  }

  #renderBody(): TemplateResult {
    if (this.rows.length === 0) {
      return html`
        <tr>
          <td part="empty" class="empty" colspan=${this.columns.length || 1}>
            <slot name="empty">No data</slot>
          </td>
        </tr>
      `;
    }
    return html`${this.rows.map((row, i) => this.#renderRow(row, i))}`;
  }

  override render(): TemplateResult {
    return html`
      <div class="toolbar" part="toolbar"><slot name="toolbar"></slot></div>
      <div class="scroll">
        <table part="table">
          <caption part="caption"><slot name="caption"></slot></caption>
          <colgroup>
            ${this.columns.map(col => html`<col style=${col.width ? `width: ${col.width}` : ''} />`)}
          </colgroup>
          <thead part="thead">
            <tr>${this.columns.map(col => this.#renderHeader(col))}</tr>
          </thead>
          <tbody part="tbody">${this.#renderBody()}</tbody>
        </table>
      </div>
      <div class="footer" part="footer"><slot name="footer"></slot></div>
    `;
  }
}
