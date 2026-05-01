import { html, nothing, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { formFieldStyles, renderSubtext } from '../../shared/form-field.js';
import { checkboxGroupStyles } from './checkbox-group.styles.js';

type CheckboxEl = HTMLElement & { checked?: boolean; checkboxValue?: string };

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

  @queryAssignedElements({ selector: 'ds-checkbox' }) private _checkboxes!: CheckboxEl[];

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

  override updated(changed: Map<string, unknown>): void {
    this.#wireCheckboxes(changed.has('value'));
  }

  #onSlotChange = (): void => {
    this.#wireCheckboxes(this.value.length > 0);
  };

  #wireCheckboxes = (syncChecked: boolean): void => {
    this._checkboxes.forEach(el => {
      if (this.name) el.setAttribute('name', this.name);
      if (this.required) {
        el.setAttribute('required', '');
      } else {
        el.removeAttribute('required');
      }
      if (this.disabled) {
        el.setAttribute('disabled', '');
      } else {
        el.removeAttribute('disabled');
      }
      if (syncChecked) {
        const cv = el.checkboxValue ?? el.getAttribute('checkboxvalue') ?? '';
        if (this.value.includes(cv)) {
          el.setAttribute('checked', '');
        } else {
          el.removeAttribute('checked');
        }
      }
    });
  };

  #onCheckboxChange = (event: Event): void => {
    if (event.target === this) {
      return;
    }
    event.stopImmediatePropagation();
    const values = this._checkboxes
      .filter(el => el.checked === true)
      .map(el => el.checkboxValue ?? el.getAttribute('checkboxvalue') ?? '')
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
          <slot @slotchange=${this.#onSlotChange}></slot>
        </div>
      </fieldset>
      ${renderSubtext(this.description, this.error, this.invalid)}
    `;
  }
}
