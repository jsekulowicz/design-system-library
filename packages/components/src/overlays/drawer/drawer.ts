import { type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../../data-display/icon/icons/x-mark.js';
import { drawerStyles } from './drawer.styles.js';
import { cardBodyScrollFadeStyles, scrollFadeStyles } from '../../shared/scroll-fade.styles.js';
import { ModalSurfaceController } from '../../shared/modal-surface.js';

export type DrawerSize = 'sm' | 'md' | 'lg';
export type DrawerSide = 'start' | 'end';

/**
 * @tag ds-drawer
 * @summary Edge-anchored modal panel built on the native `<dialog>` element. Slides in from the inline start or end with a sticky header (title + close) and a scrolling body.
 * @slot title - Heading content rendered in the header row.
 * @slot default - Body content. Scrolls when it overflows.
 * @slot footer - Footer content, typically `<ds-button>` actions.
 * @csspart dialog - The native `<dialog>` element.
 * @csspart card - The card surface inside the drawer (forwarded from `ds-card`).
 * @csspart body - The scrolling body region (forwarded from `ds-card`).
 * @csspart close-button - The header close button.
 * @cssprop [--ds-drawer-height=100dvh] - Height of the drawer and its card. Set this rather than `::part(dialog) { height }`, so the card follows the same height.
 * @event ds-open - Fires after the drawer opens.
 * @event ds-close - Fires after the drawer closes. Detail: `{ returnValue: string }`.
 * @event ds-cancel - Fires when the drawer is dismissed via Escape or backdrop click.
 */
export class DsDrawer extends DsElement {
  static override styles = [...DsElement.styles, scrollFadeStyles, cardBodyScrollFadeStyles, drawerStyles];

  @property({ type: Boolean, reflect: true }) open = false;
  @property() label = '';
  @property({ type: Boolean, reflect: true }) dismissible = true;
  @property({ reflect: true }) size: DrawerSize = 'sm';
  @property({ reflect: true }) side: DrawerSide = 'start';

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
    return this.#surface.render('none');
  }
}
