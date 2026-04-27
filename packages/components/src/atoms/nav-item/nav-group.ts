import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navGroupStyles } from './nav-group.styles.js';

const HOVER_TOOLTIP_DELAY_MS = 2000;

/**
 * @tag ds-nav-group
 * @summary Collapsible heading + nested ds-nav-item children. Uses the disclosure pattern.
 * @slot default - ds-nav-item children.
 * @slot icon - Optional leading icon for the heading. Required when `compact` is set.
 * @event ds-group-toggle - Fires when the user toggles the heading. Detail: `{ expanded: boolean }`.
 * @csspart heading - The internal `<button>` heading.
 * @csspart chevron - The chevron icon wrapper.
 * @csspart items - The nested items container.
 * @csspart tooltip - The compact-mode tooltip rendered on hover/focus.
 */
export class DsNavGroup extends DsElement {
  static override styles = [...DsElement.styles, navGroupStyles];

  @property() label = '';
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean }) collapsible = true;
  @property({ type: Boolean, reflect: true }) compact = false;

  @state() private _hasIcon = false;
  @state() private _tooltipVisible = false;
  @state() private _tooltipTop = 0;
  @state() private _tooltipLeft = 0;

  private _hoverTimer?: number;

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
        '[ds-nav-group] compact mode requires a child element with slot="icon".',
        this,
      );
    }
  }

  #onIconSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this._hasIcon = slot.assignedNodes({ flatten: true }).length > 0;
  };

  #onHeadingClick = (): void => {
    if (!this.collapsible) {
      return;
    }
    this.expanded = !this.expanded;
    this.emit('ds-group-toggle', { detail: { expanded: this.expanded } });
  };

  #showTooltip = (): void => {
    const rect = this.getBoundingClientRect();
    this._tooltipTop = rect.top + 22;
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

  #renderTooltip(): TemplateResult | typeof nothing {
    if (!this.compact || !this._tooltipVisible || !this.label) {
      return nothing;
    }
    return html`<span
      class="tooltip"
      part="tooltip"
      role="tooltip"
      style=${`top:${this._tooltipTop}px;left:${this._tooltipLeft}px`}
      >${this.label}</span
    >`;
  }

  override render(): TemplateResult {
    const headingId = `${this.uid}-heading`;
    const itemsId = `${this.uid}-items`;
    const isOpen = !this.collapsible || this.expanded;
    return html`<button
        class="heading"
        part="heading"
        id=${headingId}
        type="button"
        aria-expanded=${this.collapsible ? String(isOpen) : 'true'}
        aria-controls=${itemsId}
        aria-label=${this.compact ? this.label : nothing}
        ?disabled=${!this.collapsible}
        @click=${this.#onHeadingClick}
        @mouseenter=${this.#onMouseEnter}
        @mouseleave=${this.#onMouseLeave}
        @focus=${this.#onFocus}
        @blur=${this.#onBlur}
      >
        <span class="icon" part="icon" ?hidden=${!this._hasIcon}>
          <slot name="icon" @slotchange=${this.#onIconSlotChange}></slot>
        </span>
        <span class="label">${this.label}</span>
        ${this.collapsible
          ? html`<span class="chevron" part="chevron" aria-hidden="true">
              <!-- Heroicons 2.2.0 — 16/solid: chevron-down -->
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>`
          : null}
      </button>
      <div
        class="items"
        part="items"
        id=${itemsId}
        role="list"
        aria-labelledby=${headingId}
        ?hidden=${!isOpen}
      >
        <slot></slot>
      </div>
      ${this.#renderTooltip()}`;
  }
}
