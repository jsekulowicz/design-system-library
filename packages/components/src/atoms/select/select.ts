import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { selectStyles } from './select.styles.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * @tag ds-select
 * @summary Custom dropdown selector with label, description and validation feedback.
 * @event ds-change - Fires when the selection changes. Detail: `{ value: string }`.
 * @csspart trigger - The trigger button element.
 * @csspart listbox - The dropdown listbox container.
 * @csspart option - Each individual option item.
 */
export class DsSelect extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, selectStyles];
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

  @state() private _open = false;
  @state() private _focusedIndex = -1;

  private _docClickHandler?: (e: MouseEvent) => void;

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) this.setAriaLabel(this.label || null);
    if (changed.has('description')) this.setAriaDescription(this.description || null);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) {
      console.warn('<ds-select>: the `label` property is required for accessibility.');
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#close();
  }

  #toggle = (): void => {
    if (this.disabled) return;
    this._open ? this.#close() : this.#openDropdown();
  };

  #openDropdown = (): void => {
    this._open = true;
    const idx = this.options.findIndex(o => o.value === this.value);
    this._focusedIndex = idx >= 0 ? idx : 0;
    this._docClickHandler = (e: MouseEvent) => {
      if (!e.composedPath().includes(this)) this.#close();
    };
    document.addEventListener('click', this._docClickHandler);
  };

  #close = (): void => {
    this._open = false;
    this._focusedIndex = -1;
    if (this._docClickHandler) {
      document.removeEventListener('click', this._docClickHandler);
      this._docClickHandler = undefined;
    }
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

  #moveFocus = (direction: 1 | -1): void => {
    const next = this._focusedIndex + direction;
    if (next >= 0 && next < this.options.length) {
      this._focusedIndex = next;
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if (event.key === 'Escape') {
      this.#close();
      return;
    }
    if (!this._open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
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
      const focused = this.options[this._focusedIndex];
      if (focused?.disabled) {
        event.preventDefault();
      } else if (focused) {
        this.#selectOption(focused);
      }
    }
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
      <div
        id="option-${index}"
        class=${classes}
        part="option"
        role="option"
        aria-selected=${isSelected}
        aria-disabled=${option.disabled ?? false}
        @click=${() => this.#selectOption(option)}
        @mouseenter=${() => { this._focusedIndex = index; }}
      >
        <span class="option-label">${option.label}</span>
        ${isSelected ? html`
          <svg class="check-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
          </svg>
        ` : nothing}
      </div>
    `;
  };

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    const selectedOption = this.options.find(o => o.value === current);
    const triggerLabel = selectedOption?.label ?? this.placeholder;
    const activeDesc = this._open && this._focusedIndex >= 0
      ? `option-${this._focusedIndex}`
      : undefined;

    return html`
      <label class="label" for="trigger">
        ${this.label}
        ${this.required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing}
      </label>
      <div class="control-wrap">
        <button
          id="trigger"
          class="trigger"
          part="trigger"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-controls="listbox"
          aria-activedescendant=${ifDefined(activeDesc)}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this.#toggle}
          @keydown=${this.#onKeydown}
        >
          <span class=${selectedOption ? 'trigger-label' : 'trigger-label placeholder'}>
            ${triggerLabel}
          </span>
          <svg class="caret" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </button>
        ${this._open ? html`
          <div id="listbox" class="listbox" part="listbox" role="listbox">
            ${this.options.map((o, i) => this.#renderOption(o, i, current))}
          </div>
        ` : nothing}
      </div>
      ${this.description && !this.invalid ? html`<p class="description">${this.description}</p>` : nothing}
      ${this.invalid && this.error ? html`
        <p class="error" role="alert">
          <svg class="error-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          </svg>
          ${this.error}
        </p>
      ` : nothing}
    `;
  }
}
