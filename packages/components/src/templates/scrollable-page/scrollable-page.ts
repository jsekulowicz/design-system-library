import { html, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { hasAssignedContent, hasNamedSlotContent } from '../../shared/slots.js';
import { scrollablePageStyles } from './scrollable-page.styles.js';

/**
 * @tag ds-scrollable-page
 * @summary Page region with an optional non-scrolling header and an edge-aligned content scroller.
 * @slot header - Content outside the scroller that remains stationary while the default slot scrolls.
 * @slot default - Scrollable page content.
 * @cssprop --ds-scrollable-page-padding-block - Outer block padding. Defaults to `var(--ds-space-5)`.
 * @cssprop --ds-scrollable-page-padding-inline - Header and content inline padding. Defaults to `var(--ds-space-5)`.
 * @cssprop --ds-scrollable-page-header-gap - Space between a populated header and the scrolling content. Defaults to `var(--ds-space-6)`.
 * @cssprop --ds-scrollable-page-content-gap - Gap between default-slot children. Defaults to `var(--ds-space-6)`.
 * @cssprop --ds-scrollable-page-max-width - Maximum width of header and content inner regions. Defaults to `none`.
 * @csspart header - Fixed header region.
 * @csspart scroller - Edge-to-edge scrolling region.
 * @csspart content - Padded content region inside the scroller.
 */
export class DsScrollablePage extends DsElement {
  static override styles = [...DsElement.styles, scrollablePageStyles];

  @state() private _hasHeader = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#syncHeaderPresence();
  }

  #syncHeaderPresence(slot?: HTMLSlotElement): void {
    this._hasHeader = slot ? hasAssignedContent(slot) : hasNamedSlotContent(this, 'header');
    this.toggleAttribute('header-empty', !this._hasHeader);
  }

  #onHeaderSlotChange = (event: Event): void => {
    this.#syncHeaderPresence(event.target as HTMLSlotElement);
  };

  override render(): TemplateResult {
    return html`
      <div class="header" part="header" ?hidden=${!this._hasHeader}>
        <div class="header-inner">
          <slot name="header" @slotchange=${this.#onHeaderSlotChange}></slot>
        </div>
      </div>
      <div class="scroller" part="scroller">
        <div class="content" part="content"><slot></slot></div>
      </div>
    `;
  }
}
