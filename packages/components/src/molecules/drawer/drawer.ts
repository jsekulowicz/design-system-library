import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../card/define.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/icons/x-mark.js';
import { drawerStyles } from './drawer.styles.js';
import { ScrollFadeController } from '../../shared/scroll-fade-controller.js';

export type DrawerSize = 'sm' | 'md' | 'lg';
export type DrawerSide = 'start' | 'end';

/**
 * @tag ds-drawer
 * @summary Edge-anchored modal panel built on the native `<dialog>` element. Slides in from the inline start or end with a sticky header (title + close) and a scrolling body.
 * @slot title - Heading content rendered in the header row.
 * @slot default - Body content. Scrolls when it overflows.
 * @slot footer - Footer content, typically `<ds-button>` actions.
 * @csspart dialog - The native `<dialog>` element.
 * @csspart card - The inner `ds-card` container.
 * @csspart body - The scrolling body region (forwarded from `ds-card`).
 * @csspart close-button - The header close button.
 * @event ds-open - Fires after the drawer opens.
 * @event ds-close - Fires after the drawer closes. Detail: `{ returnValue: string }`.
 * @event ds-cancel - Fires when the drawer is dismissed via Escape or backdrop click.
 */
export class DsDrawer extends DsElement {
  static override styles = [...DsElement.styles, drawerStyles];

  @property({ type: Boolean, reflect: true }) open = false;
  @property() label = '';
  @property({ type: Boolean, reflect: true }) dismissible = true;
  @property({ reflect: true }) size: DrawerSize = 'sm';
  @property({ reflect: true }) side: DrawerSide = 'start';

  @query('dialog') private _dialogEl?: HTMLDialogElement;

  private readonly _scrollFade = new ScrollFadeController(
    this,
    () =>
      (this.shadowRoot
        ?.querySelector('ds-card')
        ?.shadowRoot?.querySelector('[part~="body"]') as HTMLElement | null) ?? null,
  );

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
      this.emit('ds-open', { detail: null });
    } else if (!this.open && this._dialogEl.open) {
      this._dialogEl.close();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._dialogEl?.open) this._dialogEl.close();
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
      <ds-card elevation="none" part="card">
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
