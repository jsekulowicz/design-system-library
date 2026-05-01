import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { renderVirtualItems, ITEM_HEIGHT, LISTBOX_HEIGHT } from '../../shared/virtual-list.js';
import {
  clampTileFocusIndex,
  countOverflowTiles,
  getNextTileFocusIndex,
  getVisibleTileCount,
  queueTaskOnce,
  renderChevronDownIcon,
  renderClearButton,
  renderOptionItem,
  renderSelectedTiles,
} from '../select/select.shared.js';
import { searchableSelectStyles } from './searchable-select.styles.js';
import type { SelectOption } from '../select/select.js';

function highlightMatch(label: string, query: string): TemplateResult {
  if (!query) return html`${label}`;
  const lower = label.toLowerCase();
  const q = query.toLowerCase();
  const parts: Array<TemplateResult | string> = [];
  let pos = 0;
  let idx: number;
  while ((idx = lower.indexOf(q, pos)) !== -1) {
    if (idx > pos) parts.push(label.slice(pos, idx));
    parts.push(html`<mark class="match">${label.slice(idx, idx + q.length)}</mark>`);
    pos = idx + q.length;
  }
  if (pos < label.length) parts.push(label.slice(pos));
  return html`${parts}`;
}

/**
 * @tag ds-searchable-select
 * @summary Combobox with a text search input. Emits ds-search so the consumer can filter options.
 * @event ds-search - Fires on every keystroke. Detail: `{ query: string }`.
 * @event ds-change - Fires when selection changes. Detail: `{ value }` or `{ values }` when multiple.
 * @csspart trigger - The trigger container element.
 * @csspart listbox - The dropdown listbox container.
 * @csspart option - Each individual option item.
 */
