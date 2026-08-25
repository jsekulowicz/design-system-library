import { type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../../data-display/icon/icons/x-mark.js';
import { dialogStyles } from './dialog.styles.js';
import { cardBodyScrollFadeStyles, scrollFadeStyles } from '../../shared/scroll-fade.styles.js';
import { ModalSurfaceController } from '../../shared/modal-surface.js';

export type DialogSize = 'sm' | 'md' | 'lg';

/**
 * @tag ds-dialog
 * @summary Modal dialog built on the native `<dialog>` element. Header and footer are sticky; only the body scrolls.
 * @slot title - Heading content rendered in the header row.
 * @slot default - Body content. Scrolls when it overflows.
 * @slot footer - Footer content, typically `<ds-button>` actions.
 * @csspart dialog - The native `<dialog>` element.
 * @csspart card - The card surface inside the dialog (forwarded from `ds-card`).
 * @csspart body - The scrolling body region (forwarded from `ds-card`).
 * @csspart close-button - The header close button.
 * @cssprop --ds-dialog-max-width - Width cap, overriding the one the `size` sets.
 * @cssprop [--ds-dialog-max-height=min(90vh, 720px)] - Height cap for the dialog and its card. Set this rather than `::part(dialog) { max-height }`, so the card follows the same cap.
 * @event ds-open - Fires after the dialog opens.
 * @event ds-close - Fires after the dialog closes. Detail: `{ returnValue: string }`.
 * @event ds-cancel - Fires when the dialog is dismissed via Escape or backdrop click.
 */
export class DsDialog extends DsElement {
  static override styles = [...DsElement.styles, scrollFadeStyles, cardBodyScrollFadeStyles, dialogStyles];

  @property({ type: Boolean, reflect: true }) open = false;
  @property() label = '';
  @property({ type: Boolean, reflect: true }) dismissible = true;
  @property({ reflect: true }) size: DialogSize = 'md';

  readonly #surface = new ModalSurfaceController(this);

  show(): void {
    this.#surface.show();
  }

  close(returnValue?: string): void {
    this.#surface.close(returnValue);
  }

  override updated(changed: PropertyValues): void {
    this.#surface.syncOpenState(changed);
  }

  override render(): TemplateResult {
    return this.#surface.render('md');
  }
}
