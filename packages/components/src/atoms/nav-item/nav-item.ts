import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navItemStyles } from './nav-item.styles.js';

/**
 * @tag ds-nav-item
 * @summary Interactive navigation link. Renders an `<a>` and reflects `current` state via `aria-current`.
 * @slot default - The label.
 * @slot icon - Optional leading icon (typically `<ds-icon>`).
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
  @state() private _hasIcon = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  #onIconSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    this._hasIcon = slot.assignedNodes({ flatten: true }).length > 0;
  }

  #renderInner(): TemplateResult {
    return html`<span class="icon" part="icon" ?hidden=${!this._hasIcon}>
        <slot name="icon" @slotchange=${this.#onIconSlotChange}></slot>
      </span>
      <span class="label" part="label"><slot></slot></span>`;
  }

  override render(): TemplateResult {
    if (this.disabled) {
      return html`<span class="link" part="link" aria-disabled="true">${this.#renderInner()}</span>`;
    }
    return html`<a
      class="link"
      part="link"
      href=${this.href}
      target=${this.target ?? nothing}
      rel=${this.rel ?? nothing}
      aria-current=${this.current ? 'page' : nothing}
    >
      ${this.#renderInner()}
    </a>`;
  }
}
