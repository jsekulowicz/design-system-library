import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navItemStyles } from './nav-item.styles.js';
import '../tooltip/define.js';

const HOVER_TOOLTIP_DELAY_MS = 2000;

/**
 * @tag ds-nav-item
 * @summary Interactive navigation link. Renders an `<a>` and reflects `current` state via `aria-current`.
 * @slot default - The label.
 * @slot icon - Optional leading icon (typically `<ds-icon>`). Required when `compact` is set.
 * @csspart link - The internal `<a>` (or `<span>` when disabled).
 * @csspart icon - The icon slot wrapper.
 * @csspart label - The label slot wrapper.
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

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

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
        '[ds-nav-item] compact mode requires a child element with slot="icon".',
        this,
      );
    }
  }

  #onIconSlotChange = (): void => {
    this._hasIcon = this.#hasAssignedIcon();
    this.#warnIfMissingIcon();
  };

  #onLabelSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this._labelText = nodes
      .map((n) => n.textContent ?? '')
      .join('')
      .trim();
  };

  #renderInner(): TemplateResult {
    return html`<span class="icon" part="icon" ?hidden=${!this._hasIcon}>
        <slot name="icon" @slotchange=${this.#onIconSlotChange}></slot>
      </span>
      <span class="label" part="label">
        <slot @slotchange=${this.#onLabelSlotChange}></slot>
      </span>`;
  }

  #renderLink(): TemplateResult {
    if (this.disabled) {
      return html`<span
        class="link"
        part="link"
        aria-disabled="true"
        aria-label=${this.compact && this._labelText ? this._labelText : nothing}
        >${this.#renderInner()}</span
      >`;
    }
    return html`<a
      class="link"
      part="link"
      href=${this.href}
      target=${this.target ?? nothing}
      rel=${this.rel ?? nothing}
      aria-current=${this.current ? 'page' : nothing}
      aria-label=${this.compact && this._labelText ? this._labelText : nothing}
    >
      ${this.#renderInner()}
    </a>`;
  }

  override render(): TemplateResult {
    if (this.compact) {
      return html`<ds-tooltip
        class="tooltip-wrapper"
        placement="right"
        delay=${HOVER_TOOLTIP_DELAY_MS}
        ?hover-only=${true}
      >
        ${this.#renderLink()}
        <span slot="tip">${this._labelText}</span>
      </ds-tooltip>`;
    }
    return this.#renderLink();
  }
}
