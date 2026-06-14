import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { tooltipStyles } from './tooltip.styles.js';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

interface PopoverElement extends HTMLElement {
  showPopover(): void;
  hidePopover(): void;
}

function isPopoverElement(el: Element | null): el is PopoverElement {
  return !!el && typeof (el as Partial<PopoverElement>).showPopover === 'function';
}

/**
 * @tag ds-tooltip
 * @summary Contextual label that appears on hover/focus of the trigger element.
 * @slot default - The trigger element that the tooltip is anchored to.
 * @slot tip - The tooltip content (can be any HTML).
 * @csspart anchor - The wrapper around the trigger element.
 * @csspart tooltip - The tooltip bubble. Rendered in the Popover API top layer so it escapes ancestor overflow; positioned with CSS anchor positioning relative to the trigger.
 */
export class DsTooltip extends DsElement {
  static override styles = [...DsElement.styles, tooltipStyles];

  @property({ reflect: true }) placement: TooltipPlacement = 'top';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, attribute: 'hover-only' }) hoverOnly = false;
  @property({ type: Number }) delay = 0;
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false;

  @state() private _hovered = false;
  @state() private _focused = false;

  private _hoverTimer?: number;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearHoverTimer();
    this.#hide();
  }

  override updated(_changed: PropertyValues): void {
    if (this.#shouldShow()) {
      this.#show();
    } else {
      this.#hide();
    }
  }

  #shouldShow(): boolean {
    return this.open || this._hovered || (!this.hoverOnly && this._focused);
  }

  #clearHoverTimer = (): void => {
    if (this._hoverTimer !== undefined) {
      window.clearTimeout(this._hoverTimer);
      this._hoverTimer = undefined;
    }
  };

  #onMouseEnter = (): void => {
    this.#clearHoverTimer();
    if (this.delay > 0) {
      this._hoverTimer = window.setTimeout(() => {
        this._hovered = true;
      }, this.delay);
    } else {
      this._hovered = true;
    }
  };

  #onMouseLeave = (): void => {
    this.#clearHoverTimer();
    this._hovered = false;
  };

  #onFocusIn = (): void => {
    if (this.hoverOnly) {
      return;
    }
    this._focused = true;
  };

  #onFocusOut = (): void => {
    if (this.hoverOnly) {
      return;
    }
    this._focused = false;
  };

  #tooltipEl(): PopoverElement | null {
    const el = this.shadowRoot?.querySelector('.tooltip') ?? null;
    return isPopoverElement(el) ? el : null;
  }

  #show = (): void => {
    const tooltip = this.#tooltipEl();
    if (!tooltip) {
      return;
    }
    if (!tooltip.matches(':popover-open')) {
      try {
        tooltip.showPopover();
      } catch {
        // ignore — possibly unsupported
      }
    }
  };

  #hide = (): void => {
    const tooltip = this.#tooltipEl();
    if (!tooltip || !tooltip.matches(':popover-open')) {
      return;
    }
    try {
      tooltip.hidePopover();
    } catch {
      // ignore
    }
  };

  override render(): TemplateResult {
    return html`
      <div
        class="anchor"
        part="anchor"
        @mouseenter=${this.#onMouseEnter}
        @mouseleave=${this.#onMouseLeave}
        @focusin=${this.#onFocusIn}
        @focusout=${this.#onFocusOut}
      >
        <slot></slot>
        <div role="tooltip" part="tooltip" class="tooltip" popover="manual">
          <slot name="tip"></slot>
        </div>
      </div>
    `;
  }
}
