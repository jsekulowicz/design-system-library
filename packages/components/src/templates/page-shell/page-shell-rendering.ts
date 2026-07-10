import { html, type TemplateResult } from 'lit';
import type { PageShellAsideState, PageShellAsideEndState } from './page-shell-state.js';

/* Everything the stateless render partials need from the component instance. */
export interface PageShellRenderContext {
  brand: string;
  menuLabel: string;
  endLabel: string;
  asideState: PageShellAsideState;
  asideEndState: PageShellAsideEndState;
  mobileNavOpen: boolean;
  hasAside: boolean;
  hasAsideEnd: boolean;
  showStartToggle: boolean;
  showEndToggle: boolean;
  onAsideClick(event: Event): void;
  onAsideSlotChange(event: Event): void;
  onAsideEndSlotChange(event: Event): void;
  toggleMobileNav(): void;
  closeMobileNav(): void;
  toggleAsideState(): void;
  toggleAsideEndState(): void;
}

export function renderMenuToggle(ctx: PageShellRenderContext): TemplateResult | null {
  if (!ctx.hasAside) {
    return null;
  }
  return html`<ds-button
    slot="actions"
    class="menu-toggle"
    part="menu-toggle"
    variant="ghost"
    size="sm"
    label=${ctx.menuLabel}
    aria-label=${ctx.menuLabel}
    aria-expanded=${ctx.mobileNavOpen ? 'true' : 'false'}
    aria-controls="mobile-aside"
    @click=${ctx.toggleMobileNav}
  >
    <ds-icon slot="leading" name="bars-3" size="3xl"></ds-icon>
  </ds-button>`;
}

export function renderDesktopStartCluster(ctx: PageShellRenderContext): TemplateResult {
  if (!ctx.hasAside && !ctx.showStartToggle) {
    return html`<slot name="aside" class="presence-slot" @slotchange=${ctx.onAsideSlotChange}></slot>`;
  }
  return html`<div class="aside-start-cluster" part="aside-start-cluster">
    <aside
      id="desktop-aside"
      class="scroll-fade"
      part="aside"
      aria-label=${ctx.menuLabel}
      aria-hidden=${ctx.asideState === 'hidden' ? 'true' : 'false'}
      ?hidden=${!ctx.hasAside}
      ?inert=${ctx.asideState === 'hidden'}
      @click=${ctx.onAsideClick}
    >
      <slot name="aside" @slotchange=${ctx.onAsideSlotChange}></slot>
    </aside>
    ${renderStartToggle(ctx)}
  </div>`;
}

export function renderDesktopEndCluster(ctx: PageShellRenderContext): TemplateResult {
  if (!ctx.hasAsideEnd && !ctx.showEndToggle) {
    return html`<slot name="aside-end" class="presence-slot" @slotchange=${ctx.onAsideEndSlotChange}></slot>`;
  }
  return html`<div class="aside-end-cluster" part="aside-end-cluster">
    ${renderEndToggle(ctx)}
    <aside
      id="desktop-aside-end"
      class="scroll-fade"
      part="aside-end"
      aria-label=${ctx.endLabel}
      aria-hidden=${ctx.asideEndState === 'hidden' ? 'true' : 'false'}
      ?hidden=${!ctx.hasAsideEnd}
      ?inert=${ctx.asideEndState === 'hidden'}
    >
      <slot name="aside-end" @slotchange=${ctx.onAsideEndSlotChange}></slot>
    </aside>
  </div>`;
}

function renderStartToggle(ctx: PageShellRenderContext): TemplateResult | null {
  if (!ctx.showStartToggle) {
    return null;
  }
  const hidden = ctx.asideState === 'hidden';
  const label = ctx.asideState === 'visible'
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
      @click=${ctx.toggleAsideState}
    >
      <ds-icon slot="leading" name=${hidden ? 'chevron-right' : 'chevron-left'} size="lg"></ds-icon>
    </ds-button>
  </div>`;
}

function renderEndToggle(ctx: PageShellRenderContext): TemplateResult | null {
  if (!ctx.showEndToggle) {
    return null;
  }
  const hidden = ctx.asideEndState === 'hidden';
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
      @click=${ctx.toggleAsideEndState}
    >
      <ds-icon slot="leading" name=${hidden ? 'chevron-left' : 'chevron-right'} size="lg"></ds-icon>
    </ds-button>
  </div>`;
}

export function renderMobileAside(ctx: PageShellRenderContext): TemplateResult {
  return html`<ds-drawer
    id="mobile-aside"
    part="aside"
    side="start"
    size="sm"
    ?open=${ctx.mobileNavOpen}
    label=${ctx.menuLabel}
    @ds-close=${ctx.closeMobileNav}
    @ds-cancel=${ctx.closeMobileNav}
    @click=${ctx.onAsideClick}
  >
    <slot name="drawer-brand" slot="title">${ctx.brand}</slot>
    <slot name="aside" @slotchange=${ctx.onAsideSlotChange}></slot>
  </ds-drawer>`;
}

export function renderMobileAsideEnd(ctx: PageShellRenderContext): TemplateResult {
  return html`<aside
    part="aside-end"
    aria-label=${ctx.endLabel}
    ?hidden=${!ctx.hasAsideEnd}
  >
    <slot name="aside-end" @slotchange=${ctx.onAsideEndSlotChange}></slot>
  </aside>`;
}
