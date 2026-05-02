import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navbarStyles } from './navbar.styles.js';
import '../../atoms/icon/define.js';
import '../../atoms/icon/icons/bars-3.js';
import '../../atoms/icon/icons/x-mark.js';

/**
 * @tag ds-navbar
 * @summary Top-bar navigation shell. Collapses to a hamburger menu below the configured breakpoint.
 * @slot brand - Logo or wordmark (left).
 * @slot default - ds-nav-item children (center, collapses on mobile).
 * @slot actions - Buttons / user menu (right).
 * @csspart bar - The internal `<nav>` element.
 * @csspart brand - The brand wrapper.
 * @csspart links - The collapsible links wrapper (mobile menu when expanded).
 * @csspart actions - The actions wrapper.
 * @csspart toggle - The hamburger toggle button.
 * @csspart menu - The expandable links container.
 */
export class DsNavbar extends DsElement {
  static override styles = [...DsElement.styles, navbarStyles];

  @property() label = 'Primary';
  @property({ attribute: 'menu-label' }) menuLabel = 'Menu';

  @state() private _open = false;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.#onDocumentKeydown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#onDocumentKeydown);
  }

  #onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this._open) {
      this._open = false;
      this.removeAttribute('data-open');
      this.shadowRoot?.querySelector<HTMLButtonElement>('.toggle')?.focus();
    }
  };

  #onToggle = (): void => {
    this._open = !this._open;
    this.toggleAttribute('data-open', this._open);
  };

  override render(): TemplateResult {
    const menuId = `${this.uid}-menu`;
    const iconName = this._open ? 'x-mark' : 'bars-3';
    return html`<nav part="bar" aria-label=${this.label}>
      <div class="brand" part="brand"><slot name="brand"></slot></div>
      <div class="links" part="links">
        <button
          class="toggle"
          part="toggle"
          type="button"
          aria-label=${this.menuLabel}
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-controls=${menuId}
          @click=${this.#onToggle}
        >
          <ds-icon name=${iconName} size="lg"></ds-icon>
        </button>
        <div class="menu" part="menu" id=${menuId} role="list">
          <slot></slot>
        </div>
      </div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </nav>`;
  }
}
