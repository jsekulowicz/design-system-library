import { css } from 'lit';

export const menuItemStyles = css`
  :host {
    display: block;
    cursor: pointer;
    border-radius: var(--ds-radius-sm);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    user-select: none;
  }
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }
  :host(:hover:not([disabled])),
  :host(:focus-visible) {
    background: var(--ds-color-bg-subtle);
  }
  :host(:focus-visible) {
    box-shadow: var(--ds-shadow-focus);
  }
  .item {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    padding: var(--ds-space-2) var(--ds-space-3);
    min-height: 36px;
    box-sizing: border-box;
  }
  .primary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
