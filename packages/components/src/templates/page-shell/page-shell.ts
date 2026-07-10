import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { pageShellStyles } from './page-shell.styles.js';
import { scrollFadeStyles } from '../../shared/scroll-fade.styles.js';
import { ScrollFadeController } from '../../shared/scroll-fade-controller.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/define.js';
import '../../atoms/icon/icons/bars-3.js';
import '../../atoms/icon/icons/chevron-left.js';
import '../../atoms/icon/icons/chevron-right.js';
import '../../molecules/drawer/define.js';
import '../../organisms/top-bar/define.js';

export type PageShellAsideState = 'visible' | 'compact' | 'hidden';
export type PageShellAsideEndState = 'visible' | 'hidden';
export type PageShellMenuButtonPosition = 'start' | 'end';

/**
 * @tag ds-page-shell
 * @summary Application frame: header + aside + main + optional footer with responsive collapse.
 * @slot brand - Top-left brand/logo.
 * @slot drawer-brand - Brand/logo shown in the mobile navigation drawer's title row. Falls back to the `brand` prop.
 * @slot header-status - Top-right indicator widgets (e.g. points, balances) shown before the action buttons. Non-interactive status content that reads apart from the action buttons.
 * @slot header-actions - Top-right action buttons (account menu, notifications, etc.). The mobile navigation toggle is rendered as a peer of these buttons; see `mobile-menu-button-position`.
 * @slot aside - Primary side navigation (inline-start). On mobile, rendered inside a `ds-drawer` opened by the hamburger toggle. When empty, the column and hamburger toggle are not rendered.
 * @slot aside-end - Secondary side region (inline-end), e.g. table of contents, contextual help. Hidden on mobile.
 * @slot default - Main content.
 * @slot footer - Footer content.
 * @cssprop --ds-page-shell-max-width - Outer cap for the shell's content column. Header inner
 *   content and the aside + main row centre at this width and align vertically. Defaults to `none`.
 *   Header chrome remains full-bleed.
 * @cssprop --ds-page-shell-menu-toggle-size - Box size of the mobile navigation toggle button.
 *   Defaults to `var(--ds-size-sm)`. Set to e.g. `var(--ds-size-md)` to match full-size action buttons.
 * @csspart menu-toggle - The mobile navigation toggle button.
 * @event ds-aside-state-change - Emitted when an opt-in desktop aside toggle changes state.
 *   Detail: `{ side, state, previousState }`.
 */
export class DsPageShell extends DsElement {
  static override styles = [...DsElement.styles, scrollFadeStyles, pageShellStyles];

  @property() brand = '';
  @property({ attribute: 'menu-label' }) menuLabel = 'Navigation menu';
  @property({ attribute: 'end-label' }) endLabel = 'Secondary navigation';
  @property({ type: Boolean, reflect: true, attribute: 'aside-toggle' }) asideToggle = false;
  @property({ type: Boolean, reflect: true, attribute: 'aside-end-toggle' }) asideEndToggle = false;
  @property({ reflect: true, attribute: 'aside-state' }) asideState: PageShellAsideState = 'visible';
  @property({ reflect: true, attribute: 'aside-end-state' }) asideEndState: PageShellAsideEndState = 'visible';
  @property({ reflect: true, attribute: 'mobile-menu-button-position' })
  mobileMenuButtonPosition: PageShellMenuButtonPosition = 'end';
  @state() private _mobileLayout = false;
  @state() private _mobileNavOpen = false;
  @state() private _hasAside = false;
  @state() private _hasAsideEnd = false;
  @state() private _hasFooter = false;
  #resizeObserver: ResizeObserver | null = null;
  #slotObserver: MutationObserver | null = null;

  private readonly _asideScrollFade = new ScrollFadeController(
    this,
    () => this.shadowRoot?.querySelector('aside[part="aside"]'),
  );

  private readonly _asideEndScrollFade = new ScrollFadeController(
    this,
    () => this.shadowRoot?.querySelector('aside[part="aside-end"]'),
  );

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

