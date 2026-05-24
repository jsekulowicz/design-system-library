import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { pageShellStyles } from './page-shell.styles.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/define.js';
import '../../atoms/icon/icons/bars-3.js';
import '../../molecules/drawer/define.js';
import '../../organisms/top-bar/define.js';

/**
 * @tag ds-page-shell
 * @summary Application frame: header + aside + main + optional footer with responsive collapse.
 * @slot brand - Top-left brand/logo.
 * @slot drawer-brand - Brand/logo shown in the mobile navigation drawer's title row. Falls back to the `brand` prop.
 * @slot header-actions - Top-right actions.
 * @slot aside - Primary side navigation (inline-start). On mobile, rendered inside a `ds-drawer` opened by the hamburger toggle. When empty, the column and hamburger toggle are not rendered.
 * @slot aside-end - Secondary side region (inline-end), e.g. table of contents, contextual help. Hidden on mobile.
 * @slot default - Main content.
 * @slot footer - Footer content.
 * @cssprop --ds-page-shell-max-width - Outer cap for the shell's content column. Header inner
 *   content and the aside + main row centre at this width and align vertically. Defaults to `none`.
 *   Header chrome remains full-bleed.
 */
export class DsPageShell extends DsElement {
  static override styles = [...DsElement.styles, pageShellStyles];

  @property() brand = '';
  @property({ attribute: 'menu-label' }) menuLabel = 'Navigation menu';
  @property({ attribute: 'end-label' }) endLabel = 'Secondary navigation';
  @state() private _mobileLayout = false;
  @state() private _mobileNavOpen = false;
  @state() private _hasAside = false;
  @state() private _hasAsideEnd = false;
  @state() private _hasFooter = false;
  #resizeObserver: ResizeObserver | null = null;
  #slotObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#syncSlotPresence();
    this.#slotObserver = new MutationObserver(this.#syncSlotPresence);
    this.#slotObserver.observe(this, {
      attributeFilter: ['slot'],
      attributes: true,
      childList: true,
      subtree: true,
    });
    this.#setMobileNav(false);
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
    this.#resizeObserver?.disconnect();
    this.#slotObserver?.disconnect();
    this.#resizeObserver = null;
    this.#slotObserver = null;
  }

  override firstUpdated(): void {
    this.#syncSlotPresence();
  }

  #syncSlotPresence = (): void => {
    const aside = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="aside"]');
    const asideEnd = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="aside-end"]');
    const footer = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer"]');
    this._hasAside = hasNamedSlotContent(this, 'aside', aside);
    this._hasAsideEnd = hasNamedSlotContent(this, 'aside-end', asideEnd);
    this._hasFooter = hasNamedSlotContent(this, 'footer', footer);
    this.toggleAttribute('aside-empty', !this._hasAside);
    this.toggleAttribute('aside-end-empty', !this._hasAsideEnd);
    this.toggleAttribute('footer-empty', !this._hasFooter);
  };

  #syncLayout = (width: number): void => {
    this._mobileLayout = width < 768;
    this.toggleAttribute('mobile-layout', this._mobileLayout);
    if (!this._mobileLayout && this._mobileNavOpen) {
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
    if (!this._mobileLayout) {
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

  #onAsideEndSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this._hasAsideEnd = hasAssignedContent(slot);
    this.toggleAttribute('aside-end-empty', !this._hasAsideEnd);
  };

  #onFooterSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this._hasFooter = hasAssignedContent(slot);
    this.toggleAttribute('footer-empty', !this._hasFooter);
  };

  override render(): TemplateResult {
    const ariaExpanded: 'true' | 'false' = this._mobileNavOpen ? 'true' : 'false';
    const hasFooter = this._hasFooter || hasNamedSlotContent(this, 'footer');
    return html`<header part="header">
        <ds-top-bar class="chrome" label=${this.menuLabel}>
          <slot name="brand" slot="brand">${this.brand}</slot>
          <slot name="header-actions" slot="actions"></slot>
          ${this._hasAside
            ? html`<ds-button
                slot="actions"
                class="menu-toggle"
                variant="ghost"
                size="sm"
                label=${this.menuLabel}
                aria-label=${this.menuLabel}
                aria-expanded=${ariaExpanded}
                aria-controls="mobile-aside"
                @click=${this.#toggleMobileNav}
              >
                <ds-icon slot="leading" name="bars-3" size="3xl"></ds-icon>
              </ds-button>`
            : null}
        </ds-top-bar>
      </header>
      <div class="shell-body" part="body">
        ${this._mobileLayout ? this.#renderMobileAside() : this.#renderDesktopAside()}
        <main part="main">
          <slot></slot>
        </main>
        <aside
          part="aside-end"
          aria-label=${this.endLabel}
          ?hidden=${!this._hasAsideEnd}
        >
          <slot name="aside-end" @slotchange=${this.#onAsideEndSlotChange}></slot>
        </aside>
      </div>
      ${hasFooter
        ? html`<footer part="footer">
            <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
          </footer>`
        : null}`;
  }

  #renderDesktopAside(): TemplateResult {
    return html`<aside
      id="mobile-aside"
      part="aside"
      aria-label=${this.menuLabel}
      @click=${this.#onAsideClick}
    >
      <slot name="aside" @slotchange=${this.#onAsideSlotChange}></slot>
    </aside>`;
  }

  #renderMobileAside(): TemplateResult {
    return html`<ds-drawer
      id="mobile-aside"
      part="aside"
      side="start"
      size="sm"
      ?open=${this._mobileNavOpen}
      label=${this.menuLabel}
      @ds-close=${this.#closeMobileNav}
      @ds-cancel=${this.#closeMobileNav}
      @click=${this.#onAsideClick}
    >
      <slot name="drawer-brand" slot="title">${this.brand}</slot>
      <slot name="aside" @slotchange=${this.#onAsideSlotChange}></slot>
    </ds-drawer>`;
  }
}

function hasNamedSlotContent(
  host: HTMLElement,
  name: string,
  slot?: HTMLSlotElement | null,
): boolean {
  if (slot) {
    return hasAssignedContent(slot);
  }
  return Array.from(host.children).some((child) => child.slot === name);
}

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  const nodes = slot.assignedNodes({ flatten: true });
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }
    return false;
  });
}
