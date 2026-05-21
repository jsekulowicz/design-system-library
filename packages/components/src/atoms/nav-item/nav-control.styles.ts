import { css } from 'lit';

export const navControlStyles = css`
  :host {
    display: block;
  }
  :host([compact]) .nav-control {
    height: var(--ds-sidenav-item-compact-size);
    width: var(--ds-sidenav-item-compact-size);
  }
  .nav-control {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--ds-sidenav-item-height);
    gap: var(--ds-space-2);
    padding: var(--ds-space-2) var(--ds-space-3);
    border: 0;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition:
      background var(--ds-duration-fast) var(--ds-easing-standard),
      color var(--ds-duration-fast) var(--ds-easing-standard),
      padding var(--ds-duration-slow) var(--ds-easing-standard);
  }
  .nav-control:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--ds-color-bg-subtle);
    color: var(--ds-color-fg);
  }
  .nav-control:focus-visible {
    box-shadow: var(--ds-shadow-focus);
  }
  .icon {
    display: inline-flex;
    flex: none;
  }
  .icon[hidden] {
    display: none;
  }
  .label {
    display: inline-flex;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    max-width: 20rem;
    opacity: 1;
    transition:
      max-width var(--ds-duration-slow) var(--ds-easing-standard),
      opacity var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host-context(ds-sidenav) {
    display: block;
  }
  :host-context(ds-sidenav) .nav-control {
    display: flex;
    width: 100%;
  }
  :host-context(ds-nav-group) .nav-control {
    display: flex;
    width: 100%;
    padding-inline: var(--ds-space-2);
  }
  :host([compact]) .label {
    max-width: 0;
    opacity: 0;
  }
  :host([compact]) .nav-control {
    justify-content: center;
    padding: var(--ds-space-2);
    gap: 0;
  }
  .tooltip-wrapper {
    display: block;
    width: 100%;
  }
  :host([compact]) .tooltip-wrapper {
    display: flex;
    justify-content: center;
  }
  :host([compact]) .tooltip-wrapper::part(anchor) {
    display: inline-flex;
    width: auto;
  }
`;
