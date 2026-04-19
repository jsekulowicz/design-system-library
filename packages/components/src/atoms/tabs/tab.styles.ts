import { css } from 'lit';

export const tabStyles = css`
  :host {
    display: inline-flex;
    outline: none;
  }
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .tab {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    padding: var(--ds-space-3) var(--ds-space-2);
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    line-height: 1;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition:
      color var(--ds-duration-fast) var(--ds-easing-standard),
      border-color var(--ds-duration-fast) var(--ds-easing-standard);
    user-select: none;
    white-space: nowrap;
  }
  :host(:hover:not([disabled])) .tab {
    color: var(--ds-color-fg);
  }
  :host([selected]) .tab {
    color: var(--ds-color-accent);
    border-bottom-color: var(--ds-color-accent);
  }
  :host(:focus-visible) .tab {
    border-radius: var(--ds-radius-sm);
    box-shadow: var(--ds-shadow-focus);
  }
`;
