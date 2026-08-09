import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { progressBarStyles } from './progress-bar.styles.js';

/**
 * @tag ds-progress-bar
 * @summary Horizontal progress indicator with a centered label.
 * @slot default - Optional label rendered as outlined text centered over the bar.
 * @cssprop --ds-progress-color - The bar color Defaults to `--ds-color-accent`.
 * @cssprop --ds-progress-empty-color - The bar color. Defaults to `--ds-color-bg-muted`.
 * @cssprop --ds-progress-track-height - The bar height. Defaults to `0.25rem`.
 * @cssprop --ds-progress-height - The component (label + bar) height. Defaults to `2rem`.
 * @csspart bar - The bar container.
 * @csspart track - The bar track.
 * @csspart indicator - The filled portion.
 * @csspart label - The centered label text.
 */
export class DsProgressBar extends DsElement {
  static override styles = [...DsElement.styles, progressBarStyles];

  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property() label?: string;

  @state() private _hasLabel = false;

  private get percent(): number {
    if (!(this.max > 0)) {
      return 0;
    }
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  private get labelPercent(): number {
    if (!(this.percent > 0)) {
      return 0;
    }
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  private get isFull(): boolean {
    return this.max > 0 && this.value >= this.max;
  }

  private _onSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this._hasLabel = slot
      .assignedNodes({ flatten: true })
      .some((node) => (node.textContent ?? '').trim().length > 0 || node.nodeType === Node.ELEMENT_NODE);
  }

  override render(): TemplateResult {
    return html`
      <div
        class="progress-bar ${this._hasLabel ? '' : 'progress-bar--no-label'}"
        role="progressbar"
        aria-label=${ifDefined(this.label)}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        part="bar"
      >
        <div class="track" part="track">
          <div
            class="indicator ${this.isFull ? 'indicator--full' : ''}"
            part="indicator"
            style=${styleMap({ width: `${this.percent}%` })}
          ></div>
        </div>

        <div class="label" part="label" ?hidden=${!this._hasLabel}>
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `;
  }
}
