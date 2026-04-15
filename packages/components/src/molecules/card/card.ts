import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
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
 */
export class DsCard extends DsElement {
  static override styles = [...DsElement.styles, cardStyles];

  @property({ reflect: true }) elevation: CardElevation = 'none';
  @property({ reflect: true }) orientation: CardOrientation = 'vertical';
  @property({ type: Boolean, reflect: true }) interactive = false;

  override render(): TemplateResult {
    return html`<article class="card" part="card">
      <header class="header">
        <div>
          <slot name="eyebrow"></slot>
          <slot name="title"></slot>
        </div>
        <slot name="actions"></slot>
      </header>
      <div class="body"><slot></slot></div>
      <footer><slot name="footer"></slot></footer>
    </article>`;
  }
}
