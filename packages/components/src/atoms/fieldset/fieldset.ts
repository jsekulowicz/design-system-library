import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderSubtext } from '../../shared/form-field.js';
import { fieldGroupStyles } from '../../shared/field-group.styles.js';
import { fieldsetStyles } from './fieldset.styles.js';

export type FieldsetOrientation = 'horizontal' | 'vertical';

/**
 * @tag ds-fieldset
 * @summary Groups related controls under one legend, with the same label typography as every other field.
 * @slot default - The grouped controls.
 * @attr {boolean} borderless - Drops the box, leaving only the legend above the controls.
 * @csspart fieldset - The native `<fieldset>` element.
 * @csspart legend - The legend element.
 * @csspart items - The row (or column) the grouped controls lay out in.
 * @cssprop [--ds-fieldset-gap=var(--ds-space-4)] - Space between the grouped controls.
 */
export class DsFieldset extends DsElement {
  static override styles = [...DsElement.styles, formFieldStyles, fieldGroupStyles, fieldsetStyles];

  @property() label = '';
  @property() description = '';
  @property() error = '';
  @property({ reflect: true }) orientation: FieldsetOrientation = 'horizontal';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) borderless = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, attribute: 'message-space', reflect: true }) messageSpace = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) {
      console.warn('<ds-fieldset>: the `label` property is required for accessibility.');
    }
  }

  override render(): TemplateResult {
    return html`
      <fieldset class="fieldset" part="fieldset">
        <legend class="label" part="legend">
          ${this.label} ${this.required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing}
        </legend>
        <div class="items" part="items">
          <slot></slot>
        </div>
      </fieldset>
      ${renderSubtext(this.description, this.error, this.invalid, this.messageSpace)}
    `;
  }
}