  override updated(changed: PropertyValues): void {
    if (
      changed.has('asideState') ||
      changed.has('_mobileLayout') ||
      changed.has('_hasAside')
    ) {
      this.#syncSlottedAsideCollapsed();
    }
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
    this.#syncSlottedAsideCollapsed();
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

  #syncSlottedAsideCollapsed(): void {
    const aside = this.querySelector<HTMLElement>('[slot="aside"]');
    if (!aside || this._mobileLayout) {
      return;
    }
    if (!this.asideToggle && this.asideState === 'visible') {
      return;
    }
    aside.toggleAttribute('collapsed', this.asideState !== 'visible');
  }

  #showStartToggle(): boolean {
    return this.asideToggle && this._hasAside && !this._mobileLayout;
  }

  #showEndToggle(): boolean {
    return this.asideEndToggle && this._hasAsideEnd && !this._mobileLayout;
  }

  #nextAsideState(): PageShellAsideState {
    if (this.asideState === 'visible') {
      return 'compact';
    }
    if (this.asideState === 'compact') {
      return 'hidden';
    }
    return 'visible';
  }

  #nextAsideEndState(): PageShellAsideEndState {
    return this.asideEndState === 'visible' ? 'hidden' : 'visible';
  }

  #setAsideState(state: PageShellAsideState): void {
    const previousState = this.asideState;
    if (state === previousState) {
      return;
    }
    this.asideState = state;
    this.emit('ds-aside-state-change', {
      detail: { side: 'start' as const, state, previousState },
    });
  }

  #setAsideEndState(state: PageShellAsideEndState): void {
    const previousState = this.asideEndState;
    if (state === previousState) {
      return;
    }
    this.asideEndState = state;
    this.emit('ds-aside-state-change', {
      detail: { side: 'end' as const, state, previousState },
    });
  }

  #toggleAsideState = (): void => {
    this.#setAsideState(this.#nextAsideState());
  };

  #toggleAsideEndState = (): void => {
    this.#setAsideEndState(this.#nextAsideEndState());
  };

  override render(): TemplateResult {
    const ariaExpanded: 'true' | 'false' = this._mobileNavOpen ? 'true' : 'false';
    const hasFooter = this._hasFooter || hasNamedSlotContent(this, 'footer');
    const menuAtStart = this.mobileMenuButtonPosition === 'start';
    return html`<header part="header">
        <ds-top-bar class="chrome" label=${this.menuLabel}>
          <slot name="brand" slot="brand">${this.brand}</slot>
          <slot name="header-status" slot="actions"></slot>
          ${menuAtStart ? this.#renderMenuToggle(ariaExpanded) : null}
          <slot name="header-actions" slot="actions"></slot>
          ${menuAtStart ? null : this.#renderMenuToggle(ariaExpanded)}
        </ds-top-bar>
      </header>
      <div class="shell-body" part="body">
        ${this._mobileLayout ? this.#renderMobileAside() : this.#renderDesktopStartCluster()}
        <main part="main">
          <slot></slot>
        </main>
        ${this._mobileLayout ? this.#renderMobileAsideEnd() : this.#renderDesktopEndCluster()}
      </div>
      ${hasFooter
        ? html`<footer part="footer">
            <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
          </footer>`
        : null}`;
  }

  #renderMenuToggle(ariaExpanded: 'true' | 'false'): TemplateResult | null {
    if (!this._hasAside) {
      return null;
    }
    return html`<ds-button
      slot="actions"
      class="menu-toggle"
      part="menu-toggle"
      variant="ghost"
      size="sm"
      label=${this.menuLabel}
      aria-label=${this.menuLabel}
      aria-expanded=${ariaExpanded}
      aria-controls="mobile-aside"
      @click=${this.#toggleMobileNav}
    >
      <ds-icon slot="leading" name="bars-3" size="3xl"></ds-icon>
    </ds-button>`;
  }

  #renderDesktopStartCluster(): TemplateResult {
    if (!this._hasAside && !this.#showStartToggle()) {
      return html`<slot name="aside" class="presence-slot" @slotchange=${this.#onAsideSlotChange}></slot>`;
    }
    return html`<div class="aside-start-cluster" part="aside-start-cluster">
      <aside
        id="desktop-aside"
        class="scroll-fade"
        part="aside"
        aria-label=${this.menuLabel}
        aria-hidden=${this.asideState === 'hidden' ? 'true' : 'false'}
        ?hidden=${!this._hasAside}
        ?inert=${this.asideState === 'hidden'}
        @click=${this.#onAsideClick}
      >
        <slot name="aside" @slotchange=${this.#onAsideSlotChange}></slot>
      </aside>
      ${this.#renderStartToggle()}
    </div>`;
  }

  #renderDesktopEndCluster(): TemplateResult {
    if (!this._hasAsideEnd && !this.#showEndToggle()) {
      return html`<slot name="aside-end" class="presence-slot" @slotchange=${this.#onAsideEndSlotChange}></slot>`;
    }
    return html`<div class="aside-end-cluster" part="aside-end-cluster">
      ${this.#renderEndToggle()}
      <aside
        id="desktop-aside-end"
        class="scroll-fade"
        part="aside-end"
        aria-label=${this.endLabel}
        aria-hidden=${this.asideEndState === 'hidden' ? 'true' : 'false'}
        ?hidden=${!this._hasAsideEnd}
        ?inert=${this.asideEndState === 'hidden'}
      >
        <slot name="aside-end" @slotchange=${this.#onAsideEndSlotChange}></slot>
      </aside>
    </div>`;
  }

  #renderStartToggle(): TemplateResult | null {
    if (!this.#showStartToggle()) {
      return null;
    }
    const hidden = this.asideState === 'hidden';
    const label = this.asideState === 'visible'
      ? 'Collapse primary navigation'
      : hidden
        ? 'Show primary navigation'
        : 'Hide primary navigation';
    return html`<div class="aside-toggle-rail aside-toggle-start-rail" part="aside-toggle-rail aside-toggle-start-rail">
      <ds-button
        class="aside-toggle aside-toggle-start"
        part="aside-toggle aside-toggle-start"
        variant="secondary"
        size="sm"
        square
        label=${label}
        aria-label=${label}
        aria-controls="desktop-aside"
        aria-expanded=${hidden ? 'false' : 'true'}
        @click=${this.#toggleAsideState}
      >
        <ds-icon slot="leading" name=${hidden ? 'chevron-right' : 'chevron-left'} size="lg"></ds-icon>
      </ds-button>
    </div>`;
  }

  #renderEndToggle(): TemplateResult | null {
    if (!this.#showEndToggle()) {
      return null;
    }
    const hidden = this.asideEndState === 'hidden';
    const label = hidden ? 'Show secondary navigation' : 'Hide secondary navigation';
    return html`<div class="aside-toggle-rail aside-toggle-end-rail" part="aside-toggle-rail aside-toggle-end-rail">
      <ds-button
        class="aside-toggle aside-toggle-end"
        part="aside-toggle aside-toggle-end"
        variant="secondary"
        size="sm"
        square
        label=${label}
        aria-label=${label}
        aria-controls="desktop-aside-end"
        aria-expanded=${hidden ? 'false' : 'true'}
        @click=${this.#toggleAsideEndState}
      >
        <ds-icon slot="leading" name=${hidden ? 'chevron-left' : 'chevron-right'} size="lg"></ds-icon>
      </ds-button>
    </div>`;
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

  #renderMobileAsideEnd(): TemplateResult {
    return html`<aside
      part="aside-end"
      aria-label=${this.endLabel}
      ?hidden=${!this._hasAsideEnd}
    >
      <slot name="aside-end" @slotchange=${this.#onAsideEndSlotChange}></slot>
    </aside>`;
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
