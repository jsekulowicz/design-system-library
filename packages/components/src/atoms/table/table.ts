import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../skeleton/define.js';
import { tableStyles } from './table.styles.js';
import { tableResponsiveStyles } from './table-responsive.styles.js';
import { renderTableSkeleton } from './table-skeleton.js';
import { renderTableBody, renderTableHeader } from './table-rendering.js';
import type { TableColumn, TableResponsiveMode, TableRow, TableSortState } from './types.js';

const INTERACTIVE_TAGS = new Set([
  'a', 'button', 'input', 'select', 'textarea', 'label',
  'ds-button', 'ds-link', 'ds-checkbox', 'ds-radio', 'ds-select',
  'ds-searchable-select', 'ds-text-field', 'ds-table-sort-button',
  'ds-table-pagination',
]);

const FALSE_BOOLEAN_ATTRIBUTES = new Set(['false', '0']);

function parseBooleanAttribute(value: string | null): boolean {
  return value !== null && !FALSE_BOOLEAN_ATTRIBUTES.has(value.trim().toLowerCase());
}

const booleanAttributeConverter = {
  fromAttribute: parseBooleanAttribute,
};

/**
 * @tag ds-table
 * @summary Data table driven by `rows` + `columns` props with optional clickable rows and header slots.
 * @slot caption - Table caption rendered above the header.
 * @slot toolbar - Content placed above the table (filter, search).
 * @slot footer - Content placed below the table (pagination).
 * @slot empty - Shown when `rows` is empty.
 * @slot loading - Shown inside the loading overlay when `loading` is true.
 * @slot header-{columnName} - Per-column header override (e.g. inject a ds-table-sort-button).
 * @attr responsive - `stack` stacks cells on small screens; `scroll` preserves horizontal scrolling.
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
 * @csspart loading - Loading overlay rendered when `loading` is true.
 */
export class DsTable<T extends TableRow = TableRow> extends DsElement {
  static override styles = [...DsElement.styles, tableStyles, tableResponsiveStyles];

  @property({ attribute: false }) rows: readonly T[] = [];
  @property({ attribute: false }) columns: readonly TableColumn<T>[] = [];
  @property({ attribute: false }) sortState: TableSortState | null = null;
  @property({ type: Boolean, reflect: true, attribute: 'clickable-rows' }) clickableRows = false;
  @property({ converter: booleanAttributeConverter }) loading = false;
  @property({ type: Number, attribute: 'skeleton-rows' }) skeletonRows = 5;
  @property({ type: Number, attribute: 'skeleton-columns' }) skeletonColumns = 4;
  @property({ attribute: 'row-key' }) rowKey?: string;
  @property({ reflect: true }) responsive: TableResponsiveMode = 'stack';
  @state() private _hasCaption = false;

  #captionObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#syncCaptionPresence();
    this.#captionObserver = new MutationObserver(this.#syncCaptionPresence);
    this.#captionObserver.observe(this, {
      attributeFilter: ['slot'],
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  override disconnectedCallback(): void {
    this.#captionObserver?.disconnect();
    this.#captionObserver = null;
    super.disconnectedCallback();
  }

  #syncCaptionPresence = (): void => {
    this._hasCaption = this.querySelector('[slot="caption"]') !== null;
  };

  #onRowClick = (event: MouseEvent, row: T, index: number): void => {
    if (this.loading) {
      return;
    }
    if (this.#pathHasInteractiveBeforeRow(event)) {
      return;
    }
    this.emit('ds-row-click', { detail: { row, index } });
  };

  #onRowKeydown = (event: KeyboardEvent, row: T, index: number): void => {
    if (this.loading) {
      return;
    }
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

  #renderLoading(): TemplateResult | null {
    if (!this.loading || this.rows.length === 0) {
      return null;
    }
    return html`
      <div class="loading" part="loading" role="status" aria-live="polite">
        <span><slot name="loading">Loading...</slot></span>
      </div>
    `;
  }

  #renderCaption(): TemplateResult | null {
    if (!this._hasCaption) {
      return null;
    }
    return html`<caption part="caption"><slot name="caption"></slot></caption>`;
  }

  #skeletonColumnCount(): number {
    return this.columns.length || this.skeletonColumns;
  }

  #shouldRenderSkeleton(): boolean {
    return this.columns.length === 0 || (this.loading && this.rows.length === 0);
  }

  #renderTable(): TemplateResult {
    if (this.#shouldRenderSkeleton()) {
      return renderTableSkeleton(this.skeletonRows, this.#skeletonColumnCount());
    }
    return html`
      <table part="table" aria-busy=${ifDefined(this.loading ? 'true' : undefined)}>
        ${this.#renderCaption()}
        <colgroup>${this.columns.map(col => html`<col style=${col.width ? `width: ${col.width}` : ''}>`)}</colgroup>
        <thead part="thead">
          <tr>${renderTableHeader(this.columns, column => this.#ariaSort(column))}</tr>
        </thead>
        <tbody part="tbody">${renderTableBody({
          rows: this.rows,
          columns: this.columns,
          clickableRows: this.clickableRows,
          onRowClick: this.#onRowClick,
          onRowKeydown: this.#onRowKeydown,
        })}</tbody>
      </table>
    `;
  }

  override render(): TemplateResult {
    return html`
      <div class="toolbar" part="toolbar"><slot name="toolbar"></slot></div>
      <div class="scroll">
        ${this.#renderTable()}
        ${this.#renderLoading()}
      </div>
      <div class="footer" part="footer"><slot name="footer"></slot></div>
    `;
  }
}
