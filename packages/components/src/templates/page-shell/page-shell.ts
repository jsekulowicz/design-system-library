import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { pageShellStyles } from './page-shell.styles.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/define.js';
import '../../atoms/icon/icons/bars-3.js';
import '../../atoms/icon/icons/x-mark.js';

/**
 * @tag ds-page-shell
 * @summary Application frame: header + aside + main + footer with responsive collapse.
 * @slot brand - Top-left brand/logo.
 * @slot header-actions - Top-right actions.
 * @slot aside - Side navigation. When empty, the aside column and hamburger toggle are not rendered.
 * @slot default - Main content.
 * @slot footer - Footer content.
 * @cssprop --ds-page-shell-max-width - Outer cap for the shell's content column. Header inner content,
 *   the aside + main row, and footer inner content all centre at this width and align vertically.
 *   Defaults to `90rem` (1440px). Header and footer chrome (border, sticky background) remain
 *   full-bleed.
 */
export class DsPageShell extends DsElement {
  static override styles = [...DsElement.styles, pageShellStyles];

  @property() brand = '';
  @property({ attribute: 'menu-label' }) menuLabel = 'Navigation menu';
  @state() private _mobileNavOpen = false;
  @state() private _hasAside = false;
  @state() private _hasFooter = false;
  #resizeObserver: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#setMobileNav(false);
    document.addEventListener('keydown', this.#onDocumentKeydown);
    this.#resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      this.#syncLayout(entry.contentRect.width);
    });
    this.#resizeObserver.observe(this);
    this.#syncLayout(this.getBoundingClientRect().width);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#onDocumentKeydown);
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  override firstUpdated(): void {
    const aside = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="aside"]');
    const footer = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer"]');
    if (aside) {
      this._hasAside = hasAssignedContent(aside);
      this.toggleAttribute('aside-empty', !this._hasAside);
    }
    if (footer) {
      this._hasFooter = hasAssignedContent(footer);
      this.toggleAttribute('footer-empty', !this._hasFooter);
    }
  }

  #syncLayout = (width: number): void => {
    const isMobileLayout = width < 768;
    this.toggleAttribute('mobile-layout', isMobileLayout);
    if (!isMobileLayout && this._mobileNavOpen) {
      this.#setMobileNav(false);
    }
  };

  #onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this._mobileNavOpen) {
      this.#setMobileNav(false);
    }
  };

  #setMobileNav = (open: boolean): void => {
    this._mobileNavOpen = open;
    this.toggleAttribute('data-mobile-nav-open', open);
    if (open) {
      this.querySelector<HTMLElement>('[slot="aside"]')?.removeAttribute('collapsed');
    }
  };

  #toggleMobileNav = (): void => {
    this.#setMobileNav(!this._mobileNavOpen);
  };

  #closeMobileNav = (): void => {
    this.#setMobileNav(false);
  };

  #onAsideClick = (event: Event): void => {
    if (!this.hasAttribute('mobile-layout')) {
      return;
    }
    const clickedNavItem = event
      .composedPath()
      .some(
        (node) =>
          node instanceof HTMLElement &&
          (node.tagName === 'DS-NAV-ITEM' ||
            node.tagName === 'A' ||
            node.getAttribute('href') !== null),
      );
    if (clickedNavItem) {
      this.#closeMobileNav();
    }
  };

  #onAsideSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this._hasAside = hasAssignedContent(slot);
    this.toggleAttribute('aside-empty', !this._hasAside);
  };

  #onFooterSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this._hasFooter = hasAssignedContent(slot);
    this.toggleAttribute('footer-empty', !this._hasFooter);
  };

  override render(): TemplateResult {
    const menuIcon = this._mobileNavOpen ? 'x-mark' : 'bars-3';
    const ariaExpanded: 'true' | 'false' = this._mobileNavOpen ? 'true' : 'false';
    return html`<header part="header">
        <div class="shell-inner shell-inner--header">
          ${this._hasAside
            ? html`<ds-button
                class="menu-toggle"
                variant="ghost"
                size="sm"
                label=${this.menuLabel}
                aria-label=${this.menuLabel}
                aria-expanded=${ariaExpanded}
                aria-controls="mobile-aside"
                @click=${this.#toggleMobileNav}
              >
                <ds-icon slot="leading" name=${menuIcon} size="lg"></ds-icon>
              </ds-button>`
            : null}
          <div class="brand">
            <slot name="brand">${this.brand}</slot>
          </div>
          <div><slot name="header-actions"></slot></div>
        </div>
      </header>
      <button
        class="mobile-backdrop"
        type="button"
        aria-label="Close navigation"
        ?hidden=${!this._mobileNavOpen}
        @click=${this.#closeMobileNav}
      ></button>
      <div class="shell-body" part="body">
        <aside id="mobile-aside" part="aside" @click=${this.#onAsideClick}>
          <div class="drawer-header">
            <ds-button
              class="drawer-close"
              variant="ghost"
              size="sm"
              label="Close navigation"
              aria-label="Close navigation"
              @click=${this.#closeMobileNav}
            >
              <ds-icon slot="leading" name="x-mark" size="lg"></ds-icon>
            </ds-button>
          </div>
          <slot name="aside" @slotchange=${this.#onAsideSlotChange}></slot>
        </aside>
        <main part="main">
          <slot></slot>
        </main>
      </div>
      <footer part="footer">
        <div class="shell-inner shell-inner--footer">
          <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
        </div>
      </footer>`;
  }
}

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  const nodes = slot.assignedNodes({ flatten: true });
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }
    return false;
  });
}
