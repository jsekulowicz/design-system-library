import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navGroupStyles } from './nav-group.styles.js';
import '../tooltip/define.js';

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
 */
export class DsNavGroup extends DsElement {
  static override styles = [...DsElement.styles, navGroupStyles];

  @property() label = '';
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean }) collapsible = true;
  @property({ type: Boolean, reflect: true }) compact = false;

  @state() private _hasIcon = false;

  override updated(changed: PropertyValues): void {
    if (changed.has('compact') || changed.has('_hasIcon')) {
      this.#warnIfMissingIcon();
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

  #renderHeading(): TemplateResult {
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
      aria-label=${this.compact ? this.label : ''}
      ?disabled=${!this.collapsible}
      @click=${this.#onHeadingClick}
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
    </button>`;
  }

  override render(): TemplateResult {
    const itemsId = `${this.uid}-items`;
    const headingId = `${this.uid}-heading`;
    const isOpen = !this.collapsible || this.expanded;
    const heading = this.compact
      ? html`<ds-tooltip
          class="tooltip-wrapper"
          placement="right"
          delay=${HOVER_TOOLTIP_DELAY_MS}
          ?hover-only=${true}
        >
          ${this.#renderHeading()}
          <span slot="tip">${this.label}</span>
        </ds-tooltip>`
      : this.#renderHeading();
    return html`${heading}
      <div
        class="items"
        part="items"
        id=${itemsId}
        role="list"
        aria-labelledby=${headingId}
        ?hidden=${!isOpen}
      >
        <slot></slot>
      </div>`;
  }
}
