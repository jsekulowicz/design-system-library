import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../../atoms/skeleton/define.js';
import { SlotPresenceController } from '../../shared/slot-presence.js';
import { statTileStyles } from './stat-tile.styles.js';

/**
 * @tag ds-stat-tile
 * @summary Compact statistic with a prominent value, label, and optional hint.
 * @slot value - Overrides the displayed value.
 * @slot label - Overrides the label.
 * @slot hint - Optional supporting detail, including consumer-provided loading content.
 * @csspart tile - The outer tile container.
 * @csspart value - The prominent statistic value.
 * @csspart label - The statistic label.
 * @csspart hint - The optional supporting detail.
 */
export class DsStatTile extends DsElement {
  static override styles = [...DsElement.styles, statTileStyles];

  @property() value: string | number = '';
  @property() label = '';
  @property() hint?: string;
  @property({ type: Boolean, reflect: true }) loading = false;

  readonly #slots = new SlotPresenceController(this, ['label', 'hint']);

  override render(): TemplateResult {
    return html`
      <div class="tile" part="tile" aria-busy=${this.loading ? 'true' : 'false'}>
        <div class="value" part="value">
          ${
            this.loading
              ? html`<ds-skeleton width="4rem"></ds-skeleton>`
              : html`<slot name="value">${this.value}</slot>`
          }
        </div>
        <div class="label" part="label" ?hidden=${!this.label.trim() && !this.#slots.has('label')}>
          <slot name="label" @slotchange=${this.#slots.handleSlotChange}>${this.label}</slot>
        </div>
        <div class="hint" part="hint" ?hidden=${!this.hint?.trim() && !this.#slots.has('hint')}>
          <slot name="hint" @slotchange=${this.#slots.handleSlotChange}>${this.hint}</slot>
        </div>
      </div>
    `;
  }
}
