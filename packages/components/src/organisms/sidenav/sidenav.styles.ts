import { css } from 'lit';

export const sidenavStyles = css`
  :host {
    display: block;
    --ds-sidenav-width: var(--ds-space-64, 16rem);
    --ds-sidenav-collapsed-width: var(--ds-space-16, 4rem);
    width: var(--ds-sidenav-width);
    transition: width var(--ds-duration-slow) var(--ds-easing-standard);
  }
  :host([collapsed]) {
    width: var(--ds-sidenav-collapsed-width);
  }
  nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--ds-space-2);
    background: var(--ds-color-bg);
    border-right: 1px solid var(--ds-color-border);
    box-sizing: border-box;
  }
  .header {
    padding: var(--ds-space-2) var(--ds-space-3);
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
    padding-top: var(--ds-space-3);
    border-top: 1px solid var(--ds-color-border);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }
`;
