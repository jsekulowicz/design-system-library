import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { renderVirtualItems, ITEM_HEIGHT, LISTBOX_HEIGHT } from '../../shared/virtual-list.js';
import { searchableSelectStyles } from './searchable-select.styles.js';
import type { SelectOption } from '../select/select.js';

/**
 * @tag ds-searchable-select
 * @summary Combobox with a text search input. Emits ds-search so the consumer can filter options.
 * @event ds-search - Fires on every keystroke. Detail: `{ query: string }`.
 * @event ds-change - Fires when an option is selected. Detail: `{ value: string }`.
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

  @state() private _open = false;
  @state() private _search = '';
  @state() private _focusedIndex = -1;
  @state() private _scrollTop = 0;

  @query('.listbox') private _listboxEl?: HTMLElement;

  private _docClickHandler?: (e: MouseEvent) => void;

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) this.setAriaLabel(this.label || null);
    if (changed.has('description')) this.setAriaDescription(this.description || null);
    if (changed.has('_scrollTop') && this._listboxEl) {
      this._listboxEl.scrollTop = this._scrollTop;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) console.warn('<ds-searchable-select>: the `label` property is required for accessibility.');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#close();
  }

  #openDropdown = (): void => {
    this._open = true;
    this._search = '';
    const idx = this.options.findIndex(o => o.value === this.value);
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
    if (this._docClickHandler) {
      document.removeEventListener('click', this._docClickHandler);
      this._docClickHandler = undefined;
    }
  };

  #onFocus = (): void => {
    if (!this.disabled && !this._open) this.#openDropdown();
  };

  #onSearchInput = (e: Event): void => {
    this._search = (e.target as HTMLInputElement).value;
    this._focusedIndex = 0;
    this._scrollTop = 0;
    this.emit('ds-search', { detail: { query: this._search } });
  };

  #selectOption = (option: SelectOption): void => {
    if (option.disabled) return;
    this.value = option.value;
    this.invalid = this.required && !option.value;
    this.setValidity(
      this.invalid ? { valueMissing: true } : {},
      this.invalid ? 'Please select an option.' : '',
    );
    this.emit('ds-change', { detail: { value: option.value } });
    this.#close();
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
    if (event.key === 'Escape') { this.#close(); return; }
    if (!this._open && event.key === 'ArrowDown') { this.#openDropdown(); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); this.#moveFocus(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); this.#moveFocus(-1); }
    else if (event.key === 'Enter' && this._open && this._focusedIndex >= 0) {
      const focused = this.options[this._focusedIndex];
      if (focused?.disabled) event.preventDefault();
      else if (focused) this.#selectOption(focused);
    }
  };

  #onScroll = (): void => {
    this._scrollTop = this._listboxEl?.scrollTop ?? 0;
  };

  #renderOption = (option: SelectOption, index: number, current: string): TemplateResult => {
    const isSelected = option.value === current;
    const classes = [
      'option',
      isSelected && 'selected',
      this._focusedIndex === index && 'focused',
      option.disabled && 'disabled',
    ].filter(Boolean).join(' ');
    return html`
      <div id="option-${index}" class=${classes} part="option" role="option"
        aria-selected=${isSelected} aria-disabled=${option.disabled ?? false}
        @click=${() => this.#selectOption(option)}
        @mouseenter=${() => { this._focusedIndex = index; }}>
        <span class="option-label">${option.label}</span>
        ${isSelected ? html`
          <svg class="check-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
          </svg>` : nothing}
      </div>`;
  };

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    const selectedOption = this.options.find(o => o.value === current);
    const displayValue = this._open ? this._search : (selectedOption?.label ?? '');
    const activeDesc = this._open && this._focusedIndex >= 0 ? `option-${this._focusedIndex}` : undefined;
    return html`
      ${renderFieldLabel(this.label, this.required, 'search-input')}
      <div class="control-wrap">
        <div class="trigger ${this._open ? 'open' : ''}" part="trigger">
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
            placeholder=${this._open ? this.searchPlaceholder : this.placeholder}
            ?readonly=${this.disabled}
            @focus=${this.#onFocus}
            @input=${this.#onSearchInput}
            @keydown=${this.#onKeydown}
          />
          <!-- Heroicons 2.2.0 — 16/solid: chevron-down -->
          <svg class="caret" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </div>
        ${this._open ? html`
          <div id="listbox" class="listbox" part="listbox" role="listbox" @scroll=${this.#onScroll}>
            ${this.options.length === 0
              ? html`<p class="empty">No results found.</p>`
              : renderVirtualItems(this.options, this._scrollTop, (o, i) => this.#renderOption(o, i, current))}
          </div>` : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}`;
  }
}
