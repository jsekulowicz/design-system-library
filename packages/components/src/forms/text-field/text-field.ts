import { html, LitElement, type TemplateResult, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { DsElement, changedWhatValidityReads, FormControlMixin } from '@jsekulowicz/ds-core';
import type { AutocompleteToken } from '@jsekulowicz/ds-core';
import {
  clickBelongsToTheControl,
  formFieldStyles,
  renderFieldFooter,
  renderFieldHeader,
} from '../../shared/form-field.js';
import { fieldControlStyles } from '../../shared/field-control.styles.js';
import { SlotPresenceController } from '../../shared/slot-presence.js';
import { textFieldStyles } from './text-field.styles.js';

export type TextFieldType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
export type TextFieldSize = 'sm' | 'md' | 'lg';

/**
 * @tag ds-text-field
 * @summary Single-line text input with native form participation via ElementInternals.
 * @slot leading - Adornment rendered before the input.
 * @slot trailing - Adornment rendered after the input.
 * @slot description - Replaces the description text, for a message that carries a link.
 * @slot warning - Replaces the warning text, for a message that carries a link.
 * @slot error - Replaces the error text, for a message that carries a link.
 * @event ds-input - Fired on every keystroke with the current value.
 * @event ds-change - Fired when the value is committed.
 * @csspart label - The field's own label element.
 * @csspart field-header - The row holding the label and the counter, when `char-count` is set.
 * @csspart wrap - The bordered box holding the input and its adornments.
 * @csspart input - The inner input element.
 */
export class DsTextField extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, fieldControlStyles, textFieldStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: false,
  };

  @property() type: TextFieldType = 'text';
  @property({ reflect: true }) size: TextFieldSize = 'md';
  @property() placeholder = '';
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: 'min-length', type: Number }) minLength?: number;
  @property({ attribute: 'max-length', type: Number }) maxLength?: number;
  @property({ attribute: 'char-count', type: Boolean, reflect: true }) charCount = false;
  @property() pattern?: string;
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

  readonly #slots = new SlotPresenceController(this, ['leading', 'trailing']);

  @query('input') private _input!: HTMLInputElement;

  #onInput = (event: Event): void => {
    if (this.disabled) {
      return;
    }
    const target = event.target as HTMLInputElement;
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
    const target = event.target as HTMLInputElement;
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

  override focus(options?: FocusOptions): void {
    this._input?.focus(options);
  }

  #focusTheInput = (event: Event): void => {
    if (clickBelongsToTheControl(event)) {
      this.focus();
    }
  };

  override updated(changed: PropertyValues): void {
    if (changedWhatValidityReads(changed)) {
      this.syncValidity();
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
      <div class="wrap field-control" part="wrap" @click=${this.#focusTheInput}>
        <span class="adornment" ?hidden=${!this.#slots.has('leading')}>
          <slot name="leading" @slotchange=${this.#slots.handleSlotChange}></slot>
        </span>
        <input
          id="input"
          part="input"
          .value=${live(current)}
          type=${this.type}
          name=${ifDefined(this.name || undefined)}
          placeholder=${this.placeholder}
          aria-label=${ifDefined(this.label ? undefined : this.inputLabel || undefined)}
          ?required=${this.required}
          ?readonly=${this.disabled || this.readonly}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          minlength=${ifDefined(this.minLength)}
          maxlength=${ifDefined(this.maxLength)}
          pattern=${ifDefined(this.pattern)}
          autocomplete=${ifDefined(this.autocomplete)}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          @input=${this.#onInput}
          @change=${this.#onChange}
          @focus=${this.#onFocus}
          @blur=${this.#onBlur}
        />
        <span class="adornment" ?hidden=${!this.#slots.has('trailing')}>
          <slot name="trailing" @slotchange=${this.#slots.handleSlotChange}></slot>
        </span>
      </div>
      ${renderFieldFooter(this)}
    `;
  }
}
