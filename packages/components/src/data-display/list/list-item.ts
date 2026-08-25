import { html, type TemplateResult } from 'lit';
import { DsElement } from '@jsekulowicz/ds-core';
import { listItemStyles } from './list-item.styles.js';
import { SlotPresenceController } from '../../shared/slot-presence.js';

/**
 * @tag ds-list-item
 * @summary A single row in a `ds-list`. Three slots: leading / default / trailing.
 * @slot leading - Optional content rendered before the main label (avatar, swatch, icon).
 * @slot default - Main label or input.
 * @slot trailing - Optional trailing content (action button, value, chevron).
 */
export class DsListItem extends DsElement {
  static override styles = [...DsElement.styles, listItemStyles];

  readonly #slots = new SlotPresenceController(this, ['leading', 'trailing']);

  override render(): TemplateResult {
    return html`<div role="listitem" part="item">
      <div class="leading" ?hidden=${!this.#slots.has('leading')}>
        <slot name="leading" @slotchange=${this.#slots.handleSlotChange}></slot>
      </div>
      <div class="content"><slot></slot></div>
      <div class="trailing" ?hidden=${!this.#slots.has('trailing')}>
        <slot name="trailing" @slotchange=${this.#slots.handleSlotChange}></slot>
      </div>
    </div>`;
  }
}
