import { css } from 'lit';

export const segmentedControlStyles = css`
  :host {
    display: inline-flex;
    max-width: 100%;
  }
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .group {
    display: inline-flex;
    align-items: stretch;
    gap: var(--ds-space-1);
    padding: var(--ds-space-1);
    background: var(--ds-color-bg-subtle);
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-sm);
    max-width: 100%;
  }
  .segment {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    min-width: 0;
    padding: var(--ds-space-2) var(--ds-space-3);
    border: 0;
    background: transparent;
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    line-height: 1;
    white-space: nowrap;
    border-radius: var(--ds-radius-sm);
    cursor: pointer;
    transition:
      background var(--ds-duration-fast) var(--ds-easing-standard),
      color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .segment:hover:not([disabled]):not([aria-checked='true']) {
    color: var(--ds-color-fg);
  }
  .segment[aria-checked='true'] {
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    box-shadow: var(--ds-shadow-sm);
  }
  .segment:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus);
  }
  .segment[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
