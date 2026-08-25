import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const belowMobileLayoutBreakpoint = unsafeCSS(`calc(${breakpoint.md} - 0.02px)`);

export const pageShellMobileStyles = css`
  @media (max-width: ${belowMobileLayoutBreakpoint}) {
    :host(:not([mobile-layout])) .aside-start-cluster,
    :host(:not([mobile-layout])) .aside-end-cluster {
      display: none;
    }

    :host(:not([mobile-layout])) .shell-body {
      grid-template-columns: 1fr;
    }

    :host(:not([mobile-layout])) main {
      grid-column: 1;
    }

    :host(:not([mobile-layout])) .menu-toggle {
      display: inline-flex;
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

  :host([mobile-layout]) aside[part='aside-end'] {
    display: none;
  }

  :host([mobile-layout]) ds-drawer[part='aside'] {
    display: contents;
    --ds-drawer-card-padding: 0;
    --ds-drawer-card-gap: 0;
    --ds-drawer-title-padding: 0 var(--ds-space-4);
    --ds-drawer-title-min-height: 48px;
    --ds-drawer-title-font-size: var(--ds-font-size-heading-sm);
    --ds-drawer-title-bg: var(--ds-page-shell-drawer-header-bg, transparent);
    --ds-drawer-title-fg: var(--ds-page-shell-drawer-header-fg, inherit);
    --ds-drawer-title-border-color: var(--ds-page-shell-drawer-header-border-color, transparent);
  }

  :host([mobile-layout]) ds-drawer[part='aside'] ::slotted(ds-sidenav) {
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    height: auto !important;
  }
`;
