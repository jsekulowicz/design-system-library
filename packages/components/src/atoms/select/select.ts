import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
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
} from './select.shared.js';
import { selectStyles } from './select.styles.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * @tag ds-select
 * @summary Custom dropdown selector with label, description and validation feedback.
 * @event ds-change - Fires when selection changes. Detail: `{ value }` or `{ values }` when multiple.
 * @csspart trigger - The trigger button element.
 * @csspart listbox - The dropdown listbox container.
 * @csspart option - Each individual option item.
 */
export class DsSelect extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, selectStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: Array }) options: SelectOption[] = [];
  @property() placeholder = '';
  @property() label = '';
  @property() description = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) clearable = false;
  @property({ type: Array }) values: string[] = [];
  @property({ type: Number }) maxLines?: number;

  @state() private _open = false;
  @state() private _focusedIndex = -1;
  @state() private _scrollTop = 0;
  @state() private _focusedTileIndex = -1;
  @state() private _overflowCount = 0;
  @state() private _hasLeading = false;

  @query('.listbox') private _listboxEl?: HTMLElement;
  @query('.tiles') private _tilesEl?: HTMLElement;

  private _docClickHandler?: (e: MouseEvent) => void;
  private _overflowCheckQueued = false;

  #onLeadingChange = (e: Event): void => {
    this._hasLeading = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) this.setAriaLabel(this.label || null);
    if (changed.has('description')) this.setAriaDescription(this.description || null);
    if (changed.has('_scrollTop') && this._listboxEl) this._listboxEl.scrollTop = this._scrollTop;
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
      console.warn('<ds-select>: the `label` property is required for accessibility.');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#close();
  }

  #openDropdown = (): void => {
    this._open = true;
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
    this._focusedIndex = -1;
    this._scrollTop = 0;
    if (this._docClickHandler) {
      document.removeEventListener('click', this._docClickHandler);
      this._docClickHandler = undefined;
    }
  };

  #selectOption = (option: SelectOption): void => {
    if (option.disabled) return;
    if (this.multiple) {
      this.values = this.values.includes(option.value)
        ? this.values.filter((v) => v !== option.value)
        : [...this.values, option.value];
      this.value = this.values.join(',');
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
    if (top < this._scrollTop) this._scrollTop = top;
    else if (bottom > this._scrollTop + LISTBOX_HEIGHT) this._scrollTop = bottom - LISTBOX_HEIGHT;
  };

  #moveFocus = (direction: 1 | -1): void => {
    const next = this._focusedIndex + direction;
    if (next >= 0 && next < this.options.length) {
      this._focusedIndex = next;
      this.#scrollToFocused();
    }
  };

  #onTriggerKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if ((event.target as Element).classList.contains('clear-btn')) return;
    const visibleCount = getVisibleTileCount(this.values.length, this._overflowCount);

    if (this.multiple && visibleCount > 0) {
      if (event.key === 'ArrowLeft') {
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
    if (!this._open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this._focusedTileIndex = -1;
      this.#openDropdown();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.#moveFocus(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.#moveFocus(-1);
    } else if (event.key === 'Enter' && this._focusedIndex >= 0) {
      const f = this.options[this._focusedIndex];
      if (f?.disabled) event.preventDefault();
      else if (f) this.#selectOption(f);
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
      labelFor: (value) => this.options.find((option) => option.value === value)?.label ?? value,
      onRemove: this.#removeTile,
    });

  #renderOption = (option: SelectOption, index: number, current: string): TemplateResult => {
    const isSelected = this.multiple
      ? this.values.includes(option.value)
      : option.value === current;
    return renderOptionItem({
      id: `option-${index}`,
      label: option.label,
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
    const selectedOption = this.options.find((o) => o.value === current);
    const activeDesc =
      this._open && this._focusedIndex >= 0 ? `option-${this._focusedIndex}` : undefined;
    const hasTiles = this.multiple && this.values.length > 0;
    const hasClearBtn =
      (this.clearable || this.required) &&
      (this.multiple ? this.values.length > 0 : current !== '');
    return html` ${renderFieldLabel(this.label, this.required, 'trigger')}
      <div class="control-wrap">
        <div
          id="trigger"
          class="trigger${this.multiple ? ' trigger-multiple' : ''}"
          part="trigger"
          tabindex=${this.disabled ? '-1' : '0'}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-controls="listbox"
          aria-label=${ifDefined(this.label || undefined)}
          aria-activedescendant=${ifDefined(activeDesc)}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this.#toggle}
          @keydown=${this.#onTriggerKeydown}
        >
          <span class="leading" ?hidden=${!this._hasLeading}>
            <slot name="leading" @slotchange=${this.#onLeadingChange}></slot>
          </span>
          ${hasTiles
            ? this.#renderTiles()
            : html` <span class=${selectedOption ? 'trigger-label' : 'trigger-label placeholder'}>
                ${selectedOption?.label ?? this.placeholder}
              </span>`}
          ${hasClearBtn
            ? renderClearButton(
                (event: Event) => {
                  event.stopPropagation();
                  this.#clear();
                },
                this.#onClearKeydown,
              )
            : nothing}
          ${renderChevronDownIcon()}
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
              ${renderVirtualItems(this.options, this._scrollTop, (o, i) =>
                this.#renderOption(o, i, current),
              )}
            </div>`
          : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}`;
  }

  #toggle = (): void => {
    if (this.disabled) return;
    if (this._open) {
      this.#close();
    } else {
      this.#openDropdown();
    }
  };
}
