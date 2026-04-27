import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
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
 * @csspart tooltip - The tooltip bubble. Uses the Popover API top layer so it escapes ancestor overflow while staying anchored to the trigger via position:absolute.
 */
export class DsTooltip extends DsElement {
  static override styles = [...DsElement.styles, tooltipStyles];

  @property({ reflect: true }) placement: TooltipPlacement = 'top';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Number }) delay = 0;

  @state() private _hovered = false;
  @state() private _focused = false;

  private _hoverTimer?: number;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.#onMouseEnter);
    this.addEventListener('mouseleave', this.#onMouseLeave);
    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onFocusOut);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearHoverTimer();
    this.#hide();
    this.removeEventListener('mouseenter', this.#onMouseEnter);
    this.removeEventListener('mouseleave', this.#onMouseLeave);
    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('focusout', this.#onFocusOut);
  }

  override updated(_changed: PropertyValues): void {
    if (this.#shouldShow()) {
      this.#show();
    } else {
      this.#hide();
    }
  }

  #shouldShow(): boolean {
    return this.open || this._hovered || this._focused;
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
    this._focused = true;
  };

  #onFocusOut = (): void => {
    this._focused = false;
  };

  #tooltipEl(): PopoverElement | null {
    const el = this.shadowRoot?.querySelector('.tooltip') ?? null;
    return isPopoverElement(el) ? el : null;
  }

  #show = (): void => {
    const tooltip = this.#tooltipEl();
    if (!tooltip || tooltip.matches(':popover-open')) {
      return;
    }
    try {
      tooltip.showPopover();
    } catch {
      // Already shown by another path, or popover unsupported.
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
      // Already hidden.
    }
  };

  override render(): TemplateResult {
    return html`
      <div class="anchor" part="anchor">
        <slot></slot>
        <div role="tooltip" part="tooltip" class="tooltip" popover="manual">
          <slot name="tip"></slot>
        </div>
      </div>
    `;
  }
}
