import { html, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { fieldStyles } from './field.styles.js';

export type FieldLayout = 'block' | 'inline';

interface LabelTarget extends HTMLElement {
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

/**
 * @tag ds-field
 * @summary Forwards label, help, and error metadata to a slotted form control.
 * @slot default - The form control to describe (it owns label/help/error rendering).
 */
export class DsField extends DsElement {
  static override styles = [...DsElement.styles, fieldStyles];

  @property() label = '';
  @property() help = '';
  @property() error = '';
  @property({ type: Boolean }) optional = false;
  @property({ reflect: true }) layout: FieldLayout = 'block';

  @queryAssignedElements() private slotted!: LabelTarget[];

  override updated(): void {
    this.#wireControl();
  }

  #wireControl(): void {
    const control = this.slotted[0];
    if (!control) {
      return;
    }
    this.#applyAttribute(control, 'label', this.label);
    this.#applyAttribute(control, 'description', this.help);
    this.#applyAttribute(control, 'error', this.error);
    if (this.optional) {
      control.setAttribute('optional', '');
    } else {
      control.removeAttribute('optional');
    }
  }

  #applyAttribute(control: LabelTarget, name: string, value: string): void {
    if (value) {
      control.setAttribute(name, value);
    } else {
      control.removeAttribute(name);
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${() => this.#wireControl()}></slot>`;
  }
}
