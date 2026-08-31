import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement, announce } from '@jsekulowicz/ds-core';
import '../../data-display/icon/icons/x-mark.js';
import { noticeStyles } from '../../shared/notice.styles.js';
import { alertStyles } from './alert.styles.js';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/**
 * @tag ds-alert
 * @summary Inline message with tone, optional title, and dismissal.
 * @slot default - Message body.
 * @slot actions - Optional action row below the message.
 * @csspart close-button - The dismiss button, when `dismissible` is set.
 * @event ds-dismiss - Fires when the close button is activated.
 */
export class DsAlert extends DsElement {
  static override styles = [...DsElement.styles, noticeStyles, alertStyles];

  @property({ reflect: true }) tone: AlertTone = 'info';
  @property() heading?: string;
  @property({ type: Boolean, reflect: true }) dismissible = false;
  @property({ attribute: 'dismiss-label' }) dismissLabel = 'Dismiss';
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
    return html`<div class="notice" part="alert" role=${role}>
      <div class="content">
        ${this.heading ? html`<div class="title" part="title">${this.heading}</div>` : nothing}
        <slot></slot>
        <slot name="actions"></slot>
      </div>
      ${
        this.dismissible
          ? html`<ds-button
              class="close-btn"
              part="close-button"
              variant="ghost"
              size="sm"
              square
              label=${this.dismissLabel}
              @click=${this.#dismiss}
            >
              <ds-icon slot="leading" name="x-mark" size="2xl"></ds-icon>
            </ds-button>`
          : nothing
      }
    </div>`;
  }
}
