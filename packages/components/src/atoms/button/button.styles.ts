import { css } from 'lit';

export const buttonStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    padding: 0 var(--ds-space-5);
    height: var(--ds-size-md);
    min-width: var(--ds-size-md);
    border-radius: var(--ds-radius-sm);
    border: 1px solid transparent;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    letter-spacing: var(--ds-letter-spacing-normal);
    line-height: 1;
    cursor: pointer;
    background: transparent;
    color: var(--ds-color-fg);
    transition: background var(--ds-duration-fast) var(--ds-easing-standard),
      color var(--ds-duration-fast) var(--ds-easing-standard),
      border-color var(--ds-duration-fast) var(--ds-easing-standard),
      transform var(--ds-duration-fast) var(--ds-easing-standard);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .btn:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }
  .btn:active:not(:disabled) {
    transform: translateY(1px);
  }
  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  :host([variant='primary']) .btn {
    background: var(--ds-color-accent);
    color: var(--ds-color-accent-fg);
  }
  :host([variant='primary']) .btn:hover:not(:disabled) {
    background: var(--ds-color-accent-hover);
  }
  :host([variant='primary']) .btn:active:not(:disabled) {
    background: var(--ds-color-accent-active);
  }
  :host([variant='secondary']) .btn {
    background: transparent;
    color: var(--ds-color-fg);
    border-color: var(--ds-color-border-strong);
  }
  :host([variant='secondary']) .btn:hover:not(:disabled) {
    background: var(--ds-color-bg-subtle);
  }
  :host([variant='ghost']) .btn {
    background: transparent;
    color: var(--ds-color-fg);
  }
  :host([variant='ghost']) .btn:hover:not(:disabled) {
    background: var(--ds-color-bg-subtle);
  }
  :host([variant='danger']) .btn {
    background: var(--ds-color-danger);
    color: var(--ds-color-accent-fg);
  }
  :host([size='sm']) .btn {
    height: var(--ds-size-sm);
    padding: 0 var(--ds-space-4);
    font-size: var(--ds-font-size-xs);
  }
  :host([size='lg']) .btn {
    height: var(--ds-size-lg);
    padding: 0 var(--ds-space-6);
    font-size: var(--ds-font-size-md);
  }
  :host([full-width]) {
    display: flex;
    width: 100%;
  }
  :host([full-width]) .btn {
    width: 100%;
  }
  @container (max-width: 360px) {
    :host([responsive]) .btn {
      padding: 0 var(--ds-space-3);
    }
  }
`;
