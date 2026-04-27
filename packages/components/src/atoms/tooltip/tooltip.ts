import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tooltipStyles } from './tooltip.styles.js';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * @tag ds-tooltip
 * @summary Contextual label that appears on hover/focus of the trigger element.
 * @slot default - The trigger element that the tooltip is anchored to.
 * @slot tip - The tooltip content (can be any HTML).
 * @csspart anchor - The wrapper around the trigger element.
 * @csspart tooltip - The tooltip bubble.
 */
export class DsTooltip extends DsElement {
  static override styles = [...DsElement.styles, tooltipStyles];

  @property({ reflect: true }) placement: TooltipPlacement = 'top';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Number }) delay = 0;

  override updated(changed: PropertyValues): void {
    if (changed.has('delay')) {
      this.style.setProperty('--ds-tooltip-hover-delay', `${this.delay}ms`);
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="anchor" part="anchor">
        <slot></slot>
        <div role="tooltip" part="tooltip" class="tooltip">
          <slot name="tip"></slot>
        </div>
      </div>
    `;
  }
}
