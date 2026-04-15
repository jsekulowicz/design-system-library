import { html, nothing, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement, nextId } from '@ds/core';
import { fieldStyles } from './field.styles.js';

export type FieldLayout = 'block' | 'inline';

interface LabelTarget extends HTMLElement {
  setAttribute(name: string, value: string): void;
}

/**
 * @tag ds-field
 * @summary Wraps an input atom with label, help text and error message.
 * @slot default - The form control (atom) to describe.
 */
export class DsField extends DsElement {
  static override styles = [...DsElement.styles, fieldStyles];

  @property() label = '';
  @property() help = '';
  @property() error = '';
  @property({ type: Boolean }) optional = false;
  @property({ reflect: true }) layout: FieldLayout = 'block';

  readonly #labelId = nextId('ds-field-label');
  readonly #helpId = nextId('ds-field-help');
  readonly #errorId = nextId('ds-field-error');

  @queryAssignedElements() private slotted!: LabelTarget[];

  override updated(): void {
    this.#wireControl();
  }

  #wireControl(): void {
    const control = this.slotted[0];
    if (!control) {
      return;
    }
    if (this.label) {
      control.setAttribute('label', this.label);
    }
    const description = [this.help, this.error].filter(Boolean).join(' ');
    if (description) {
      control.setAttribute('description', description);
    } else {
      control.removeAttribute('description');
    }
  }

  override render(): TemplateResult {
    const hasError = Boolean(this.error);
    return html`<div class="row">
        <label id=${this.#labelId} part="label">
          ${this.label}
          ${this.optional ? html`<span class="optional">optional</span>` : nothing}
        </label>
      </div>
      <slot></slot>
      ${this.help && !hasError
        ? html`<p class="help" id=${this.#helpId} part="help">${this.help}</p>`
        : nothing}
      ${hasError
        ? html`<p class="error" id=${this.#errorId} part="error" role="alert">${this.error}</p>`
        : nothing}`;
  }
}
