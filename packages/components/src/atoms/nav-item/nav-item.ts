import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navItemStyles } from './nav-item.styles.js';

const HOVER_TOOLTIP_DELAY_MS = 2000;

/**
 * @tag ds-nav-item
 * @summary Interactive navigation link. Renders an `<a>` and reflects `current` state via `aria-current`.
 * @slot default - The label.
 * @slot icon - Optional leading icon (typically `<ds-icon>`). Required when `compact` is set.
 * @csspart link - The internal `<a>` (or `<span>` when disabled).
 * @csspart icon - The icon slot wrapper.
 * @csspart label - The label slot wrapper.
 * @csspart tooltip - The compact-mode tooltip rendered on hover/focus.
 */
export class DsNavItem extends DsElement {
  static override styles = [...DsElement.styles, navItemStyles];

  @property() href = '';
  @property() target?: '_self' | '_blank' | '_parent' | '_top';
  @property() rel?: string;
  @property({ type: Boolean, reflect: true }) current = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) compact = false;

  @state() private _hasIcon = false;
  @state() private _labelText = '';
  @state() private _tooltipVisible = false;
  @state() private _tooltipTop = 0;
  @state() private _tooltipLeft = 0;

  private _hoverTimer?: number;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearHoverTimer();
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('compact') || changed.has('_hasIcon')) {
      this.#warnIfMissingIcon();
    }
    if (changed.has('compact') && !this.compact) {
      this.#hideTooltip();
    }
  }

  #warnIfMissingIcon(): void {
    if (this.compact && !this._hasIcon) {
      console.error(
        '[ds-nav-item] compact mode requires a child element with slot="icon".',
        this,
      );
    }
  }

  #onIconSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this._hasIcon = slot.assignedNodes({ flatten: true }).length > 0;
  };

  #onLabelSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this._labelText = nodes
      .map((n) => n.textContent ?? '')
      .join('')
      .trim();
  };

  #showTooltip = (): void => {
    const rect = this.getBoundingClientRect();
    this._tooltipTop = rect.top + rect.height / 2;
    this._tooltipLeft = rect.right + 6;
    this._tooltipVisible = true;
  };

  #hideTooltip = (): void => {
    this.#clearHoverTimer();
    this._tooltipVisible = false;
  };

  #clearHoverTimer = (): void => {
    if (this._hoverTimer !== undefined) {
      window.clearTimeout(this._hoverTimer);
      this._hoverTimer = undefined;
    }
  };

  #onMouseEnter = (): void => {
    if (!this.compact) {
      return;
    }
    this.#clearHoverTimer();
    this._hoverTimer = window.setTimeout(this.#showTooltip, HOVER_TOOLTIP_DELAY_MS);
  };

  #onMouseLeave = (): void => {
    this.#hideTooltip();
  };

  #onFocus = (): void => {
    if (!this.compact) {
      return;
    }
    this.#showTooltip();
  };

  #onBlur = (): void => {
    this.#hideTooltip();
  };

  #renderInner(): TemplateResult {
    return html`<span class="icon" part="icon" ?hidden=${!this._hasIcon}>
        <slot name="icon" @slotchange=${this.#onIconSlotChange}></slot>
      </span>
      <span class="label" part="label">
        <slot @slotchange=${this.#onLabelSlotChange}></slot>
      </span>`;
  }

  #renderTooltip(): TemplateResult | typeof nothing {
    if (!this.compact || !this._tooltipVisible || !this._labelText) {
      return nothing;
    }
    return html`<span
      class="tooltip"
      part="tooltip"
      role="tooltip"
      style=${`top:${this._tooltipTop}px;left:${this._tooltipLeft}px`}
      >${this._labelText}</span
    >`;
  }

  override render(): TemplateResult {
    if (this.disabled) {
      return html`<span
          class="link"
          part="link"
          aria-disabled="true"
          aria-label=${this.compact && this._labelText ? this._labelText : nothing}
          @mouseenter=${this.#onMouseEnter}
          @mouseleave=${this.#onMouseLeave}
          >${this.#renderInner()}</span
        >${this.#renderTooltip()}`;
    }
    return html`<a
        class="link"
        part="link"
        href=${this.href}
        target=${this.target ?? nothing}
        rel=${this.rel ?? nothing}
        aria-current=${this.current ? 'page' : nothing}
        aria-label=${this.compact && this._labelText ? this._labelText : nothing}
        @mouseenter=${this.#onMouseEnter}
        @mouseleave=${this.#onMouseLeave}
        @focus=${this.#onFocus}
        @blur=${this.#onBlur}
      >
        ${this.#renderInner()}
      </a>${this.#renderTooltip()}`;
  }
}