export class DsSearchableSelect extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, searchableSelectStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: Array }) options: SelectOption[] = [];
  @property() placeholder = '';
  @property({ attribute: 'search-placeholder' }) searchPlaceholder = 'Search…';
  @property() label = '';
  @property() description = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) clearable = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Array }) values: string[] = [];
  @property({ type: Number }) maxLines?: number;

  @state() private _open = false;
  @state() private _search = '';
  @state() private _focusedIndex = -1;
  @state() private _scrollTop = 0;
  @state() private _focusedTileIndex = -1;
  @state() private _overflowCount = 0;
  @state() private _hasLeading = false;

  private _labelMap = new Map<string, string>();

  @query('.listbox') private _listboxEl?: HTMLElement;
  @query('.tiles') private _tilesEl?: HTMLElement;
  @query('.search-input') private _inputEl?: HTMLInputElement;

  private _docClickHandler?: (e: MouseEvent) => void;
  private _overflowCheckQueued = false;

  #onLeadingChange = (e: Event): void => {
    this._hasLeading = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('options')) {
      for (const o of this.options) this._labelMap.set(o.value, o.label);
    }
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) this.setAriaLabel(this.label || null);
    if (changed.has('description')) this.setAriaDescription(this.description || null);
    if (changed.has('_scrollTop') && this._listboxEl) {
      this._listboxEl.scrollTop = this._scrollTop;
    }
    if (
      (changed.has('values') || changed.has('maxLines') || changed.has('multiple')) &&
      this.multiple
    ) {
      this.#queueOverflowCheck();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label)
      console.warn('<ds-searchable-select>: the `label` property is required for accessibility.');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#close();
  }

  #openDropdown = (): void => {
    if (this._open || this.loading) return;
    this._open = true;
    this._search = '';
    this._focusedTileIndex = -1;
    const idx = this.multiple
      ? this.options.findIndex((o) => this.values.includes(o.value))
      : this.options.findIndex((o) => o.value === this.value);
    this._focusedIndex = idx >= 0 ? idx : 0;
    this._scrollTop = Math.max(0, (this._focusedIndex - 2) * ITEM_HEIGHT);
    this._docClickHandler = (e: MouseEvent) => {
      if (!e.composedPath().includes(this)) this.#close();
    };
    document.addEventListener('click', this._docClickHandler);
  };

  #close = (): void => {
    this._open = false;
    this._search = '';
    this._focusedIndex = -1;
    this._scrollTop = 0;
    this.emit('ds-search', { detail: { query: '' } });
    if (this._docClickHandler) {
      document.removeEventListener('click', this._docClickHandler);
      this._docClickHandler = undefined;
    }
  };

  #onFocus = (): void => {
    if (!this.disabled && !this.loading && !this._open) this.#openDropdown();
  };

  #onSearchInput = (e: Event): void => {
    this._search = (e.target as HTMLInputElement).value;
    this._focusedIndex = 0;
    this._scrollTop = 0;
    this.emit('ds-search', { detail: { query: this._search } });
  };

  #selectOption = (option: SelectOption): void => {
    if (option.disabled) return;
    if (this.multiple) {
      this.values = this.values.includes(option.value)
        ? this.values.filter((v) => v !== option.value)
        : [...this.values, option.value];
      this.value = this.values.join(',');
      this._search = '';
      this.emit('ds-search', { detail: { query: '' } });
      this.emit('ds-change', { detail: { values: this.values } });
    } else {
      this.value = option.value;
      this.invalid = this.required && !option.value;
      this.setValidity(
        this.invalid ? { valueMissing: true } : {},
        this.invalid ? 'Please select an option.' : '',
      );
      this.emit('ds-change', { detail: { value: option.value } });
      this.#close();
    }
  };

  #clear = (): void => {
    if (this.multiple) {
      this.values = [];
      this.value = '';
      this.emit('ds-change', { detail: { values: [] } });
    } else {
      this.value = '';
      this._search = '';
      this.emit('ds-search', { detail: { query: '' } });
      this.emit('ds-change', { detail: { value: '' } });
    }
  };

  #onClearKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();
      this.#clear();
    }
  };

  #removeTile = (value: string): void => {
    this.values = this.values.filter((v) => v !== value);
    this.value = this.values.join(',');
    const visibleCount = getVisibleTileCount(this.values.length, this._overflowCount);
    this._focusedTileIndex = clampTileFocusIndex(this._focusedTileIndex, visibleCount);
    this.emit('ds-change', { detail: { values: this.values } });
  };

  #checkOverflow = (): void => {
    const count = countOverflowTiles(this._tilesEl, this.maxLines);
    if (count !== this._overflowCount) {
      this._overflowCount = count;
    }
  };

  #queueOverflowCheck = (): void => {
    queueTaskOnce({
      isQueued: this._overflowCheckQueued,
      setQueued: (value) => {
        this._overflowCheckQueued = value;
      },
      task: this.#checkOverflow,
    });
  };

  #scrollToFocused = (): void => {
    const top = this._focusedIndex * ITEM_HEIGHT;
    const bottom = top + ITEM_HEIGHT;
    if (top < this._scrollTop) {
      this._scrollTop = top;
    } else if (bottom > this._scrollTop + LISTBOX_HEIGHT) {
      this._scrollTop = bottom - LISTBOX_HEIGHT;
    }
  };

  #moveFocus = (direction: 1 | -1): void => {
    const next = this._focusedIndex + direction;
    if (next >= 0 && next < this.options.length) {
      this._focusedIndex = next;
      this.#scrollToFocused();
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    const visibleCount = getVisibleTileCount(this.values.length, this._overflowCount);

    if (this.multiple && visibleCount > 0) {
      if (event.key === 'ArrowLeft' && this._inputEl?.selectionStart === 0) {
        event.preventDefault();
        this._focusedTileIndex = getNextTileFocusIndex(
          this._focusedTileIndex,
          visibleCount,
          'left',
        );
        return;
      }
      if (event.key === 'ArrowRight' && this._focusedTileIndex >= 0) {
        event.preventDefault();
        this._focusedTileIndex = getNextTileFocusIndex(
          this._focusedTileIndex,
          visibleCount,
          'right',
        );
        return;
      }
      if ((event.key === ' ' || event.key === 'Backspace') && this._focusedTileIndex >= 0) {
        event.preventDefault();
        const v = this.values[this._focusedTileIndex];
        if (v !== undefined) this.#removeTile(v);
        return;
      }
    }

    if (event.key === 'Escape') {
      this.#close();
      return;
    }
    if (!this._open && event.key === 'ArrowDown') {
      this.#openDropdown();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.#moveFocus(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.#moveFocus(-1);
    } else if (event.key === 'Enter' && this._open && this._focusedIndex >= 0) {
      const focused = this.options[this._focusedIndex];
      if (focused?.disabled) event.preventDefault();
      else if (focused) this.#selectOption(focused);
    }
  };

  #onScroll = (): void => {
    this._scrollTop = this._listboxEl?.scrollTop ?? 0;
  };

  #renderTiles = (): TemplateResult =>
    renderSelectedTiles({
      values: this.values,
      focusedTileIndex: this._focusedTileIndex,
      overflowCount: this._overflowCount,
      maxLines: this.maxLines,
      labelFor: (value) => this._labelMap.get(value) ?? value,
      onRemove: this.#removeTile,
    });

  #renderOption = (option: SelectOption, index: number, current: string): TemplateResult => {
    const isSelected = this.multiple
      ? this.values.includes(option.value)
      : option.value === current;
    return renderOptionItem({
      id: `option-${index}`,
      label: highlightMatch(option.label, this._search),
      isSelected,
      isFocused: this._focusedIndex === index,
      isDisabled: option.disabled ?? false,
      onSelect: () => this.#selectOption(option),
      onFocus: () => {
        this._focusedIndex = index;
      },
    });
  };

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    const hasTiles = this.multiple && this.values.length > 0;
    const hasClearBtn =
      (this.clearable || this.required) &&
      (this.multiple ? this.values.length > 0 : current !== '');
    const displayValue = this._open
      ? this._search
      : !this.multiple
        ? (this._labelMap.get(current) ?? '')
        : '';
    const activeDesc =
      this._open && this._focusedIndex >= 0 ? `option-${this._focusedIndex}` : undefined;
    return html` ${renderFieldLabel(this.label, this.required, 'search-input')}
      <div class="control-wrap">
        <div
          class="trigger${this.multiple ? ' trigger-multiple' : ''} ${this._open ? 'open' : ''}"
          part="trigger"
          @click=${() => {
            if (!this.disabled) this.#openDropdown();
          }}
        >
          <span class="leading" ?hidden=${!this._hasLeading}>
            <slot name="leading" @slotchange=${this.#onLeadingChange}></slot>
          </span>
          ${hasTiles ? this.#renderTiles() : nothing}
          <input
            id="search-input"
            class="search-input"
            type="text"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded=${this._open ? 'true' : 'false'}
            aria-controls="listbox"
            aria-autocomplete="list"
            aria-activedescendant=${ifDefined(activeDesc)}
            aria-disabled=${this.disabled ? 'true' : 'false'}
            .value=${live(displayValue)}
            placeholder=${this._open ? this.searchPlaceholder : hasTiles ? '' : this.placeholder}
            ?readonly=${this.disabled}
            @focus=${this.#onFocus}
            @input=${this.#onSearchInput}
            @keydown=${this.#onKeydown}
          />
          ${hasClearBtn
            ? renderClearButton(
                (event: Event) => {
                  event.stopPropagation();
                  this.#clear();
                },
                this.#onClearKeydown,
              )
            : nothing}
          ${this.loading
            ? html` <svg class="spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-dasharray="56.55"
                  stroke-dashoffset="14.14"
                />
              </svg>`
            : renderChevronDownIcon()}
        </div>
        ${this._open
          ? html` <div
              id="listbox"
              class="listbox"
              part="listbox"
              role="listbox"
              aria-multiselectable=${this.multiple ? 'true' : 'false'}
              @scroll=${this.#onScroll}
            >
              ${this.options.length === 0
                ? html`<p class="empty">No results found.</p>`
                : renderVirtualItems(this.options, this._scrollTop, (o, i) =>
                    this.#renderOption(o, i, current),
                  )}
            </div>`
          : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}`;
  }
}
