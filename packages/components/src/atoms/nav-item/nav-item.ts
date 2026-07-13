import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { navItemStyles } from './nav-item.styles.js';
import '../tooltip/define.js';

/**
 * @tag ds-nav-item
 * @summary Interactive navigation link. Renders an `<a>` and reflects `current` state via `aria-current`.
 * @slot default - The label.
 * @slot icon - Optional leading icon (typically `<ds-icon>`). Required when `compact` is set.
 * @csspart link - The internal `<a>`.
 * @csspart icon - The icon slot wrapper.
 * @csspart label - The label slot wrapper.
 */
export class DsNavItem extends DsElement {
  static override styles = [...DsElement.styles, ...navItemStyles];

  @property() href = '';
  @property() target?: '_self' | '_blank' | '_parent' | '_top';
  @property() rel?: string;
  @property({ type: Boolean, reflect: true }) current = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true }) compact = false;
  @property({
    type: Number,
    reflect: true,
    attribute: 'compact-hover-tooltip-delay',
  })
  compactHoverTooltipDelay = 1000;

  @state() private _hasIcon = false;
  @state() private _labelText = '';

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('compact') || changed.has('loading') || changed.has('_hasIcon')) {
      this.#warnIfMissingIcon();
    }
  }

  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector<HTMLAnchorElement>('a')?.focus(options);
  }

  #hasAssignedIcon(): boolean {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="icon"]');
    if (!slot) {
      return false;
    }

    return slot.assignedNodes({ flatten: true }).length > 0;
  }

  #warnIfMissingIcon(): void {
    if (this.compact && !this.loading && !this.#hasAssignedIcon()) {
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

  #onClick = (event: MouseEvent): void => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  #renderIcon(): TemplateResult {
    if (this.loading) {
      return html`<svg class="spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="56.55"
          stroke-dashoffset="14.14"
        />
      </svg>`;
    }
    return html`<slot name="icon" @slotchange=${this.#onIconSlotChange}></slot>`;
  }

  #renderInner(): TemplateResult {
    return html`<span class="icon" part="icon" ?hidden=${!this._hasIcon && !this.loading}>
        ${this.#renderIcon()}
      </span>
      <span class="label" part="label">
        <slot @slotchange=${this.#onLabelSlotChange}></slot>
      </span>`;
  }

  #renderLink(): TemplateResult {
    return html`<a
      class="link nav-control"
      part="link"
      href=${this.href}
      target=${this.target ?? nothing}
      rel=${this.rel ?? nothing}
      aria-current=${this.current ? 'page' : nothing}
      aria-disabled=${this.disabled || this.loading ? 'true' : nothing}
      aria-busy=${this.loading ? 'true' : nothing}
      aria-label=${this.compact && this._labelText ? this._labelText : nothing}
      @click=${this.#onClick}
    >
      ${this.#renderInner()}
    </a>`;
  }

  override render(): TemplateResult {
    if (this.compact) {
      return html`<ds-tooltip
        class="tooltip-wrapper"
        placement="right"
        delay=${this.compactHoverTooltipDelay}
      >
        ${this.#renderLink()}
        <span slot="tip">${this._labelText}</span>
      </ds-tooltip>`;
    }
    return this.#renderLink();
  }
}
