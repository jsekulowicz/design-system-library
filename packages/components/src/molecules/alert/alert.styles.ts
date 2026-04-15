import { css } from 'lit';

export const alertStyles = css`
  :host {
    display: block;
  }
  .alert {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-3);
    padding: var(--ds-space-4);
    border-radius: var(--ds-radius-sm);
    border-left: 3px solid var(--ds-color-accent);
    background: var(--ds-color-bg-subtle);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    line-height: 1.5;
  }
  :host([tone='info']) .alert {
    border-left-color: var(--ds-color-accent);
    background: var(--ds-color-accent-subtle);
  }
  :host([tone='success']) .alert {
    border-left-color: var(--ds-color-success);
    background: var(--ds-color-success-subtle);
  }
  :host([tone='warning']) .alert {
    border-left-color: var(--ds-color-warning);
    background: var(--ds-color-warning-subtle);
  }
  :host([tone='danger']) .alert {
    border-left-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }
  .title {
    font-family: var(--ds-font-display);
    font-weight: var(--ds-font-weight-semibold);
    font-size: var(--ds-font-size-md);
    letter-spacing: var(--ds-letter-spacing-display);
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
  .icon {
    flex-shrink: 0;
    width: 1.1rem;
    height: 1.1rem;
    margin-top: 0.1rem;
  }
`;
