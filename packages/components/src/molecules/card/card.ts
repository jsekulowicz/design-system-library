import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { cardStyles } from './card.styles.js';

export type CardElevation = 'none' | 'sm' | 'md';
export type CardOrientation = 'vertical' | 'horizontal';

/**
 * @tag ds-card
 * @summary Structured container with optional eyebrow, title, body and actions.
 * @slot eyebrow - Short classifier above the title.
 * @slot title - Heading content.
 * @slot default - Body content.
 * @slot footer - Footer content (actions, meta).
 * @csspart card - The outer container element.
 * @csspart body - The body wrapper that holds the default slot.
 */
export class DsCard extends DsElement {
  static override styles = [...DsElement.styles, cardStyles];

  @property({ reflect: true }) elevation: CardElevation = 'none';
  @property({ reflect: true }) orientation: CardOrientation = 'vertical';
  @property({ type: Boolean, reflect: true }) interactive = false;

  @state() private _hasActions = false;

  #onActionsSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasActions = slot.assignedNodes({ flatten: true }).length > 0;
  }

  override render(): TemplateResult {
    return html`<article class="card" part="card">
      <header class="header">
        <slot name="eyebrow"></slot>
        <slot name="title"></slot>
      </header>
      <div class="body" part="body"><slot></slot></div>
      <div class="actions" ?hidden=${!this._hasActions}>
        <slot name="actions" @slotchange=${this.#onActionsSlotChange}></slot>
      </div>
      <footer><slot name="footer"></slot></footer>
    </article>`;
  }
}
