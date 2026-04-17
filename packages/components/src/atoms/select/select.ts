import { html, nothing, type TemplateResult } from 'lit';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { selectStyles } from './select.styles.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * @tag ds-select
 * @summary Dropdown selector driven by a typed options array.
 * @event ds-change - Fires when the selection changes.
 */
export class DsSelect extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, selectStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: Array }) options: SelectOption[] = [];
  @property() placeholder = '';
  @property() label?: string;
  @property() description?: string;
  @property({ type: Boolean, reflect: true }) invalid = false;

  #onChange = (event: Event): void => {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.invalid = this.required && !target.value;
    this.setValidity(
      this.invalid ? { valueMissing: true } : {},
      this.invalid ? 'Please select an option.' : '',
    );
    this.emit('ds-change', { detail: { value: target.value } });
  };

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    return html`<span class="wrap" part="wrap">
      <select
        part="select"
        name=${this.name || ''}
        .value=${current}
        ?required=${this.required}
        ?disabled=${this.disabled}
        aria-invalid=${this.invalid ? 'true' : 'false'}
        aria-label=${this.label ?? nothing}
        aria-description=${this.description ?? nothing}
        @change=${this.#onChange}
      >
        ${this.placeholder
          ? html`<option value="" ?selected=${!current}>${this.placeholder}</option>`
          : null}
        ${this.options.map(
          (option) => html`
            <option
              value=${option.value}
              ?disabled=${option.disabled ?? false}
              ?selected=${option.value === current}
            >
              ${option.label}
            </option>
          `,
        )}
      </select>
      <svg class="caret" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>`;
  }
}
