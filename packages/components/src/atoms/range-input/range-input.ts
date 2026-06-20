import { html, nothing, LitElement, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { DsElement, FormControlMixin } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { rangeInputStyles } from './range-input.styles.js';

export type RangeInputSize = 'sm' | 'md' | 'lg';

/**
 * @tag ds-range-input
 * @summary Slider for picking a numeric value within a range, with native form participation via ElementInternals.
 * @event ds-input - Fired continuously while dragging with the current numeric value.
 * @event ds-change - Fired when the value is committed.
 * @csspart track - The slider track.
 * @csspart thumb - The native range input (draggable thumb).
 * @csspart value - The current-value output shown when `show-value` is set.
 */
export class DsRangeInput extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, rangeInputStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ reflect: true }) size: RangeInputSize = 'md';
  @property() label = '';
  @property({ attribute: 'input-label' }) inputLabel = '';
  @property() description = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, attribute: 'show-value' }) showValue = false;

  @query('input') private input!: HTMLInputElement;

  #initialized = false;

  get valueAsNumber(): number {
    return this.#numericValue();
  }

  #numericValue(): number {
    const parsed = typeof this.value === 'string' ? Number(this.value) : NaN;
    const base = Number.isFinite(parsed) ? parsed : this.min;
    return Math.min(this.max, Math.max(this.min, base));
  }

  #fillPercent(): number {
    const span = this.max - this.min;
    if (span <= 0) {
      return 0;
    }
    return ((this.#numericValue() - this.min) / span) * 100;
  }

  #onInput = (event: Event): void => {
    if (this.disabled) return;
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.#syncValidity();
    this.emit('ds-input', { detail: { value: Number(target.value) } });
  };

  #onChange = (event: Event): void => {
    if (this.disabled) return;
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.#syncValidity();
    this.emit('ds-change', { detail: { value: Number(target.value) } });
  };

  // Stay focusable when disabled (so assistive tech can find and announce it,
  // like ds-button) but block the keyboard/pointer interactions that would
  // otherwise move the thumb.
  #blockWhenDisabled = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
    }
  };

  // A native range always holds an in-range value, so validity is forwarded to the
  // form for completeness while `invalid`/`error` stay consumer-controlled (app-level).
  #syncValidity(): void {
    if (!this.input) {
      return;
    }
    this.setValidity(this.input.validity, this.input.validationMessage, this.input);
  }

  override willUpdate(): void {
    if (!this.#initialized) {
      this.#initialized = true;
      if (this.value === null) {
        const initial = this.getAttribute('value');
        this.value = initial ?? String(this.#numericValue());
      }
    }
  }

  override firstUpdated(): void {
    this.#syncValidity();
  }

  override render(): TemplateResult {
    const current = this.#numericValue();
    return html`
      ${this.label ? renderFieldLabel(this.label, this.required, 'input') : nothing}
      <span class="wrap" part="wrap">
        <input
          id="input"
          part="thumb"
          type="range"
          class="range"
          style="--ds-range-fill: ${this.#fillPercent()}%"
          .value=${live(String(current))}
          min=${this.min}
          max=${this.max}
          step=${this.step}
          name=${this.name || nothing}
          aria-label=${this.label ? nothing : this.inputLabel || nothing}
          ?required=${this.required}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          @keydown=${this.#blockWhenDisabled}
          @pointerdown=${this.#blockWhenDisabled}
          @input=${this.#onInput}
          @change=${this.#onChange}
        />
        ${this.showValue
          ? html`<output part="value" for="input">${current}</output>`
          : nothing}
      </span>
      ${renderSubtext(this.description, this.error, this.invalid)}
    `;
  }
}
