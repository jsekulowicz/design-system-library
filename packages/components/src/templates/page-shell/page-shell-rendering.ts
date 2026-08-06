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
      ?hidden=${!ctx.hasAside}
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

interface AsideToggleOptions {
  side: 'start' | 'end';
  controls: string;
  expanded: boolean;
  label: string;
  icon: 'chevron-left' | 'chevron-right';
  onClick(): void;
}

function renderAsideToggle(options: AsideToggleOptions): TemplateResult {
  const { side, controls, expanded, label, icon, onClick } = options;
  return html`<div
    class="aside-toggle-rail aside-toggle-${side}-rail"
    part="aside-toggle-rail aside-toggle-${side}-rail"
  >
    <ds-button
      class="aside-toggle aside-toggle-${side}"
      part="aside-toggle aside-toggle-${side}"
      variant="secondary"
      size="sm"
      square
      label=${label}
      aria-label=${label}
      aria-controls=${controls}
      aria-expanded=${expanded ? 'true' : 'false'}
      @click=${onClick}
    >
      <ds-icon slot="leading" name=${icon} size="lg"></ds-icon>
    </ds-button>
  </div>`;
}

function renderStartToggle(ctx: PageShellRenderContext): TemplateResult | null {
  if (!ctx.showStartToggle) {
    return null;
  }
  const expanded = ctx.asideState === 'visible';
  return renderAsideToggle({
    side: 'start',
    controls: 'desktop-aside',
    expanded,
    label: expanded ? 'Collapse primary navigation' : 'Expand primary navigation',
    icon: expanded ? 'chevron-left' : 'chevron-right',
    onClick: ctx.toggleAsideState,
  });
}

function renderEndToggle(ctx: PageShellRenderContext): TemplateResult | null {
  if (!ctx.showEndToggle) {
    return null;
  }
  const expanded = ctx.asideEndState === 'visible';
  return renderAsideToggle({
    side: 'end',
    controls: 'desktop-aside-end',
    expanded,
    label: expanded ? 'Hide secondary navigation' : 'Show secondary navigation',
    icon: expanded ? 'chevron-right' : 'chevron-left',
    onClick: ctx.toggleAsideEndState,
  });
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
