import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tooltipStyles } from './tooltip.styles.js';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * @tag ds-tooltip
 * @summary Contextual label that appears on hover/focus of the trigger element.
 * @slot default - The trigger element that the tooltip is anchored to.
 * @slot tip - The tooltip content (can be any HTML).
 * @csspart tooltip - The tooltip bubble.
 */
export class DsTooltip extends DsElement {
  static override styles = [...DsElement.styles, tooltipStyles];

  @property({ reflect: true }) placement: TooltipPlacement = 'top';
  @property({ type: Boolean, reflect: true }) open = false;

  override render(): TemplateResult {
    return html`
      <div class="anchor">
        <slot></slot>
        <div role="tooltip" part="tooltip" class="tooltip">
          <slot name="tip"></slot>
        </div>
      </div>
    `;
  }
}
