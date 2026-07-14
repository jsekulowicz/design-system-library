import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { pageShellStyles } from './page-shell.styles.js';
import { scrollFadeStyles } from '../../shared/scroll-fade.styles.js';
import { ScrollFadeController } from '../../shared/scroll-fade-controller.js';
import { hasAssignedContent, hasNamedSlotContent } from '../../shared/slots.js';
import {
  nextAsideState,
  nextAsideEndState,
  type PageShellAsideState,
  type PageShellAsideEndState,
  type PageShellMenuButtonPosition,
} from './page-shell-state.js';
import {
  renderMenuToggle,
  renderDesktopStartCluster,
  renderDesktopEndCluster,
  renderMobileAside,
  renderMobileAsideEnd,
  type PageShellRenderContext,
} from './page-shell-rendering.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/define.js';
import '../../atoms/icon/icons/bars-3.js';
import '../../atoms/icon/icons/chevron-left.js';
import '../../atoms/icon/icons/chevron-right.js';
import '../../molecules/drawer/define.js';
import '../../organisms/top-bar/define.js';

export type { PageShellAsideState, PageShellAsideEndState, PageShellMenuButtonPosition };

/**
 * @tag ds-page-shell
 * @summary Application frame: header + aside + main + optional footer with responsive collapse.
 * @slot brand - Top-left brand/logo.
 * @slot drawer-brand - Brand/logo shown in the mobile navigation drawer's title row. Falls back to the `brand` prop.
 * @slot header-status - Top-right indicator widgets (e.g. points, balances) shown before the action buttons. Non-interactive status content that reads apart from the action buttons.
 * @slot header-actions - Top-right action buttons (account menu, notifications, etc.). The mobile navigation toggle is rendered as a peer of these buttons; see `mobile-menu-button-position`.
 * @slot aside - Primary side navigation (inline-start). On mobile, rendered inside a `ds-drawer` opened by the hamburger toggle. When empty, the column and hamburger toggle are not rendered.
 * @slot aside-end - Secondary side region (inline-end), e.g. table of contents, contextual help. Hidden on mobile.
 * @slot default - Main content. A direct `ds-scrollable-page` child automatically owns main scrolling and padding.
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
    const main = this.shadowRoot?.querySelector<HTMLSlotElement>('main slot:not([name])');
    this._hasAside = hasNamedSlotContent(this, 'aside', aside);
    this._hasAsideEnd = hasNamedSlotContent(this, 'aside-end', asideEnd);
    this._hasFooter = hasNamedSlotContent(this, 'footer', footer);
    this.toggleAttribute('aside-empty', !this._hasAside);
    this.toggleAttribute('aside-end-empty', !this._hasAsideEnd);
    this.toggleAttribute('footer-empty', !this._hasFooter);
    this.#syncScrollableMain(main);
  };

  #syncScrollableMain(slot?: HTMLSlotElement | null): void {
    const elements = slot
      ? slot.assignedElements({ flatten: true })
      : Array.from(this.children).filter((child) => !child.slot);
    const hasScrollablePage =
      elements.length === 1 && elements[0]?.tagName === 'DS-SCROLLABLE-PAGE';
    this.toggleAttribute('scrollable-main', hasScrollablePage);
  }

  #onMainSlotChange = (event: Event): void => {
    this.#syncScrollableMain(event.target as HTMLSlotElement);
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
      this.#setMobileNav(false);
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

  #setAsideState = (state: PageShellAsideState): void => {
    const previousState = this.asideState;
    if (state === previousState) {
      return;
    }
    this.asideState = state;
    this.emit('ds-aside-state-change', {
      detail: { side: 'start' as const, state, previousState },
    });
  };

  #setAsideEndState = (state: PageShellAsideEndState): void => {
    const previousState = this.asideEndState;
    if (state === previousState) {
      return;
    }
    this.asideEndState = state;
    this.emit('ds-aside-state-change', {
      detail: { side: 'end' as const, state, previousState },
    });
  };

  #renderContext(): PageShellRenderContext {
    return {
      brand: this.brand,
      menuLabel: this.menuLabel,
      endLabel: this.endLabel,
      asideState: this.asideState,
      asideEndState: this.asideEndState,
      mobileNavOpen: this._mobileNavOpen,
      hasAside: this._hasAside,
      hasAsideEnd: this._hasAsideEnd,
      showStartToggle: this.asideToggle && this._hasAside && !this._mobileLayout,
      showEndToggle: this.asideEndToggle && this._hasAsideEnd && !this._mobileLayout,
      onAsideClick: this.#onAsideClick,
      onAsideSlotChange: this.#onAsideSlotChange,
      onAsideEndSlotChange: this.#onAsideEndSlotChange,
      toggleMobileNav: () => this.#setMobileNav(!this._mobileNavOpen),
      closeMobileNav: () => this.#setMobileNav(false),
      toggleAsideState: () => this.#setAsideState(nextAsideState(this.asideState)),
      toggleAsideEndState: () => this.#setAsideEndState(nextAsideEndState(this.asideEndState)),
    };
  }

  override render(): TemplateResult {
    const ctx = this.#renderContext();
    const hasFooter = this._hasFooter || hasNamedSlotContent(this, 'footer');
    const menuAtStart = this.mobileMenuButtonPosition === 'start';
    return html`<header part="header">
        <ds-top-bar class="chrome" label=${this.menuLabel}>
          <slot name="brand" slot="brand">${this.brand}</slot>
          <slot name="header-status" slot="actions"></slot>
          ${menuAtStart ? renderMenuToggle(ctx) : null}
          <slot name="header-actions" slot="actions"></slot>
          ${menuAtStart ? null : renderMenuToggle(ctx)}
        </ds-top-bar>
      </header>
      <div class="shell-body" part="body">
        ${this._mobileLayout ? renderMobileAside(ctx) : renderDesktopStartCluster(ctx)}
        <main part="main">
          <slot @slotchange=${this.#onMainSlotChange}></slot>
        </main>
        ${this._mobileLayout ? renderMobileAsideEnd(ctx) : renderDesktopEndCluster(ctx)}
      </div>
      ${hasFooter
        ? html`<footer part="footer">
            <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
          </footer>`
        : null}`;
  }
}
