import { html, svg, type PropertyValues, type TemplateResult } from 'lit';
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
  @property() checkboxValue = '';

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('checked') || changed.has('indeterminate') || changed.has('checkboxValue')) {
      this.value = this.checked ? (this.checkboxValue || 'on') : null;
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
        <!-- Heroicons 2.2.0 — 16/solid: minus (indeterminate), check (checked) -->
        <svg class="check" viewBox="0 0 16 16" fill="currentColor">
          ${this.indeterminate
            ? svg`<path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />`
            : svg`<path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />`}
        </svg>
      </span>
      <span part="label"><slot></slot></span>
    </label>`;
  }
}
