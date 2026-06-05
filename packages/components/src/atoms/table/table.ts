import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../skeleton/define.js';
import { tableStyles } from './table.styles.js';
import { tableResponsiveStyles } from './table-responsive.styles.js';
import { tableScrollBodyStyles } from './table-scroll-body.styles.js';
import { scrollFadeStyles } from '../../shared/scroll-fade.styles.js';
import { ScrollFadeController } from '../../shared/scroll-fade-controller.js';
import { renderTableSkeleton } from './table-skeleton.js';
import { renderTableBody, renderTableHeader } from './table-rendering.js';
import type { TableColumn, TableResponsiveMode, TableRow, TableSortState } from './types.js';

const INTERACTIVE_TAGS = new Set([
  'a', 'button', 'input', 'select', 'textarea', 'label',
  'ds-button', 'ds-link', 'ds-checkbox', 'ds-radio', 'ds-select',
  'ds-searchable-select', 'ds-text-field', 'ds-table-sort-button',
  'ds-table-pagination',
]);

const INTERACTIVE_ROLES = new Set([
  'button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox',
  'menuitemradio', 'option', 'radio', 'searchbox', 'slider',
  'spinbutton', 'switch', 'textbox',
]);

const FALSE_BOOLEAN_ATTRIBUTES = new Set(['false', '0']);
const ROW_DRAG_THRESHOLD = 4;

type RowPointerStart = {
  x: number;
  y: number;
};

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
 * @attr scroll-body - When set, the body scrolls under a pinned header (the footer slot stays pinned too). The scrollbar is hidden and overflow is signalled by top/bottom scroll-fades, matching ds-dialog/ds-drawer. Natural column widths are preserved; the host must be given a bounded height by its container.
 * @cssprop --ds-table-header-height - Header row height; in scroll-body mode it pins the header and offsets the top scroll-fade below it. Defaults to a single line of header text.
 * @event ds-row-click - Emitted when `clickable-rows` is set and a row is activated. Detail: `{ row, index }`.
 * @csspart table - The internal `<table>` element.
 * @csspart thead - The `<thead>` element.
 * @csspart tbody - The `<tbody>` element.
 * @csspart row - Each body `<tr>`.
 * @csspart row-clickable - Each body `<tr>` when `clickable-rows` is set.
 * @csspart row-action - The native row action button rendered in the first cell when `clickable-rows` is set.
 * @csspart cell - Each body `<td>`.
 * @csspart header-cell - Each header `<th>`.
 * @csspart caption - The `<caption>` wrapper.
 * @csspart toolbar - The toolbar wrapper.
 * @csspart scroll - The wrapper around the `<table>` that owns horizontal scroll. Consumers can override its overflow / height to delegate vertical scrolling to it (e.g. fixed-header + scrolling tbody patterns).
 * @csspart footer - The footer wrapper.
 * @csspart empty - The empty-state wrapper.
 * @csspart loading - Loading overlay rendered when `loading` is true.
 */
export class DsTable<T extends TableRow = TableRow> extends DsElement {
  static override styles = [
    ...DsElement.styles,
    tableStyles,
    tableResponsiveStyles,
    scrollFadeStyles,
    tableScrollBodyStyles,
  ];

  @property({ attribute: false }) rows: readonly T[] = [];
  @property({ attribute: false }) columns: readonly TableColumn<T>[] = [];
  @property({ attribute: false }) sortState: TableSortState | null = null;
  @property({ attribute: false }) rowActionLabel?: (row: T, index: number) => string;
  @property({ type: Boolean, reflect: true, attribute: 'clickable-rows' }) clickableRows = false;
  @property({ converter: booleanAttributeConverter }) loading = false;
  @property({ type: Number, attribute: 'skeleton-rows' }) skeletonRows = 5;
  @property({ type: Number, attribute: 'skeleton-columns' }) skeletonColumns = 4;
  @property({ attribute: 'row-key' }) rowKey?: string;
  @property({ reflect: true }) responsive: TableResponsiveMode = 'stack';
  @property({ type: Boolean, reflect: true, attribute: 'scroll-body' }) scrollBody = false;
  @state() private _hasCaption = false;
  @state() private _hasToolbar = false;
  @state() private _hasFooter = false;

  private readonly _scrollFade = new ScrollFadeController(
    this,
    () => this.shadowRoot?.querySelector('.scroll') as HTMLElement | null,
  );

