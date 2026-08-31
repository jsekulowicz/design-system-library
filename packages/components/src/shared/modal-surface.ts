import { html, type PropertyValues, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { emit } from '@jsekulowicz/ds-core';
import type { CardElevation } from '../data-display/card/card.js';
import { ScrollFadeController } from './scroll-fade-controller.js';
import { closeNestedDialogs } from './nested-dialogs.js';

export interface ModalSurfaceHost extends ReactiveControllerHost, HTMLElement {
  open: boolean;
  dismissible: boolean;
  label: string;
  closeLabel: string;
  readonly uid: string;
}

export class ModalSurfaceController implements ReactiveController {
  readonly #host: ModalSurfaceHost;

  constructor(host: ModalSurfaceHost) {
    this.#host = host;
    new ScrollFadeController(host, () => this.#cardBody());
    host.addController(this);
  }

  get dialogEl(): HTMLDialogElement | null {
    return this.#host.shadowRoot?.querySelector('dialog') ?? null;
  }

  #cardBody(): HTMLElement | null {
    const card = this.#host.shadowRoot?.querySelector('ds-card');
    return (card?.shadowRoot?.querySelector('[part~="body"]') as HTMLElement | null) ?? null;
  }

  hostDisconnected(): void {
    const dialog = this.dialogEl;
    if (dialog?.open) {
      closeNestedDialogs(this.#host);
      dialog.close();
    }
  }

  show(): void {
    this.#host.open = true;
  }

  close(returnValue?: string): void {
    const dialog = this.dialogEl;
    if (returnValue !== undefined && dialog) {
      dialog.returnValue = returnValue;
    }
    this.#host.open = false;
  }

  syncOpenState(changed: PropertyValues): void {
    const dialog = this.dialogEl;
    if (!changed.has('open') || !dialog) {
      return;
    }
    if (this.#host.open && !dialog.open) {
      dialog.showModal();
      emit(this.#host, 'ds-open', { detail: null });
    } else if (!this.#host.open && dialog.open) {
      closeNestedDialogs(this.#host);
      dialog.close();
    }
  }

  #onBackdropClick = (event: MouseEvent): void => {
    if (!this.#host.dismissible) {
      return;
    }
    if (event.target === this.dialogEl) {
      this.close();
    }
  };

  #onCancel = (event: Event): void => {
    if (!this.#host.dismissible) {
      event.preventDefault();
      return;
    }
    emit(this.#host, 'ds-cancel', { detail: null });
  };

  #onNativeClose = (): void => {
    this.#host.open = false;
    emit(this.#host, 'ds-close', { detail: { returnValue: this.dialogEl?.returnValue ?? '' } });
  };

  #onCloseButtonClick = (): void => {
    this.close();
  };

  render(elevation: CardElevation): TemplateResult {
    const titleId = `${this.#host.uid}-title`;
    return html`<dialog
      part="dialog"
      aria-labelledby=${ifDefined(this.#host.label ? undefined : titleId)}
      aria-label=${ifDefined(this.#host.label || undefined)}
      @click=${this.#onBackdropClick}
      @cancel=${this.#onCancel}
      @close=${this.#onNativeClose}
    >
      <ds-card elevation=${elevation} exportparts="card,body">
        <div slot="title" class="title-row">
          <h2 id=${titleId} class="title-text"><slot name="title"></slot></h2>
          <ds-button
            class="close-btn"
            part="close-button"
            variant="ghost"
            size="sm"
            square
            label=${this.#host.closeLabel}
            @click=${this.#onCloseButtonClick}
          >
            <ds-icon slot="leading" name="x-mark" size="2xl"></ds-icon>
          </ds-button>
        </div>
        <slot></slot>
        <div slot="footer" class="footer"><slot name="footer"></slot></div>
      </ds-card>
    </dialog>`;
  }
}
