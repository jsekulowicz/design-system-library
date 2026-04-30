import { css } from 'lit';

export const sidenavStyles = css`
  :host {
    --ds-sidenav-item-height: var(--ds-space-10, 2.5rem);
    --ds-sidenav-item-compact-size: var(--ds-space-12, 3rem);
    --ds-sidenav-width: var(--ds-space-64, 16rem);

    display: block;
    width: var(--ds-sidenav-width);
    max-width: 100%;
    transition: width var(--ds-duration-slow) var(--ds-easing-standard);
  }
  :host([collapsed]) {
    --ds-sidenav-collapsed-width: var(--ds-space-14, 3.5rem);
    justify-items: flex-start;
    width: var(--ds-sidenav-collapsed-width);

    nav {
      width: var(--ds-sidenav-collapsed-width);
      scrollbar-width: none;
    }
  }
  nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--ds-space-1);
    background: var(--ds-color-bg);
    overflow-x: clip;
    overflow-y: auto;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
  }
  .header {
    padding: 0 var(--ds-space-3);
    margin-bottom: var(--ds-space-3);
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-lg);
    color: var(--ds-color-fg);
  }
  .header[hidden],
  .footer[hidden] {
    display: none;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    flex: 1;
    min-height: 0;
  }
  .footer {
    margin-top: var(--ds-space-4);
    border-top: 1px solid var(--ds-color-border);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }
  :host-context(ds-page-shell:not([mobile-layout])) nav {
    border-right: 1px solid var(--ds-color-border);
  }
`;
