import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { cardStyles } from './card.styles.js';
import { hasAssignedContent } from '../../shared/slots.js';

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

  @state() private _hasEyebrow = false;
  @state() private _hasTitle = false;
  @state() private _hasActions = false;
  @state() private _hasFooter = false;

  #onEyebrowSlotChange = (e: Event) => {
    this._hasEyebrow = hasAssignedContent(e.target as HTMLSlotElement);
  };

  #onTitleSlotChange = (e: Event) => {
    this._hasTitle = hasAssignedContent(e.target as HTMLSlotElement);
  };

  #onActionsSlotChange = (e: Event) => {
    this._hasActions = hasAssignedContent(e.target as HTMLSlotElement);
  };

  #onFooterSlotChange = (e: Event) => {
    this._hasFooter = hasAssignedContent(e.target as HTMLSlotElement);
  };

  override render(): TemplateResult {
    const showHeader = this._hasEyebrow || this._hasTitle;
    return html`<article class="card" part="card">
      <header class="header" ?hidden=${!showHeader}>
        <slot name="eyebrow" @slotchange=${this.#onEyebrowSlotChange}></slot>
        <slot name="title" @slotchange=${this.#onTitleSlotChange}></slot>
      </header>
      <div class="body" part="body"><slot></slot></div>
      <div class="actions" ?hidden=${!this._hasActions}>
        <slot name="actions" @slotchange=${this.#onActionsSlotChange}></slot>
      </div>
      <footer ?hidden=${!this._hasFooter}>
        <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
      </footer>
    </article>`;
  }
}
