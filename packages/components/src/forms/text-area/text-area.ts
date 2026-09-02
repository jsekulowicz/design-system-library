import { html, LitElement, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { DsElement, FormControlMixin } from '@jsekulowicz/ds-core';
import type { AutocompleteToken } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderFieldFooter, renderFieldHeader } from '../../shared/form-field.js';
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
  @property() autocomplete?: AutocompleteToken;
  @property() label = '';
  @property({ attribute: 'input-label' }) inputLabel = '';
  @property() description = '';
  /** A caution about the current value; outranks `description` and leaves the field valid. */
  @property() warning = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, attribute: 'message-space', reflect: true }) messageSpace = false;

  @query('textarea') private _input!: HTMLTextAreaElement;

  #onInput = (event: Event): void => {
    if (this.disabled) {
      return;
    }
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.syncValidity();
    this.emit('ds-input', { detail: { value: target.value } });
  };

  #onFocus = (): void => {
    const next = this.clearAutoInvalid(this.invalid);
    if (next !== null) {
      this.invalid = next;
    }
  };

  #onBlur = (): void => {
    this.markInteracted();
    this.syncValidity();
  };

  #onChange = (event: Event): void => {
    if (this.disabled) {
      return;
    }
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.markInteracted();
    this.syncValidity();
    this.emit('ds-change', { detail: { value: target.value } });
  };

  override syncValidity(): void {
    if (!this._input) {
      return;
    }
    this.setValidity(this._input.validity, this._input.validationMessage, this._input);
    const next = this.resolveInvalid(this.invalid, !this._input.validity.valid);
    if (next !== null) {
      this.invalid = next;
    }
  }

  override firstUpdated(): void {
    this.syncValidity();
  }

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    return html`
      ${renderFieldHeader(
        this.label,
        this.required,
        'input',
        this.optional,
        current.length,
        this.maxLength,
        this.charCount,
      )}
      <textarea
        id="input"
        class="field-control"
        part="input"
        .value=${live(current)}
        rows=${this.rows}
        name=${ifDefined(this.name || undefined)}
        placeholder=${this.placeholder}
        aria-label=${ifDefined(this.label ? undefined : this.inputLabel || undefined)}
        ?required=${this.required}
        ?readonly=${this.disabled || this.readonly}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        minlength=${ifDefined(this.minLength)}
        maxlength=${ifDefined(this.maxLength)}
        autocomplete=${ifDefined(this.autocomplete)}
        aria-invalid=${this.invalid ? 'true' : 'false'}
        @input=${this.#onInput}
        @change=${this.#onChange}
        @focus=${this.#onFocus}
        @blur=${this.#onBlur}
      ></textarea>
      ${renderFieldFooter(this)}
    `;
  }
}
