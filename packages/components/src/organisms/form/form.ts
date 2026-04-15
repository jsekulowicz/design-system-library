import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { formStyles } from './form.styles.js';

/**
 * @tag ds-form
 * @summary Layout + behavior shell for native <form> submission with slotted ds-field content.
 * @slot default - ds-field or raw fieldset markup.
 * @slot actions - Submit / cancel button row.
 * @event ds-submit - Fires on successful form submit with FormData detail.
 * @event ds-invalid - Fires when submit is prevented by invalid fields.
 */
export class DsForm extends DsElement {
  static override styles = [...DsElement.styles, formStyles];

  @property() action = '';
  @property() method: 'get' | 'post' | 'dialog' = 'post';
  @property({ attribute: 'novalidate', type: Boolean }) noValidate = false;
  @property() summary?: string;

  #form?: HTMLFormElement;

  #onSubmit = (event: SubmitEvent): void => {
    if (!this.#form) {
      return;
    }
    const valid = this.noValidate || this.#form.checkValidity();
    if (!valid) {
      event.preventDefault();
      this.emit('ds-invalid', { detail: null });
      return;
    }
    const data = new FormData(this.#form);
    this.emit('ds-submit', { detail: { data } });
  };

  override firstUpdated(): void {
    this.#form = this.shadowRoot!.querySelector('form') ?? undefined;
  }

  override render(): TemplateResult {
    return html`<form
      part="form"
      action=${this.action}
      method=${this.method}
      ?novalidate=${this.noValidate}
      @submit=${this.#onSubmit}
    >
      ${this.summary ? html`<p class="summary" part="summary">${this.summary}</p>` : null}
      <div class="section" part="section"><slot></slot></div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </form>`;
  }
}
