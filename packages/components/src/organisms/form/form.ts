import { html, nothing, type TemplateResult } from 'lit';
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
  @property({ attribute: 'title' }) header = '';

  #onSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const controls = this.#collectControls();
    const invalid = controls.some((control) => !control.checkValidity?.());
    if (!this.noValidate && invalid) {
      this.emit('ds-invalid', { detail: null });
      return;
    }
    this.emit('ds-submit', { detail: { data: this.#buildFormData(controls) } });
  };

  #collectControls(): ReadonlyArray<{
    name?: string;
    value?: unknown;
    checkValidity?: () => boolean;
  }> {
    return Array.from(this.querySelectorAll<HTMLElement>('[name]')) as never;
  }

  #buildFormData(controls: ReadonlyArray<{ name?: string; value?: unknown }>): FormData {
    const data = new FormData();
    for (const control of controls) {
      if (!control.name) {
        continue;
      }
      const value = control.value;
      if (value == null || value === '') {
        continue;
      }
      data.append(control.name, value instanceof File ? value : String(value));
    }
    return data;
  }

  override render(): TemplateResult {
    return html`<form
      part="form"
      action=${this.action}
      method=${this.method}
      ?novalidate=${this.noValidate}
      @submit=${this.#onSubmit}
    >
      ${this.header ? html`<h2 class="title" part="title">${this.header}</h2>` : nothing}
      <div class="section" part="section"><slot></slot></div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </form>`;
  }
}
