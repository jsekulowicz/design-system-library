import { html, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { listItemStyles } from './list-item.styles.js';

/**
 * @tag ds-list-item
 * @summary A single row in a `ds-list`. Three slots: leading / default / trailing.
 * @slot leading - Optional content rendered before the main label (avatar, swatch, icon).
 * @slot default - Main label or input.
 * @slot trailing - Optional trailing content (action button, value, chevron).
 */
export class DsListItem extends DsElement {
  static override styles = [...DsElement.styles, listItemStyles];

  @state() private _hasLeading = false;
  @state() private _hasTrailing = false;

  #onLeadingSlotChange = (e: Event) => {
    this._hasLeading = hasAssignedContent(e.target as HTMLSlotElement);
  };

  #onTrailingSlotChange = (e: Event) => {
    this._hasTrailing = hasAssignedContent(e.target as HTMLSlotElement);
  };

  override render(): TemplateResult {
    return html`<li part="item">
      <div class="leading" ?hidden=${!this._hasLeading}>
        <slot name="leading" @slotchange=${this.#onLeadingSlotChange}></slot>
      </div>
      <div class="content"><slot></slot></div>
      <div class="trailing" ?hidden=${!this._hasTrailing}>
        <slot name="trailing" @slotchange=${this.#onTrailingSlotChange}></slot>
      </div>
    </li>`;
  }
}

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  const nodes = slot.assignedNodes({ flatten: true });
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }
    return false;
  });
}
