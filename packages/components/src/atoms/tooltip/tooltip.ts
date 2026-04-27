import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tooltipStyles } from './tooltip.styles.js';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

const GAP = 6;

/**
 * @tag ds-tooltip
 * @summary Contextual label that appears on hover/focus of the trigger element.
 * @slot default - The trigger element that the tooltip is anchored to.
 * @slot tip - The tooltip content (can be any HTML).
 * @csspart anchor - The wrapper around the trigger element.
 * @csspart tooltip - The tooltip bubble (rendered with position:fixed; escapes ancestor overflow).
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
    this.removeEventListener('mouseenter', this.#onMouseEnter);
    this.removeEventListener('mouseleave', this.#onMouseLeave);
    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('focusout', this.#onFocusOut);
  }

  override updated(changed: PropertyValues): void {
    if (this.#shouldShow()) {
      this.#updatePosition();
    }
    if (changed.has('open') || changed.has('_hovered') || changed.has('_focused')) {
      this.toggleAttribute('data-visible', this.#shouldShow());
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

  #updatePosition = (): void => {
    const tooltip = this.shadowRoot?.querySelector('.tooltip') as HTMLElement | null;
    if (!tooltip) {
      return;
    }
    const rect = this.getBoundingClientRect();
    let top = 0;
    let left = 0;
    let transform = '';
    switch (this.placement) {
      case 'top':
        top = rect.top - GAP;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + GAP;
        transform = 'translateY(-50%)';
        break;
      case 'bottom':
        top = rect.bottom + GAP;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - GAP;
        transform = 'translate(-100%, -50%)';
        break;
    }
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.transform = transform;
  };

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
