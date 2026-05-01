import { html, nothing, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { formFieldStyles, renderSubtext } from '../../shared/form-field.js';
import { radioGroupStyles } from './radio-group.styles.js';

type RadioEl = HTMLElement & { checked?: boolean; radioValue?: string };

/**
 * @tag ds-radio-group
 * @summary Groups ds-radio buttons with a shared label, name, and validation state.
 * @slot default - One or more ds-radio elements.
 * @event ds-change - Fires when the selected radio changes. Detail: `{ value: string }`.
 */
export class DsRadioGroup extends DsElement {
  static override styles = [...DsElement.styles, formFieldStyles, radioGroupStyles];

  @property() label = '';
  @property() name = '';
  @property() description = '';
  @property() error = '';
  @property() value = '';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @queryAssignedElements({ selector: 'ds-radio' }) private _radios!: RadioEl[];

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) {
      console.warn('<ds-radio-group>: the `label` property is required for accessibility.');
    }
    this.addEventListener('ds-change', this.#onRadioChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('ds-change', this.#onRadioChange);
  }

  override updated(changed: Map<string, unknown>): void {
    this.#wireRadios(changed.has('value'));
  }

  #onSlotChange = (): void => {
    this.#wireRadios(this.value !== '');
  };

  #wireRadios = (syncChecked = false): void => {
    this._radios.forEach(radio => {
      if (this.name) radio.setAttribute('name', this.name);
      if (this.required) {
        radio.setAttribute('required', '');
      } else {
        radio.removeAttribute('required');
      }
      if (this.disabled) {
        radio.setAttribute('disabled', '');
      } else {
        radio.removeAttribute('disabled');
      }
      if (syncChecked) {
        const rv = radio.radioValue ?? radio.getAttribute('radiovalue') ?? '';
        if (rv === this.value) {
          radio.setAttribute('checked', '');
        } else {
          radio.removeAttribute('checked');
        }
      }
    });
  };

  #onRadioChange = (event: Event): void => {
    if (event.target === this) {
      return;
    }
    event.stopImmediatePropagation();
    const { value } = (event as CustomEvent<{ value: string }>).detail;
    this.value = value;
    this.invalid = false;
    this.dispatchEvent(new CustomEvent('ds-change', { bubbles: true, composed: true, detail: { value } }));
  };

  override render(): TemplateResult {
    return html`
      <fieldset class="fieldset" part="fieldset">
        <legend class="label" part="legend">
          ${this.label}
          ${this.required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing}
        </legend>
        <div class="items">
          <slot @slotchange=${this.#onSlotChange}></slot>
        </div>
      </fieldset>
      ${renderSubtext(this.description, this.error, this.invalid)}
    `;
  }
}
