import { css } from 'lit';

export const toastStyles = css`
  :host {
    display: block;
    pointer-events: auto;
    min-width: 280px;
    max-width: 420px;
  }
  .toast {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-3);
    padding: var(--ds-space-4);
    border-radius: var(--ds-radius-sm);
    border-left: 3px solid var(--ds-color-accent);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    box-shadow: var(--ds-shadow-md);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    line-height: 1.5;
  }
  :host([tone='info']) .toast {
    border-left-color: var(--ds-color-accent);
    background: var(--ds-color-accent-subtle);
  }
  :host([tone='success']) .toast {
    border-left-color: var(--ds-color-success);
    background: var(--ds-color-success-subtle);
  }
  :host([tone='warning']) .toast {
    border-left-color: var(--ds-color-warning);
    background: var(--ds-color-warning-subtle);
  }
  :host([tone='danger']) .toast {
    border-left-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    min-width: 0;
  }
  .title {
    font-family: var(--ds-font-display);
    font-weight: var(--ds-font-weight-semibold);
    font-size: var(--ds-font-size-md);
    letter-spacing: var(--ds-letter-spacing-display);
  }
  ::slotted([slot='actions']) {
    margin-top: var(--ds-space-2);
    display: flex;
    gap: var(--ds-space-2);
  }
  .close {
    appearance: none;
    background: transparent;
    border: none;
    color: inherit;
    padding: var(--ds-space-1);
    margin: calc(var(--ds-space-1) * -1);
    cursor: pointer;
    border-radius: var(--ds-radius-xs);
  }
  .close:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }
`;
