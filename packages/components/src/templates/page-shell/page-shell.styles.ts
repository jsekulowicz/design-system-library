import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const belowDesktopBreakpoint = unsafeCSS(`calc(${breakpoint.lg} - 0.02px)`);

export const pageShellStyles = css`
  :host {
    --ds-page-shell-max-width: none;

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
    grid-template-columns: auto 1fr auto;
    min-height: 0;
  }

  :host([aside-empty]) .shell-body {
    grid-template-columns: 1fr auto;
  }

  :host([aside-end-empty]) .shell-body {
    grid-template-columns: auto 1fr;
  }

  :host([aside-empty][aside-end-empty]) .shell-body {
    grid-template-columns: 1fr;
  }

  aside {
    display: flex;
    overflow-x: clip;
    overflow-y: auto;
    overflow-clip-margin-inline: var(--ds-space-2);
    min-height: 0;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
    /* No scrollbar-gutter reservation: the aside sits flush with its column
       edge so the consumer's <main> solely owns the gap. The scrollbar
       appears on demand when the aside genuinely overflows. */
  }

  :host([aside-empty]) aside[part="aside"],
  :host([aside-empty]) ds-drawer[part="aside"] {
    display: none;
  }

  :host([aside-end-empty]) aside[part="aside-end"] {
    display: none;
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
    min-width: var(--ds-size-sm);
    width: var(--ds-size-sm);
    padding: 0;
  }
  :host([mobile-layout]) .menu-toggle {
    display: inline-flex;
  }

  :host([mobile-layout]) .shell-body {
    grid-template-columns: 1fr;
  }
  :host([mobile-layout]) aside[part="aside-end"] {
    display: none;
  }
  :host([mobile-layout]) ds-drawer[part="aside"] {
    /* Top-layer modal; don't reserve a grid column when closed. */
    display: contents;
    --ds-drawer-card-padding: 0;
    --ds-drawer-title-padding: var(--ds-space-3) var(--ds-space-4);
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
