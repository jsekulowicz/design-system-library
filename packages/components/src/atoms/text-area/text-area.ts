import { html, nothing, LitElement, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { DsElement, FormControlMixin } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderFieldFooter, renderFieldLabel } from '../../shared/form-field.js';
import { fieldControlStyles } from '../../shared/field-control.styles.js';
import { textAreaStyles } from './text-area.styles.js';

export type TextAreaSize = 'sm' | 'md' | 'lg';
export type TextAreaResize = 'none' | 'vertical';

/**
 * @tag ds-text-area
 * @summary Multi-line text input with native form participation via ElementInternals.
 * @event ds-input - Fired on every keystroke with the current value.
 * @event ds-change - Fired when the value is committed.
 * @csspart input - The inner textarea element.
 */
export class DsTextArea extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, fieldControlStyles, textAreaStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ reflect: true }) size: TextAreaSize = 'md';
  @property({ reflect: true }) resize: TextAreaResize = 'none';
  @property() placeholder = '';
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Number }) rows = 3;
  @property({ attribute: 'min-length', type: Number }) minLength?: number;
  @property({ attribute: 'max-length', type: Number }) maxLength?: number;
  @property({ attribute: 'char-count', type: Boolean, reflect: true }) charCount = false;
  @property() autocomplete?: string;
  @property() label = '';
  @property({ attribute: 'input-label' }) inputLabel = '';
  @property() description = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) optional = false;

  @query('textarea') private input!: HTMLTextAreaElement;

  #onInput = (event: Event): void => {
    if (this.disabled) {
      return;
    }
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.#syncValidity();
    this.emit('ds-input', { detail: { value: target.value } });
  };

  #onChange = (event: Event): void => {
    if (this.disabled) {
      return;
    }
    const target = event.target as HTMLTextAreaElement;
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
      <textarea
        id="input"
        class="field-control"
        part="input"
        .value=${live(current)}
        rows=${this.rows}
        name=${this.name || nothing}
        placeholder=${this.placeholder}
        aria-label=${this.label ? nothing : this.inputLabel || nothing}
        ?required=${this.required}
        ?readonly=${this.disabled || this.readonly}
        minlength=${this.minLength ?? nothing}
        maxlength=${this.maxLength ?? nothing}
        autocomplete=${this.autocomplete ?? nothing}
        aria-invalid=${this.invalid ? 'true' : 'false'}
        @input=${this.#onInput}
        @change=${this.#onChange}
      ></textarea>
      ${renderFieldFooter(
        this.description,
        this.error,
        this.invalid,
        current.length,
        this.maxLength,
        this.charCount,
      )}
    `;
  }
}
