import { css } from 'lit';

export const pageShellStyles = css`
  :host {
    display: grid;
    position: relative;
    grid-template-areas:
      'header header'
      'aside main'
      'footer footer';
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    overflow-x: clip;
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
  }
  header {
    grid-area: header;
    border-bottom: 1px solid var(--ds-color-border);
    margin-bottom: var(--ds-space-1, 0.25rem);
    padding: var(--ds-space-5) var(--ds-space-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-4);
    position: sticky;
    top: 0;
    background: color-mix(in oklab, var(--ds-color-bg) 92%, transparent);
    backdrop-filter: blur(12px);
    z-index: var(--ds-z-index-sticky);
  }
  aside {
    grid-area: aside;
    display: flex;
    overflow-x: clip;
    overflow-y: auto;
    min-height: 0;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
    scrollbar-gutter: stable;
  }
  main {
    grid-area: main;
    padding: var(--ds-space-5);
    max-width: min(72rem, 100%);
    overflow-y: auto;
    min-height: 0;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
  }
  footer {
    grid-area: footer;
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
  :host([mobile-layout]) {
    grid-template-areas:
      'header'
      'main'
      'footer';
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  :host(:not([mobile-layout])) .menu-toggle {
    display: none;
  }
  :host([mobile-layout]) .brand {
    flex: 1;
  }
  :host([mobile-layout]) main {
    padding: var(--ds-space-5);
  }
  :host([mobile-layout]) header {
    padding: var(--ds-space-3) var(--ds-space-5);
  }
  :host([mobile-layout]) aside {
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
  :host([mobile-layout][data-mobile-nav-open]) aside {
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
  :host([mobile-layout]) aside ::slotted(ds-sidenav) {
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
