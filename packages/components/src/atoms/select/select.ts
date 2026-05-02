import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { renderVirtualItems } from '../../shared/virtual-list.js';
import {
  renderChevronDownIcon,
  renderClearButton,
  renderOptionItem,
  renderSelectedTiles,
} from './select.shared.js';
import { DropdownController } from './dropdown-controller.js';
import { clearKeydown, dropdownKeydown } from './dropdown-keydown.js';
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

  @query('.listbox') private _listboxEl?: HTMLElement;
  @query('.tiles') private _tilesEl?: HTMLElement;

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
      console.warn('<ds-select>: the `label` property is required for accessibility.');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#dropdown.close();
  }

  #selectOption = (option: SelectOption): void => {
    if (option.disabled) return;
    if (this.multiple) {
      const next = this.values.includes(option.value)
        ? this.values.filter((v) => v !== option.value)
        : [...this.values, option.value];
      this.values = next;
      this.value = next.join(',');
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
      this.emit('ds-change', { detail: { value: '' } });
    }
  };

  #onClearKeydown = (event: KeyboardEvent): void => clearKeydown(event, this.#clear);

  #onTriggerKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if ((event.target as Element).classList.contains('clear-btn')) return;
    if (
      dropdownKeydown(event, {
        controller: this.#dropdown,
        multiple: this.multiple,
        options: this.options,
        values: this.values,
        selectOption: this.#selectOption,
      }) === 'handled'
    ) {
      return;
    }
    if (
      !this.#dropdown.open &&
      (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      this.#dropdown.openDropdown();
    }
  };

  #renderTiles = (): TemplateResult =>
    renderSelectedTiles({
      values: this.values,
      focusedTileIndex: this.#dropdown.focusedTileIndex,
      overflowCount: this.#dropdown.overflowCount,
      maxLines: this.maxLines,
      labelFor: (value) => this.options.find((option) => option.value === value)?.label ?? value,
      onRemove: this.#dropdown.removeTile,
    });

  #renderOption = (option: SelectOption, index: number, current: string): TemplateResult => {
    const isSelected = this.multiple
      ? this.values.includes(option.value)
      : option.value === current;
    return renderOptionItem({
      id: `option-${index}`,
      label: option.label,
      isSelected,
      isFocused: this.#dropdown.focusedIndex === index,
      isDisabled: option.disabled ?? false,
      onSelect: () => this.#selectOption(option),
      onFocus: () => {
        this.#dropdown.focusedIndex = index;
      },
    });
  };

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    const selectedOption = this.options.find((option) => option.value === current);
    const open = this.#dropdown.open;
    const activeDesc =
      open && this.#dropdown.focusedIndex >= 0 ? `option-${this.#dropdown.focusedIndex}` : undefined;
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
          aria-expanded=${open ? 'true' : 'false'}
          aria-controls="listbox"
          aria-label=${ifDefined(this.label || undefined)}
          aria-activedescendant=${ifDefined(activeDesc)}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this.#toggle}
          @keydown=${this.#onTriggerKeydown}
        >
          <span class="leading" ?hidden=${!this.#dropdown.hasLeading}>
            <slot name="leading" @slotchange=${this.#dropdown.onLeadingChange}></slot>
          </span>
          ${hasTiles
            ? this.#renderTiles()
            : html` <span class=${selectedOption ? 'trigger-label' : 'trigger-label placeholder'}>
                ${selectedOption?.label ?? this.placeholder}
              </span>`}
          ${hasClearBtn
            ? renderClearButton((event: Event) => {
                event.stopPropagation();
                this.#clear();
              }, this.#onClearKeydown)
            : nothing}
          ${renderChevronDownIcon()}
        </div>
        ${open
          ? html` <div
              id="listbox"
              class="listbox"
              part="listbox"
              role="listbox"
              aria-multiselectable=${this.multiple ? 'true' : 'false'}
              @scroll=${this.#dropdown.onScroll}
            >
              ${renderVirtualItems(this.options, this.#dropdown.scrollTop, (option, index) =>
                this.#renderOption(option, index, current),
              )}
            </div>`
          : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}`;
  }

  #toggle = (): void => {
    if (this.disabled) return;
    this.#dropdown.toggle();
  };
}
