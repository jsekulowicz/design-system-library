import { css } from 'lit';

export const pageShellStyles = css`
  :host {
    --ds-page-shell-max-width: 90rem;

    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 100vh;
    overflow-x: clip;
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
  }

  header {
    border-bottom: 1px solid var(--ds-color-border);
    padding: var(--ds-space-2) 0;
    position: sticky;
    top: 0;
    background: color-mix(in oklab, var(--ds-color-bg) 92%, transparent);
    backdrop-filter: blur(12px);
    z-index: var(--ds-z-index-sticky);
  }

  footer {
    display: block;
  }

  .shell-inner {
    width: 100%;
    max-width: var(--ds-page-shell-max-width);
    margin-inline: auto;
    padding-inline: var(--ds-space-5);
  }

  .shell-inner--header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
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
    min-height: 0;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
    /* No scrollbar-gutter reservation: the aside sits flush with its column
       edge so the consumer's <main> solely owns the gap. The scrollbar
       appears on demand when the aside genuinely overflows. */
  }

  :host([aside-empty]) aside[part="aside"],
  :host([aside-empty]) .mobile-backdrop {
    display: none;
  }

  :host([aside-end-empty]) aside[part="aside-end"] {
    display: none;
  }

  main {
    padding: var(--ds-space-5);
    overflow: auto;
    min-width: 0;
    min-height: 0;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
  }

  .brand {
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-lg);
    letter-spacing: var(--ds-letter-spacing-display);
  }

  .menu-toggle {
    display: inline-flex;
  }
  .mobile-backdrop {
    display: none;
  }
  .drawer-header {
    display: none;
  }
  .drawer-close {
    display: none;
  }
  .menu-toggle::part(button),
  .drawer-close::part(button) {
    min-width: var(--ds-size-sm);
    width: var(--ds-size-sm);
    padding: 0;
  }

  :host(:not([mobile-layout])) .menu-toggle {
    display: none;
  }

  :host([mobile-layout]) .shell-body {
    grid-template-columns: 1fr;
  }
  :host([mobile-layout]) aside[part="aside-end"] {
    /* Secondary inline-end region is not surfaced in the mobile drawer in v1.
       Consumers can opt back in by overriding via ::part(aside-end). */
    display: none;
  }
  :host([mobile-layout]) .brand {
    flex: 1;
  }
  :host([mobile-layout]) aside[part="aside"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 16rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--ds-color-bg);
    border-right: 0;
    z-index: var(--ds-z-index-modal);
    transform: translateX(-100%);
    transition: transform var(--ds-duration-slow) var(--ds-easing-standard);
    scrollbar-gutter: auto;
    overflow: hidden;
    box-sizing: border-box;
  }
  :host([mobile-layout][data-mobile-nav-open]) aside[part="aside"] {
    transform: translateX(0);
  }
  :host([mobile-layout]) .drawer-header {
    display: flex;
    align-items: center;
    padding: var(--ds-space-2) var(--ds-space-2) 0;
  }
  :host([mobile-layout]) .drawer-close {
    display: inline-flex;
    margin: 0;
  }
  :host([mobile-layout]) aside[part="aside"] ::slotted(ds-sidenav) {
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    height: auto !important;
  }
  :host([mobile-layout][data-mobile-nav-open]) .mobile-backdrop {
    display: block;
    position: absolute;
    inset: 0;
    border: 0;
    margin: 0;
    padding: 0;
    background: color-mix(in oklab, var(--ds-color-fg) 26%, transparent);
    z-index: var(--ds-z-index-overlay);
  }
`;
