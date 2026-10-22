import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { DEFAULT_SLOT, SlotPresenceController } from '../../shared/slot-presence.js';
import { progressBarStyles } from './progress-bar.styles.js';

export type ProgressBarLabelAlign = 'start' | 'center' | 'end';

const LEADING_SLOT = 'leading';

/**
 * @tag ds-progress-bar
 * @summary Horizontal progress indicator with its label and an optional icon on the track.
 * @slot default - The label, drawn on the track in one color that stays legible over both the filled and the empty part.
 * @slot leading - An icon or badge at the start of the track. Draw it with `currentColor` to match the label.
 * @attr label-align - Where the label sits on the track: `start`, `center` (default) or `end`.
 * @cssprop --ds-progress-color - Any color; the fill keeps its hue and gets a lightness that contrasts with the label. Defaults to `--ds-color-accent`.
 * @cssprop --ds-progress-fill-color - An exact fill color, used as is. Bypasses the contrast guarantee of `--ds-progress-color`.
 * @cssprop --ds-progress-fill-lightness - The OKLCH lightness `--ds-progress-color` is moved to. Defaults to `0.52`.
 * @cssprop --ds-progress-empty-color - The empty part of the track. Defaults to `--ds-color-progress-track`.
 * @cssprop --ds-progress-label-color - The label and leading icon color. Defaults to `--ds-color-progress-label`.
 * @cssprop --ds-progress-outline-color - The outline around the whole track. Defaults to `--ds-color-progress-outline`, which only the dark theme makes visible.
 * @cssprop --ds-progress-outline-width - Defaults to `1px`.
 * @cssprop --ds-progress-height - The minimum track height. Defaults to `--ds-size-xs`.
 * @cssprop --ds-progress-padding-inline - Space between the track edges and its content. Defaults to `--ds-space-2`.
 * @cssprop --ds-progress-gap - Space between the leading icon and the label. Defaults to `--ds-space-2`.
 * @cssprop --ds-progress-radius - Defaults to `--ds-radius-xs`.
 * @cssprop --ds-progress-font-size - Defaults to `--ds-font-size-body-lg`.
 * @csspart track - The whole bar: the empty color, the outline and the content row.
 * @csspart indicator - The filled portion.
 * @csspart leading - The wrapper of the leading slot.
 * @csspart label - The wrapper of the label slot.
 */
export class DsProgressBar extends DsElement {
  static override styles = [...DsElement.styles, progressBarStyles];

  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property() label?: string;
  @property({ attribute: 'label-align', reflect: true }) labelAlign: ProgressBarLabelAlign = 'center';

  readonly #slots = new SlotPresenceController(this, [DEFAULT_SLOT, LEADING_SLOT]);

  private get percent(): number {
    if (!(this.max > 0)) {
      return 0;
    }
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  override render(): TemplateResult {
    return html`
      <div
        class="track"
        part="track"
        role="progressbar"
        aria-label=${ifDefined(this.label)}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
      >
        <div class="indicator" part="indicator" style=${styleMap({ width: `${this.percent}%` })}></div>
        <span class="leading" part="leading" ?hidden=${!this.#slots.has(LEADING_SLOT)}>
          <slot name=${LEADING_SLOT} @slotchange=${this.#slots.handleSlotChange}></slot>
        </span>
        <span class="label" part="label" ?hidden=${!this.#slots.has(DEFAULT_SLOT)}>
          <slot @slotchange=${this.#slots.handleSlotChange}></slot>
        </span>
      </div>
    `;
  }
}
