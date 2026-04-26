import { css } from 'lit';

export const navItemStyles = css`
  :host {
    display: block;
  }
  .link {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    padding: var(--ds-space-2) var(--ds-space-3);
    border-radius: var(--ds-radius-sm);
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    text-decoration: none;
    transition:
      background var(--ds-duration-fast) var(--ds-easing-standard),
      color var(--ds-duration-fast) var(--ds-easing-standard),
      padding var(--ds-duration-slow) var(--ds-easing-standard);
  }
  .link:hover {
    background: var(--ds-color-bg-subtle);
    color: var(--ds-color-fg);
  }
  .link:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }
  :host([current]) .link {
    background: var(--ds-color-accent-subtle);
    color: var(--ds-color-accent-active);
  }
  :host([disabled]) .link {
    color: var(--ds-color-fg-subtle);
    cursor: not-allowed;
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
  }
  :host-context(ds-sidenav) {
    display: block;
  }
  :host-context(ds-sidenav) .link {
    display: flex;
    width: 100%;
  }
  :host-context(ds-sidenav[collapsed]) .label {
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
  }
  :host-context(ds-sidenav[collapsed]) .link {
    justify-content: center;
    padding: var(--ds-space-2);
  }
`;
