import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { progressBarStyles } from './progress-bar.styles.js';

/**
 * @tag ds-progress-bar
 * @summary Horizontal progress indicator with a centered label slot.
 * @slot default - Optional label rendered on a chip centered over the bar.
 * @csspart track - The bar track; set `height` here to resize the bar.
 * @csspart indicator - The filled portion; set `background` here to recolor it.
 * @csspart label - The centered label chip.
 */
export class DsProgressBar extends DsElement {
  static override styles = [...DsElement.styles, progressBarStyles];

  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property() label?: string;

  @state() private hasLabel = false;

  private get percent(): number {
    if (!(this.max > 0)) {
      return 0;
    }
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  private get isFull(): boolean {
    return this.max > 0 && this.value >= this.max;
  }

  private onSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this.hasLabel = slot
      .assignedNodes({ flatten: true })
      .some((node) => (node.textContent ?? '').trim().length > 0 || node.nodeType === Node.ELEMENT_NODE);
  }

  override render(): TemplateResult {
    return html`
      <div
        class="track"
        part="track"
        role="progressbar"
        aria-label=${this.label ?? nothing}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
      >
        <div
          class="indicator ${this.isFull ? 'indicator--full' : ''}"
          part="indicator"
          style=${styleMap({ width: `${this.percent}%` })}
        ></div>
        <div class="label-layer">
          <span class="label ${this.hasLabel ? '' : 'label--empty'}" part="label">
            <slot @slotchange=${this.onSlotChange}></slot>
          </span>
        </div>
      </div>
    `;
  }
}
