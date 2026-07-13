import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const belowDesktopBreakpoint = unsafeCSS(`calc(${breakpoint.lg} - 0.02px)`);

export const pageShellStyles = css`
  :host {
    --ds-page-shell-max-width: none;
    --ds-page-shell-aside-toggle-clearance:
      calc(var(--ds-size-sm) / 2);

    display: flex;
    flex-direction: column;
    position: relative;
    height: 100vh;
    height: 100dvh;
    overflow-x: clip;
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
  }

  header {
    position: sticky;
    top: 0;
    background: color-mix(in oklab, var(--ds-color-bg) 92%, transparent);
    backdrop-filter: blur(12px);
    z-index: var(--ds-z-index-sticky);
  }

  /* The header composes ds-top-bar; let the top-bar own height, padding,
     border-bottom, and layout. We just (a) make its background transparent
     so the sticky header's blurred bg shows through, and (b) constrain its
     inner brand + actions content to the same max-width as the shell-body
     below so the bar's brand left-aligns with the aside, and its actions
     right-align with the aside-end (or the right edge of main when no
     aside-end is slotted). */
  .chrome {
    --ds-top-bar-bg: transparent;
    --ds-top-bar-content-max-width: var(--ds-page-shell-max-width);
  }

  /* Same treatment for a slotted ds-footer: cap its inner content to the
     shell-body's max-width so footer content aligns with the column above.
     Consumers who slot a non-ds-footer custom element can override the
     property themselves. */
  ::slotted(ds-footer) {
    --ds-footer-content-max-width: var(--ds-page-shell-max-width);
  }

  footer {
    display: block;
  }

  .shell-body {
    flex: 1;
    width: 100%;
    max-width: var(--ds-page-shell-max-width);
    margin-inline: auto;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    min-height: 0;
  }

  .presence-slot {
    display: none;
  }

  .aside-start-cluster,
  .aside-end-cluster {
    display: grid;
    grid-template-columns: 1fr;
    position: relative;
    min-width: 0;
    min-height: 0;
    transition: grid-template-columns var(--ds-duration-slow) var(--ds-easing-standard);
  }

  .aside-start-cluster {
    grid-column: 1;
    border-inline-end: 1px solid var(--ds-color-border);
  }

  .aside-end-cluster {
    grid-column: 3;
    border-inline-start: 1px solid var(--ds-color-border);
  }

  main {
    grid-column: 2;
  }

  aside {
    display: flex;
    box-sizing: border-box;
    overflow-x: clip;
    overflow-y: auto;
    overflow-clip-margin-inline: var(--ds-space-2);
    min-width: 0;
    min-height: 0;
    --ds-scroll-fade-depth: var(--ds-space-12, 3rem);
    scrollbar-width: none;
    mask-image: var(--ds-scroll-fade-mask);
    transition: opacity var(--ds-duration-slow) var(--ds-easing-standard);
  }

  aside::-webkit-scrollbar {
    display: none;
  }

  :host([aside-toggle]) aside[part="aside"] {
    padding-inline-end: var(--ds-page-shell-aside-toggle-clearance);
  }

  :host([aside-end-toggle]) aside[part="aside-end"] {
    padding-inline-start: var(--ds-page-shell-aside-toggle-clearance);
  }

  :host([aside-empty]) aside[part="aside"],
  :host([aside-empty]) ds-drawer[part="aside"] {
    display: none;
  }

  :host([aside-end-empty]) aside[part="aside-end"] {
    display: none;
  }

  aside[hidden] {
    display: none;
  }

  /* Collapsing to 0fr animates the grid track from its content width to zero
     without measuring it in JS; the aside clips via overflow + min-width: 0.
     The cluster keeps a small min-width so the toggle button that straddles
     its edge never touches the viewport edge. */
  :host([aside-state='hidden']) .aside-start-cluster,
  :host([aside-end-state='hidden']) .aside-end-cluster {
    grid-template-columns: 0fr;
    min-width: calc(var(--ds-size-sm) / 2 + var(--ds-space-2));
  }

  :host([aside-state='hidden']) aside[part="aside"],
  :host([aside-end-state='hidden']) aside[part="aside-end"] {
    padding-inline: 0;
    opacity: 0;
    pointer-events: none;
  }

  :host([aside-state='compact']) aside[part="aside"] ::slotted(ds-sidenav) {
    width: var(--ds-sidenav-collapsed-width, var(--ds-space-14, 3.5rem)) !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .aside-start-cluster,
    .aside-end-cluster,
    aside {
      transition: none;
    }
  }

  .aside-toggle-rail {
    position: absolute;
    inset-block-start: var(--ds-space-4);
    z-index: var(--ds-z-index-raised);
    width: var(--ds-size-sm);
    min-width: var(--ds-size-sm);
    height: var(--ds-size-sm);
  }

  .aside-toggle-start-rail {
    inset-inline-end: calc(var(--ds-size-sm) / -2);
  }

  .aside-toggle-end-rail {
    inset-inline-start: calc(var(--ds-size-sm) / -2);
  }

  .aside-toggle::part(button) {
    flex-shrink: 0;
    background: var(--ds-color-bg);
    border-color: var(--ds-color-border);
  }

  .aside-toggle:hover::part(button) {
    background: var(--ds-color-bg-subtle);
  }

  main {
    padding: var(--ds-space-5);
    overflow-x: clip;
    overflow-y: auto;
    overflow-clip-margin-inline: var(--ds-space-2);
    min-width: 0;
    min-height: 0;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
    /* Reserve scrollbar gutters on both inline sides so the inline-start
       and inline-end visible empty bands stay equal in width whether the
       vertical scrollbar is present or not. */
    scrollbar-gutter: stable both-edges;
  }

  @media (max-width: ${belowDesktopBreakpoint}) {
    main {
      padding-block: var(--ds-space-4);
      padding-inline: var(--ds-space-4);
    }
  }

  .menu-toggle {
    display: none;
  }
  .menu-toggle::part(button) {
    min-width: var(--ds-page-shell-menu-toggle-size, var(--ds-size-sm));
    width: var(--ds-page-shell-menu-toggle-size, var(--ds-size-sm));
    padding: 0;
  }
  :host([mobile-layout]) .menu-toggle {
    display: inline-flex;
  }

  :host([mobile-layout]) .shell-body {
    grid-template-columns: 1fr;
  }
  :host([mobile-layout]) main {
    grid-column: 1;
  }
  :host([mobile-layout]) aside[part="aside-end"] {
    display: none;
  }
  :host([mobile-layout]) ds-drawer[part="aside"] {
    /* Top-layer modal; don't reserve a grid column when closed. */
    display: contents;
    --ds-drawer-card-padding: 0;
    /* No gap under the title row; the sidenav's own top padding is the only
       breathing room, so the nav sits close under the header. */
    --ds-drawer-card-gap: 0;
    /* Match ds-top-bar's 48px chrome height with inline-only padding. */
    --ds-drawer-title-padding: 0 var(--ds-space-4);
    --ds-drawer-title-min-height: 48px;
    /* Match the top bar's brand size (ds-top-bar .brand) rather than the
       drawer's larger default title. */
    --ds-drawer-title-font-size: var(--ds-font-size-heading-sm);
    --ds-drawer-title-bg: var(--ds-page-shell-drawer-header-bg, transparent);
    --ds-drawer-title-fg: var(--ds-page-shell-drawer-header-fg, inherit);
    --ds-drawer-title-border-color: var(--ds-page-shell-drawer-header-border-color, transparent);
  }
  :host([mobile-layout]) ds-drawer[part="aside"] ::slotted(ds-sidenav) {
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    height: auto !important;
  }
`;
