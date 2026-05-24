import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../card/define.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/icons/x-mark.js';
import { dialogStyles } from './dialog.styles.js';

export type DialogSize = 'sm' | 'md' | 'lg';

/**
 * @tag ds-dialog
 * @summary Modal dialog built on the native `<dialog>` element. Header and footer are sticky; only the body scrolls.
 * @slot title - Heading content rendered in the header row.
 * @slot default - Body content. Scrolls when it overflows.
 * @slot footer - Footer content, typically `<ds-button>` actions.
 * @csspart dialog - The native `<dialog>` element.
 * @csspart card - The inner `ds-card` container.
 * @csspart body - The scrolling body region (forwarded from `ds-card`).
 * @csspart close-button - The header close button.
 * @event ds-open - Fires after the dialog opens.
 * @event ds-close - Fires after the dialog closes. Detail: `{ returnValue: string }`.
 * @event ds-cancel - Fires when the dialog is dismissed via Escape or backdrop click.
 */
export class DsDialog extends DsElement {
  static override styles = [...DsElement.styles, dialogStyles];

  @property({ type: Boolean, reflect: true }) open = false;
  @property() label = '';
  @property({ type: Boolean, reflect: true }) dismissible = true;
  @property({ reflect: true }) size: DialogSize = 'md';

  @query('dialog') private _dialogEl?: HTMLDialogElement;

  show(): void {
    this.open = true;
  }

  close(returnValue?: string): void {
    if (returnValue !== undefined && this._dialogEl) {
      this._dialogEl.returnValue = returnValue;
    }
    this.open = false;
  }

  override updated(changed: PropertyValues): void {
    if (!changed.has('open') || !this._dialogEl) return;
    if (this.open && !this._dialogEl.open) {
      this._dialogEl.showModal();
      this._dialogEl.addEventListener('wheel', this.#onBackdropScroll, { passive: false });
      this._dialogEl.addEventListener('touchmove', this.#onBackdropScroll, { passive: false });
      this.emit('ds-open', { detail: null });
    } else if (!this.open && this._dialogEl.open) {
      this._dialogEl.close();
      this._dialogEl.removeEventListener('wheel', this.#onBackdropScroll);
      this._dialogEl.removeEventListener('touchmove', this.#onBackdropScroll);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._dialogEl?.open) this._dialogEl.close();
    this._dialogEl?.removeEventListener('wheel', this.#onBackdropScroll);
    this._dialogEl?.removeEventListener('touchmove', this.#onBackdropScroll);
  }

  #onBackdropClick = (event: MouseEvent): void => {
    if (!this.dismissible) return;
    if (event.target === this._dialogEl) this.close();
  };

  #onCancel = (event: Event): void => {
    if (!this.dismissible) {
      event.preventDefault();
      return;
    }
    this.emit('ds-cancel', { detail: null });
  };

  #onNativeClose = (): void => {
    this.open = false;
    this.emit('ds-close', {
      detail: { returnValue: this._dialogEl?.returnValue ?? '' },
    });
  };

  #onCloseButtonClick = (): void => {
    this.close();
  };

  // Wheel / touchmove events that target the dialog itself (i.e. the
  // user is scrolling over the backdrop, not inside the body) would
  // otherwise bubble up and scroll whatever ancestor scroll container
  // the dialog happens to sit in. Cancel them here so the page behind
  // the modal stays put. Events bubbled up from the body proceed
  // normally — the body's own overscroll-behavior:contain handles the
  // inside-boundary case.
  #onBackdropScroll = (event: Event): void => {
    if (event.target === this._dialogEl) event.preventDefault();
  };

  override render(): TemplateResult {
    const titleId = `${this.uid}-title`;
    const useLabelledBy = !this.label;
    return html`<dialog
      part="dialog"
      aria-labelledby=${ifDefined(useLabelledBy ? titleId : undefined)}
      aria-label=${ifDefined(this.label || undefined)}
      @click=${this.#onBackdropClick}
      @cancel=${this.#onCancel}
      @close=${this.#onNativeClose}
    >
      <ds-card elevation="md" part="card">
        <div slot="title" class="title-row">
          <h2 id=${titleId} class="title-text"><slot name="title"></slot></h2>
          <ds-button
            class="close-btn"
            part="close-button"
            variant="ghost"
            size="sm"
            square
            label="Close"
            @click=${this.#onCloseButtonClick}
          >
            <ds-icon
              slot="leading"
              name="x-mark"
              size="2xl"
            ></ds-icon>
          </ds-button>
        </div>
        <slot></slot>
        <div slot="footer" class="footer"><slot name="footer"></slot></div>
      </ds-card>
    </dialog>`;
  }
}
