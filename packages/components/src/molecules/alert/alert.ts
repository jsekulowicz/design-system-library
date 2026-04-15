import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement, announce } from '@ds/core';
import { alertStyles } from './alert.styles.js';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/**
 * @tag ds-alert
 * @summary Inline message with tone, optional title, and dismissal.
 * @slot default - Message body.
 * @slot actions - Optional action row below the message.
 * @event ds-dismiss - Fires when the close button is activated.
 */
export class DsAlert extends DsElement {
  static override styles = [...DsElement.styles, alertStyles];

  @property({ reflect: true }) tone: AlertTone = 'info';
  @property() heading?: string;
  @property({ type: Boolean, reflect: true }) dismissible = false;
  @property({ type: Boolean }) announceOnConnect = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.announceOnConnect && this.heading) {
      announce(this.heading, this.tone === 'danger' ? 'assertive' : 'polite');
    }
  }

  #dismiss = (): void => {
    this.emit('ds-dismiss', { detail: null });
    this.remove();
  };

  override render(): TemplateResult {
    const role = this.tone === 'danger' ? 'alert' : 'status';
    return html`<div class="alert" part="alert" role=${role}>
      <div class="content">
        ${this.heading ? html`<div class="title" part="title">${this.heading}</div>` : nothing}
        <slot></slot>
        <slot name="actions"></slot>
      </div>
      ${this.dismissible
        ? html`<button type="button" class="close" aria-label="Dismiss" @click=${this.#dismiss}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>`
        : nothing}
    </div>`;
  }
}
