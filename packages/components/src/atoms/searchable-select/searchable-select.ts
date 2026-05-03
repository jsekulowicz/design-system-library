import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { renderVirtualItems } from '../../shared/virtual-list.js';
import {
  renderChevronDownIcon,
  renderClearButton,
  renderSelectedTiles,
} from '../select/select.shared.js';
import { DropdownController } from '../select/dropdown-controller.js';
import { clearKeydown, dropdownKeydown } from '../select/dropdown-keydown.js';
import { searchableSelectStyles } from './searchable-select.styles.js';
import { highlightMatch } from './highlight-match.js';
import type { SelectOption } from '../select/select.js';

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

  @state() private _search = '';

  private _labelMap = new Map<string, string>();

  @query('.listbox') private _listboxEl?: HTMLElement;
  @query('.tiles') private _tilesEl?: HTMLElement;
  @query('.search-input') private _inputEl?: HTMLInputElement;

  #dropdown = new DropdownController(this, {
    getOptions: () => this.options,
    getCurrentValue: () => (typeof this.value === 'string' ? this.value : ''),
    getValues: () => this.values,
    getMultiple: () => this.multiple,
    getMaxLines: () => this.maxLines,
    getTilesEl: () => this._tilesEl,
    getListboxEl: () => this._listboxEl,
    applyValues: (next) => {
      this.values = next;
      this.value = next.join(',');
      this.emit('ds-change', { detail: { values: next } });
    },
    canOpen: () => !this.loading,
    onOpen: () => {
      this._search = '';
    },
    onClose: () => {
      this._search = '';
      this.emit('ds-search', { detail: { query: '' } });
    },
  });

  /* test-facing forwarders to controller state */
  get _open(): boolean { return this.#dropdown.open; }
  get _focusedIndex(): number { return this.#dropdown.focusedIndex; }
  set _focusedIndex(value: number) { this.#dropdown.focusedIndex = value; }
  get _focusedTileIndex(): number { return this.#dropdown.focusedTileIndex; }
  set _focusedTileIndex(value: number) { this.#dropdown.focusedTileIndex = value; }
  get _scrollTop(): number { return this.#dropdown.scrollTop; }
  set _scrollTop(value: number) { this.#dropdown.scrollTop = value; }
  get _hasLeading(): boolean { return this.#dropdown.hasLeading; }
  get _overflowCount(): number { return this.#dropdown.overflowCount; }
  get _overflowCheckQueued(): boolean { return this.#dropdown.overflowCheckQueued; }
  set _overflowCheckQueued(value: boolean) { this.#dropdown.overflowCheckQueued = value; }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('options')) {
      for (const o of this.options) this._labelMap.set(o.value, o.label);
    }
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) this.setAriaLabel(this.label || null);
    if (changed.has('description')) this.setAriaDescription(this.description || null);
    if (
      (changed.has('values') || changed.has('maxLines') || changed.has('multiple')) &&
      this.multiple
    ) {
      this.#dropdown.queueOverflowCheck();
    }
    this.#dropdown.syncScrollTop();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label)
      console.warn('<ds-searchable-select>: the `label` property is required for accessibility.');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#dropdown.close();
  }

  #onFocus = (): void => {
    if (!this.disabled && !this.loading && !this.#dropdown.open) this.#dropdown.openDropdown();
  };

  #onSearchInput = (event: Event): void => {
    this._search = (event.target as HTMLInputElement).value;
    this.#dropdown.focusedIndex = 0;
    this.emit('ds-search', { detail: { query: this._search } });
  };

  #selectOption = (option: SelectOption): void => {
    if (option.disabled) return;
    if (this.multiple) {
      const next = this.values.includes(option.value)
        ? this.values.filter((v) => v !== option.value)
        : [...this.values, option.value];
      this.values = next;
      this.value = next.join(',');
      this._search = '';
      this.emit('ds-search', { detail: { query: '' } });
      this.emit('ds-change', { detail: { values: next } });
    } else {
      this.value = option.value;
      this.invalid = this.required && !option.value;
      this.setValidity(
        this.invalid ? { valueMissing: true } : {},
        this.invalid ? 'Please select an option.' : '',
      );
      this.emit('ds-change', { detail: { value: option.value } });
      this.#dropdown.close();
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

  #onClearKeydown = (event: KeyboardEvent): void => clearKeydown(event, this.#clear);

  #onKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if (
      dropdownKeydown(event, {
        controller: this.#dropdown,
        multiple: this.multiple,
        options: this.options,
        values: this.values,
        selectOption: this.#selectOption,
        tileArrowLeftGate: () => this._inputEl?.selectionStart === 0,
      }) === 'handled'
    ) {
      return;
    }
    if (!this.#dropdown.open && event.key === 'ArrowDown') {
      this.#dropdown.openDropdown();
    }
  };

  #renderTiles = (): TemplateResult =>
    renderSelectedTiles({
      values: this.values,
      focusedTileIndex: this.#dropdown.focusedTileIndex,
      overflowCount: this.#dropdown.overflowCount,
      maxLines: this.maxLines,
      labelFor: (value) => this._labelMap.get(value) ?? value,
      onRemove: this.#dropdown.removeTile,
    });

  #renderOption = (option: SelectOption, index: number, current: string): TemplateResult => {
    const isSelected = this.multiple
      ? this.values.includes(option.value)
      : option.value === current;
    return html`<ds-select-option
      id="option-${index}"
      part="option"
      .value=${option.value}
      ?selected=${isSelected}
      ?active=${this.#dropdown.focusedIndex === index}
      ?disabled=${option.disabled ?? false}
      @click=${() => this.#selectOption(option)}
      @mouseenter=${() => {
        this.#dropdown.focusedIndex = index;
      }}
      >${highlightMatch(option.label, this._search)}</ds-select-option
    >`;
  };

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    const open = this.#dropdown.open;
    const hasTiles = this.multiple && this.values.length > 0;
    const hasClearBtn =
      (this.clearable || this.required) &&
      (this.multiple ? this.values.length > 0 : current !== '');
    const displayValue = open
      ? this._search
      : !this.multiple
        ? (this._labelMap.get(current) ?? '')
        : '';
    const activeDesc =
      open && this.#dropdown.focusedIndex >= 0 ? `option-${this.#dropdown.focusedIndex}` : undefined;
    return html` ${renderFieldLabel(this.label, this.required, 'search-input')}
      <div class="control-wrap">
        <div
          class="trigger${this.multiple ? ' trigger-multiple' : ''} ${open ? 'open' : ''}"
          part="trigger"
          @click=${() => {
            if (!this.disabled) this.#dropdown.openDropdown();
          }}
        >
          <span class="leading" ?hidden=${!this.#dropdown.hasLeading}>
            <slot name="leading" @slotchange=${this.#dropdown.onLeadingChange}></slot>
          </span>
          ${hasTiles ? this.#renderTiles() : nothing}
          <input
            id="search-input"
            class="search-input"
            type="text"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded=${open ? 'true' : 'false'}
            aria-controls="listbox"
            aria-autocomplete="list"
            aria-activedescendant=${ifDefined(activeDesc)}
            aria-disabled=${this.disabled ? 'true' : 'false'}
            .value=${live(displayValue)}
            placeholder=${open ? this.searchPlaceholder : hasTiles ? '' : this.placeholder}
            ?readonly=${this.disabled}
            @focus=${this.#onFocus}
            @input=${this.#onSearchInput}
            @keydown=${this.#onKeydown}
          />
          ${hasClearBtn
            ? renderClearButton((event: Event) => {
                event.stopPropagation();
                this.#clear();
              }, this.#onClearKeydown)
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
        ${open
          ? html` <div
              id="listbox"
              class="listbox"
              part="listbox"
              role="listbox"
              aria-multiselectable=${this.multiple ? 'true' : 'false'}
              @scroll=${this.#dropdown.onScroll}
              @ds-activate=${(event: Event) => event.stopPropagation()}
            >
              ${this.options.length === 0
                ? html`<p class="empty">No results found.</p>`
                : renderVirtualItems(this.options, this.#dropdown.scrollTop, (option, index) =>
                    this.#renderOption(option, index, current),
                  )}
            </div>`
          : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}`;
  }
}
