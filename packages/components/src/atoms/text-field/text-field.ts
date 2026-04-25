import { html, nothing, LitElement, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { textFieldStyles } from './text-field.styles.js';

export type TextFieldType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
export type TextFieldSize = 'sm' | 'md' | 'lg';

/**
 * @tag ds-text-field
 * @summary Single-line text input with native form participation via ElementInternals.
 * @slot leading - Adornment rendered before the input.
 * @slot trailing - Adornment rendered after the input.
 * @event ds-input - Fired on every keystroke with the current value.
 * @event ds-change - Fired when the value is committed.
 */
export class DsTextField extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, textFieldStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property() type: TextFieldType = 'text';
  @property({ reflect: true }) size: TextFieldSize = 'md';
  @property() placeholder = '';
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: 'min-length', type: Number }) minLength?: number;
  @property({ attribute: 'max-length', type: Number }) maxLength?: number;
  @property() pattern?: string;
  @property() autocomplete?: string;
  @property() label = '';
  @property() description = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) optional = false;

  @state() private _hasLeading = false;
  @state() private _hasTrailing = false;

  @query('input') private input!: HTMLInputElement;

  #onLeadingChange = (e: Event): void => {
    this._hasLeading = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  #onTrailingChange = (e: Event): void => {
    this._hasTrailing = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  #onInput = (event: Event): void => {
    if (this.disabled) return;
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.#syncValidity();
    this.emit('ds-input', { detail: { value: target.value } });
  };

  #onChange = (event: Event): void => {
    if (this.disabled) return;
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.#syncValidity();
    this.emit('ds-change', { detail: { value: target.value } });
  };

  #syncValidity(): void {
    if (!this.input) {
      return;
    }
    this.setValidity(this.input.validity, this.input.validationMessage, this.input);
    this.invalid = !this.input.validity.valid;
  }

  override firstUpdated(): void {
    this.#syncValidity();
  }

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    return html`
      ${this.label ? renderFieldLabel(this.label, this.required, 'input', this.optional) : nothing}
      <span class="wrap" part="wrap">
        <span class="adornment" ?hidden=${!this._hasLeading}>
          <slot name="leading" @slotchange=${this.#onLeadingChange}></slot>
        </span>
        <input
          id="input"
          part="input"
          .value=${live(current)}
          type=${this.type}
          name=${this.name || nothing}
          placeholder=${this.placeholder}
          ?required=${this.required}
          ?readonly=${this.disabled || this.readonly}
          minlength=${this.minLength ?? nothing}
          maxlength=${this.maxLength ?? nothing}
          pattern=${this.pattern ?? nothing}
          autocomplete=${this.autocomplete ?? nothing}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          @input=${this.#onInput}
          @change=${this.#onChange}
        />
        <span class="adornment" ?hidden=${!this._hasTrailing}>
          <slot name="trailing" @slotchange=${this.#onTrailingChange}></slot>
        </span>
      </span>
      ${renderSubtext(this.description, this.error, this.invalid)}
    `;
  }
}