  #slotObserver: MutationObserver | null = null;
  #rowPointerStart: RowPointerStart | null = null;
  #rowPointerDragged = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#syncSlotPresence();
    this.#slotObserver = new MutationObserver(this.#syncSlotPresence);
    this.#slotObserver.observe(this, {
      attributeFilter: ['slot'],
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  override disconnectedCallback(): void {
    this.#slotObserver?.disconnect();
    this.#slotObserver = null;
    super.disconnectedCallback();
  }

  #syncSlotPresence = (): void => {
    this._hasCaption = this.querySelector('[slot="caption"]') !== null;
    this._hasToolbar = this.querySelector('[slot="toolbar"]') !== null;
    this._hasFooter = this.querySelector('[slot="footer"]') !== null;
  };

  #onRowClick = (event: MouseEvent, row: T, index: number): void => {
    if (this.loading) {
      return;
    }
    if (this.#rowPointerDragged || this.#hasSelection()) {
      this.#resetRowPointer();
      return;
    }
    if (this.#pathHasInteractiveBeforeRow(event)) {
      this.#resetRowPointer();
      return;
    }
    this.#resetRowPointer();
    this.emit('ds-row-click', { detail: { row, index } });
  };

  #onRowPointerDown = (event: PointerEvent): void => {
    this.#rowPointerStart = { x: event.clientX, y: event.clientY };
    this.#rowPointerDragged = false;
  };

  #onRowPointerMove = (event: PointerEvent): void => {
    if (!this.#rowPointerStart) {
      return;
    }
    const deltaX = Math.abs(event.clientX - this.#rowPointerStart.x);
    const deltaY = Math.abs(event.clientY - this.#rowPointerStart.y);
    this.#rowPointerDragged ||= deltaX > ROW_DRAG_THRESHOLD || deltaY > ROW_DRAG_THRESHOLD;
  };

  #onRowAction = (row: T, index: number): void => {
    if (this.loading) {
      return;
    }
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
      const role = node.getAttribute('role');
      if (role && INTERACTIVE_ROLES.has(role)) {
        return true;
      }
    }
    return false;
  }

  #hasSelection(): boolean {
    const selection = this.ownerDocument.defaultView?.getSelection();
    return selection ? !selection.isCollapsed : false;
  }

  #resetRowPointer(): void {
    this.#rowPointerStart = null;
    this.#rowPointerDragged = false;
  }

  #ariaSort(column: TableColumn<T>): 'ascending' | 'descending' | undefined {
    if (!column.sortable || this.sortState?.name !== column.name || !this.sortState.direction) {
      return undefined;
    }
    return this.sortState.direction === 'asc' ? 'ascending' : 'descending';
  }

  #rowActionLabel = (row: T, index: number): string => {
    return this.rowActionLabel?.(row, index) ?? `Activate row ${index + 1}`;
  };

  #renderLoading(): TemplateResult | null {
    if (!this.loading) {
      return null;
    }
    const content = html`<slot name="loading">Loading...</slot>`;
    if (this.rows.length === 0) {
      return html`<div class="loading-status" role="status" aria-live="polite">${content}</div>`;
    }
    return html`
      <div class="loading" part="loading" role="status" aria-live="polite">
        <span>${content}</span>
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
          rowActionsDisabled: this.loading,
          rowActionLabel: this.#rowActionLabel,
          onRowClick: this.#onRowClick,
          onRowPointerDown: this.#onRowPointerDown,
          onRowPointerMove: this.#onRowPointerMove,
          onRowAction: this.#onRowAction,
        })}</tbody>
      </table>
    `;
  }

  #renderToolbar(): TemplateResult | null {
    if (!this._hasToolbar) {
      return null;
    }
    return html`<div class="toolbar" part="toolbar"><slot name="toolbar"></slot></div>`;
  }

  #renderFooter(): TemplateResult | null {
    if (!this._hasFooter) {
      return null;
    }
    return html`<div class="footer" part="footer"><slot name="footer"></slot></div>`;
  }

  override render(): TemplateResult {
    return html`
      ${this.#renderToolbar()}
      <div class="scroll" part="scroll">
        ${this.#renderTable()}
        ${this.#renderLoading()}
      </div>
      ${this.#renderFooter()}
    `;
  }
}
