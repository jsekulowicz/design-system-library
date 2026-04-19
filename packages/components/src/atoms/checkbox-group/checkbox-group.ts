import { html, nothing, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { formFieldStyles, renderSubtext } from '../../shared/form-field.js';
import { checkboxGroupStyles } from './checkbox-group.styles.js';

/**
 * @tag ds-checkbox-group
 * @summary Groups ds-checkbox elements with a shared label, name, and validation state.
 * @slot default - One or more ds-checkbox elements.
 * @event ds-change - Fires when any checkbox changes. Detail: `{ values: string[] }`.
 */
export class DsCheckboxGroup extends DsElement {
  static override styles = [...DsElement.styles, formFieldStyles, checkboxGroupStyles];

  @property() label = '';
  @property() name = '';
  @property() description = '';
  @property() error = '';
  @property({ type: Array }) value: string[] = [];
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @queryAssignedElements({ selector: 'ds-checkbox' }) private _checkboxes!: HTMLElement[];

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) {
      console.warn('<ds-checkbox-group>: the `label` property is required for accessibility.');
    }
    this.addEventListener('ds-change', this.#onCheckboxChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('ds-change', this.#onCheckboxChange);
  }

  override updated(): void {
    this.#wireCheckboxes();
  }

  #wireCheckboxes = (): void => {
    this._checkboxes.forEach(el => {
      if (this.name) el.setAttribute('name', this.name);
      this.required ? el.setAttribute('required', '') : el.removeAttribute('required');
      this.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    });
  };

  #onCheckboxChange = (event: Event): void => {
    event.stopPropagation();
    const values = this._checkboxes
      .filter(el => el.hasAttribute('checked'))
      .map(el => el.getAttribute('checkboxvalue') ?? '')
      .filter(Boolean);
    this.value = values;
    this.invalid = false;
    this.dispatchEvent(new CustomEvent('ds-change', { bubbles: true, composed: true, detail: { values } }));
  };

  override render(): TemplateResult {
    return html`
      <fieldset class="fieldset" part="fieldset">
        <legend class="label" part="legend">
          ${this.label}
          ${this.required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing}
        </legend>
        <div class="items">
          <slot @slotchange=${this.#wireCheckboxes}></slot>
        </div>
      </fieldset>
      ${renderSubtext(this.description, this.error, this.invalid)}
    `;
  }
}
