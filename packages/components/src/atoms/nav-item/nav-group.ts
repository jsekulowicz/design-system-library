import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { navGroupStyles } from './nav-group.styles.js';
import '../../atoms/icon/icons/chevron-down.js';
import '../tooltip/define.js';

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
  static override styles = [...DsElement.styles, ...navGroupStyles];

  @property() label = '';
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean }) collapsible = true;
  @property({ type: Boolean, reflect: true }) compact = false;
  @property({
    type: Number,
    reflect: true,
    attribute: 'compact-hover-tooltip-delay',
  })
  compactHoverTooltipDelay = 1000;

  @state() private _hasIcon = false;

  override updated(changed: PropertyValues): void {
    if (changed.has('compact') || changed.has('_hasIcon')) {
      this.#warnIfMissingIcon();
    }
  }

  #hasAssignedIcon(): boolean {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="icon"]');
    if (!slot) {
      return false;
    }

    return slot.assignedNodes({ flatten: true }).length > 0;
  }

  #warnIfMissingIcon(): void {
    if (this.compact && !this.#hasAssignedIcon()) {
      console.error(
        '[ds-nav-group] compact mode requires a child element with slot="icon".',
        this,
      );
    }
  }

  #onIconSlotChange = (): void => {
    this._hasIcon = this.#hasAssignedIcon();
    this.#warnIfMissingIcon();
  };

  #onHeadingClick = (): void => {
    if (!this.collapsible) {
      return;
    }
    this.expanded = !this.expanded;
    this.emit('ds-group-toggle', { detail: { expanded: this.expanded } });
  };

  #renderIcon(): TemplateResult {
    const iconSlot = html`<slot name="icon" @slotchange=${this.#onIconSlotChange}></slot>`;
    if (this._hasIcon) {
      return html`<span class="icon" part="icon">${iconSlot}</span>`;
    }
    return html`<slot
      class="icon-probe"
      name="icon"
      @slotchange=${this.#onIconSlotChange}
    ></slot>`;
  }

  #renderHeading(): TemplateResult {
    const headingId = `${this.uid}-heading`;
    const itemsId = `${this.uid}-items`;
    const isOpen = !this.collapsible || this.expanded;
    return html`<button
      class="heading nav-control"
      part="heading"
      id=${headingId}
      type="button"
      aria-expanded=${this.collapsible ? (isOpen ? 'true' : 'false') : 'true'}
      aria-controls=${itemsId}
      aria-label=${this.compact ? this.label : ''}
      ?disabled=${!this.collapsible}
      @click=${this.#onHeadingClick}
    >
      ${this.#renderIcon()}
      <span class="label">${this.label}</span>
      ${this.collapsible
        ? html`<ds-icon class="chevron" name="chevron-down" size="lg"></ds-icon>`
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
          delay=${this.compactHoverTooltipDelay}
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
