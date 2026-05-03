import { css } from 'lit';

export const menuItemStyles = css`
  :host {
    display: block;
    cursor: pointer;
    border-radius: var(--ds-radius-sm);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
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
    outline: none;
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
  .leading,
  .trailing {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--ds-color-fg-subtle, var(--ds-color-fg));
  }
  .leading:empty,
  .trailing:empty {
    display: none;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .primary {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .description {
    display: block;
    font-size: var(--ds-font-size-2xs);
    color: var(--ds-color-fg-subtle, var(--ds-color-fg));
  }
  .description:empty {
    display: none;
  }
  .check {
    width: 1rem;
    height: 1rem;
    color: var(--ds-color-accent);
  }
`;
