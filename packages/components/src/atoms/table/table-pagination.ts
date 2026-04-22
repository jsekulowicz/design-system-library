import { html, svg, nothing, type TemplateResult, type SVGTemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tablePaginationStyles } from './table-pagination.styles.js';
import { buildPaginationRange, type PaginationRangeItem } from './pagination-range.js';

const ICON_PREV = svg`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 4l-4 4 4 4"/></svg>`;
const ICON_NEXT = svg`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>`;

/**
 * @tag ds-table-pagination
 * @summary Pagination controls emitting page-change events. Presentation-only; consumer owns paging state.
 * @slot prev-label - Content of the Previous button.
 * @slot next-label - Content of the Next button.
 * @slot summary - Replaces the default "Showing X–Y of Z" summary.
 * @event ds-page-change - Emitted when the user picks a page. Detail: `{ page, pageSize }`.
 * @event ds-page-size-change - Emitted when page size changes. Detail: `{ pageSize, page }`.
 * @csspart nav - The `<nav>` wrapper.
 * @csspart list - The page button list.
 * @csspart item - Individual list items.
 * @csspart item-current - The current-page list item.
 * @csspart item-ellipsis - Ellipsis list items.
 * @csspart button - Any `<button>` inside the nav.
 * @csspart button-prev - The Previous button.
 * @csspart button-next - The Next button.
 * @csspart size-selector - The size `<select>` wrapper.
 * @csspart summary - The summary region.
 */
export class DsTablePagination extends DsElement {
  static override styles = [...DsElement.styles, tablePaginationStyles];

  @property({ type: Number, reflect: true }) page = 1;
  @property({ type: Number, reflect: true, attribute: 'page-size' }) pageSize = 10;
  @property({ type: Number, reflect: true }) total = 0;
  @property({ attribute: false }) pageSizeOptions?: readonly number[];
  @property({ type: Number, reflect: true, attribute: 'max-visible-pages' }) maxVisiblePages = 7;
  @property({ type: Number, reflect: true, attribute: 'sibling-count' }) siblingCount = 1;
  @property({ type: Boolean, reflect: true, attribute: 'hide-page-numbers' }) hidePageNumbers = false;

  get #totalPages(): number {
    return Math.max(1, Math.ceil(this.total / Math.max(1, this.pageSize)));
  }

  get #currentPage(): number {
    return Math.min(Math.max(1, this.page), this.#totalPages);
  }

  #emitPage(page: number): void {
    const totalPages = this.#totalPages;
    const target = Math.min(Math.max(1, page), totalPages);
    if (target === this.#currentPage) {
      return;
    }
    this.emit('ds-page-change', { detail: { page: target, pageSize: this.pageSize } });
  }

  #onSizeChange = (event: Event): void => {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }
    const firstVisible = (this.#currentPage - 1) * this.pageSize + 1;
    const nextPage = Math.max(1, Math.ceil(firstVisible / value));
    this.emit('ds-page-size-change', { detail: { pageSize: value, page: nextPage } });
  };

  #range(): PaginationRangeItem[] {
    return buildPaginationRange({
      totalPages: this.#totalPages,
      currentPage: this.#currentPage,
      maxVisiblePages: this.maxVisiblePages,
      siblingCount: this.siblingCount,
    });
  }

  #renderButton(page: number, current: number): TemplateResult {
    const isCurrent = page === current;
    return html`
      <li part=${isCurrent ? 'item item-current' : 'item'}>
        <button
          part="button"
          type="button"
          aria-label=${`Page ${page}`}
          aria-current=${isCurrent ? 'page' : nothing}
          @click=${() => this.#emitPage(page)}
        >${page}</button>
      </li>
    `;
  }

  #renderItem(item: PaginationRangeItem, current: number): TemplateResult {
    if (item === 'ellipsis-start' || item === 'ellipsis-end') {
      return html`<li part="item item-ellipsis" class="ellipsis" aria-hidden="true">…</li>`;
    }
    return this.#renderButton(item, current);
  }

  #renderPrevNext(icon: SVGTemplateResult, label: string, part: string, target: number, disabled: boolean, slotName: string, defaultText: string): TemplateResult {
    return html`
      <button
        part=${`button ${part}`}
        type="button"
        aria-label=${label}
        ?disabled=${disabled}
        @click=${() => this.#emitPage(target)}
      >
        ${part === 'button-prev' ? icon : nothing}
        <slot name=${slotName}>${defaultText}</slot>
        ${part === 'button-next' ? icon : nothing}
      </button>
    `;
  }

  #renderSize(): TemplateResult | typeof nothing {
    if (!this.pageSizeOptions?.length) {
      return nothing;
    }
    return html`
      <div class="size" part="size-selector">
        <label>Rows per page
          <select aria-label="Rows per page" .value=${String(this.pageSize)} @change=${this.#onSizeChange}>
            ${this.pageSizeOptions.map(n => html`<option value=${n} ?selected=${n === this.pageSize}>${n}</option>`)}
          </select>
        </label>
      </div>
    `;
  }

  #renderSummary(current: number): TemplateResult {
    const start = this.total === 0 ? 0 : (current - 1) * this.pageSize + 1;
    const end = Math.min(current * this.pageSize, this.total);
    const fallback = this.total === 0 ? 'No results' : `Showing ${start}–${end} of ${this.total}`;
    return html`<div class="summary" part="summary" role="status" aria-live="polite"><slot name="summary">${fallback}</slot></div>`;
  }

  override render(): TemplateResult {
    const current = this.#currentPage;
    const totalPages = this.#totalPages;
    const isFirst = current <= 1;
    const isLast = current >= totalPages;
    return html`
      ${this.#renderSummary(current)}
      <nav part="nav" aria-label="Pagination">
        ${this.#renderPrevNext(ICON_PREV, 'Previous page', 'button-prev', current - 1, isFirst, 'prev-label', 'Previous')}
        ${this.hidePageNumbers
          ? html`<span class="ellipsis">Page ${current} of ${totalPages}</span>`
          : html`<ul class="list" part="list">${this.#range().map(i => this.#renderItem(i, current))}</ul>`}
        ${this.#renderPrevNext(ICON_NEXT, 'Next page', 'button-next', current + 1, isLast, 'next-label', 'Next')}
        ${this.#renderSize()}
      </nav>
    `;
  }
}
