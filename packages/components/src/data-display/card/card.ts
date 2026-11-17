import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { cardStyles } from './card.styles.js';
import { SlotPresenceController } from '../../shared/slot-presence.js';

export type CardElevation = 'none' | 'sm' | 'md';
export type CardOrientation = 'vertical' | 'horizontal';

/**
 * @tag ds-card
 * @summary Structured container with optional eyebrow, title, body and actions.
 * @slot eyebrow - Short classifier above the title.
 * @slot title - Heading content.
 * @slot default - Body content.
 * @slot actions - Buttons or links for the card, aligned to the end below the tablet breakpoint.
 * @slot footer - Closing content below the actions, such as meta information.
 * @csspart card - The outer container element.
 * @csspart body - The body wrapper that holds the default slot.
 * @cssprop [--ds-card-padding=var(--ds-space-6)] - Space between the border and the content. Lower it for small cards such as tiles in a row.
 * @cssprop [--ds-card-gap=var(--ds-space-4)] - Space between the header, body, actions and footer.
 * @cssprop [--ds-card-border-color=var(--ds-color-border)] - Color of the border at rest. Set this rather than `--ds-color-border`, which would also recolor borders inside the card. The `interactive` hover color still wins.
 */
export class DsCard extends DsElement {
  static override styles = [...DsElement.styles, cardStyles];

  @property({ reflect: true }) elevation: CardElevation = 'none';
  @property({ reflect: true }) orientation: CardOrientation = 'vertical';
  @property({ type: Boolean, reflect: true }) interactive = false;

  readonly #slots = new SlotPresenceController(this, ['eyebrow', 'title', 'actions', 'footer']);

  override render(): TemplateResult {
    const showHeader = this.#slots.hasAny('eyebrow', 'title');
    return html`<article class="card" part="card">
      <header class="header" ?hidden=${!showHeader}>
        <slot name="eyebrow" @slotchange=${this.#slots.handleSlotChange}></slot>
        <slot name="title" @slotchange=${this.#slots.handleSlotChange}></slot>
      </header>
      <div class="body" part="body"><slot></slot></div>
      <div class="actions" ?hidden=${!this.#slots.has('actions')}>
        <slot name="actions" @slotchange=${this.#slots.handleSlotChange}></slot>
      </div>
      <footer ?hidden=${!this.#slots.has('footer')}>
        <slot name="footer" @slotchange=${this.#slots.handleSlotChange}></slot>
      </footer>
    </article>`;
  }
}
