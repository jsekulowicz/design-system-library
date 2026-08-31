import { html, svg, type TemplateResult, type SVGTemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { formatLabel } from '../../shared/format-label.js';
import { tableSortButtonStyles } from './table-sort-button.styles.js';
import type { TableSortDirection } from './types.js';

const ICON_NEUTRAL = svg`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 6l3-3 3 3"/><path d="M5 10l3 3 3-3"/></svg>`;
const ICON_ASC = svg`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10l4-4 4 4"/></svg>`;
const ICON_DESC = svg`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>`;

function nextDirection(current: TableSortDirection): TableSortDirection {
  if (current === null) {
    return 'asc';
  }
  if (current === 'asc') {
    return 'desc';
  }
  return null;
}

/**
 * @tag ds-table-sort-button
 * @summary Button that cycles through sort directions and emits `ds-sort`. Presentation-only; consumer owns state.
 * @slot default - Optional label for the button (falls back to `column`).
 * @csspart button - The internal `<button>` element.
 * @csspart icon - The direction indicator wrapper.
 * @event ds-sort - Emitted on click with the next direction. Detail: `{ direction: 'asc' | 'desc' | null }`.
 */
export class DsTableSortButton extends DsElement {
  static override styles = [...DsElement.styles, tableSortButtonStyles];

  @property({ reflect: true }) direction: TableSortDirection = null;
  @property({ attribute: 'sort-label' }) sortLabel = 'Sort';
  @property({ attribute: 'sort-by-label' }) sortByLabel = 'Sort by {column}';
  @property({ attribute: 'ascending-label' }) ascendingLabel = '{name} (ascending)';
  @property({ attribute: 'descending-label' }) descendingLabel = '{name} (descending)';
  @property() column?: string;

  #onClick = (): void => {
    const direction = nextDirection(this.direction);
    this.emit('ds-sort', { detail: { direction } });
  };

  #icon(): SVGTemplateResult {
    if (this.direction === 'asc') {
      return ICON_ASC;
    }
    if (this.direction === 'desc') {
      return ICON_DESC;
    }
    return ICON_NEUTRAL;
  }

  #ariaLabel(): string {
    const name = this.column ? formatLabel(this.sortByLabel, { column: this.column }) : this.sortLabel;
    if (this.direction === 'asc') {
      return formatLabel(this.ascendingLabel, { name });
    }
    if (this.direction === 'desc') {
      return formatLabel(this.descendingLabel, { name });
    }
    return name;
  }

  override render(): TemplateResult {
    return html`
      <button part="button" type="button" aria-label=${this.#ariaLabel()} @click=${this.#onClick}>
        <slot></slot>
        <span class="icon" part="icon">${this.#icon()}</span>
      </button>
    `;
  }
}
