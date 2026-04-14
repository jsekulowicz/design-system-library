import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { checkboxStyles } from './checkbox.styles.js';

/**
 * @tag ds-checkbox
 * @summary Binary (or indeterminate) input that participates in native forms.
 * @slot default - The visible label.
 * @event ds-change - Fires when the checked state changes.
 */
export class DsCheckbox extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, checkboxStyles];

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('checked') || changed.has('indeterminate')) {
      this.value = this.checked ? 'on' : null;
      this.#syncValidity();
    }
  }

  #syncValidity(): void {
    const flags: ValidityStateFlags = this.required && !this.checked ? { valueMissing: true } : {};
    const message = this.required && !this.checked ? 'Please check this box.' : '';
    this.setValidity(flags, message);
    this.invalid = !!flags.valueMissing;
  }

  #onInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false;
    this.emit('ds-change', { detail: { checked: this.checked } });
  };

  #onKey = (event: KeyboardEvent): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.checked = !this.checked;
      this.emit('ds-change', { detail: { checked: this.checked } });
    }
  };

  override render(): TemplateResult {
    return html`<label @keydown=${this.#onKey}>
      <input
        type="checkbox"
        name=${this.name || ''}
        .checked=${this.checked}
        .indeterminate=${this.indeterminate}
        ?required=${this.required}
        ?disabled=${this.disabled}
        aria-invalid=${this.invalid ? 'true' : 'false'}
        @change=${this.#onInput}
      />
      <span class="box" part="box" aria-hidden="true">
        <svg class="check" viewBox="0 0 16 16" fill="none">
          ${this.indeterminate
            ? html`<path d="M4 8h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`
            : html`<path
                d="M3.5 8.5l3 3 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />`}
        </svg>
      </span>
      <span part="label"><slot></slot></span>
    </label>`;
  }
}
