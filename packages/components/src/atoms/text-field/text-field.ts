import { html, nothing, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { DsElement, FormControlMixin } from '@ds/core';
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
  static override styles = [...DsElement.styles, textFieldStyles];

  @property() type: TextFieldType = 'text';
  @property({ reflect: true }) size: TextFieldSize = 'md';
  @property() placeholder = '';
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: 'min-length', type: Number }) minLength?: number;
  @property({ attribute: 'max-length', type: Number }) maxLength?: number;
  @property() pattern?: string;
  @property() autocomplete?: string;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @query('input') private input!: HTMLInputElement;

  #onInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.#syncValidity();
    this.emit('ds-input', { detail: { value: target.value } });
  };

  #onChange = (event: Event): void => {
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
    return html`<span class="wrap" part="wrap">
      <span class="adornment"><slot name="leading"></slot></span>
      <input
        part="input"
        .value=${live(current)}
        type=${this.type}
        name=${this.name || nothing}
        placeholder=${this.placeholder}
        ?required=${this.required}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        minlength=${this.minLength ?? nothing}
        maxlength=${this.maxLength ?? nothing}
        pattern=${this.pattern ?? nothing}
        autocomplete=${this.autocomplete ?? nothing}
        aria-invalid=${this.invalid ? 'true' : 'false'}
        @input=${this.#onInput}
        @change=${this.#onChange}
      />
      <span class="adornment"><slot name="trailing"></slot></span>
    </span>`;
  }
}
