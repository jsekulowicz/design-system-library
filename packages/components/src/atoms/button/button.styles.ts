import { css } from 'lit';

export const buttonStyles = css`
  :host {
    --ds-button-size: var(--ds-size-md);
    --ds-button-min-width: 4.5rem;
    display: inline-flex;
    vertical-align: middle;
  }
  .btn {
    /* color picks the tint; the accent default keeps secondary/ghost neutral. */
    --ds-btn-solid: var(--ds-color-accent);
    --ds-btn-on: var(--ds-color-accent-fg);
    --ds-btn-line: var(--ds-color-border-strong);
    --ds-btn-text: var(--ds-color-fg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    padding: 0 var(--ds-space-2);
    height: var(--ds-button-size);
    min-width: var(--ds-button-min-width);
    border-radius: var(--ds-radius-sm);
    border: 1px solid transparent;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    font-weight: var(--ds-font-weight-medium);
    letter-spacing: var(--ds-letter-spacing-normal);
    line-height: 1;
    cursor: pointer;
    background: transparent;
    color: var(--ds-color-fg);
    transition:
      background var(--ds-duration-fast) var(--ds-easing-standard),
      color var(--ds-duration-fast) var(--ds-easing-standard),
      border-color var(--ds-duration-fast) var(--ds-easing-standard),
      transform var(--ds-duration-fast) var(--ds-easing-standard);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .btn:focus-visible {
    box-shadow: var(--ds-shadow-focus);
  }
  .btn:active:not([aria-disabled='true']) {
    transform: translateY(1px);
  }
  :host([disabled]) .btn {
    opacity: 0.45;
    cursor: not-allowed;
  }
  :host([loading]) .btn {
    cursor: wait;
  }
  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    animation: ds-btn-spin 0.75s linear infinite;
  }
  @keyframes ds-btn-spin {
    to {
      transform: rotate(360deg);
    }
  }
  :host([color='success']) .btn {
    --ds-btn-solid: var(--ds-color-success);
    --ds-btn-line: var(--ds-color-success);
    --ds-btn-text: var(--ds-color-success);
  }
  :host([color='danger']) .btn {
    --ds-btn-solid: var(--ds-color-danger);
    --ds-btn-line: var(--ds-color-danger);
    --ds-btn-text: var(--ds-color-danger);
  }
  :host([variant='primary']) .btn {
    background: var(--ds-btn-solid);
    color: var(--ds-btn-on);
  }
  :host([variant='primary'][color='accent']) .btn:hover:not([aria-disabled='true']) {
    background: var(--ds-color-accent-hover);
  }
  :host([variant='primary'][color='accent']) .btn:active:not([aria-disabled='true']) {
    background: var(--ds-color-accent-active);
  }
  :host([variant='secondary']) .btn {
    background: transparent;
    color: var(--ds-btn-text);
    border-color: var(--ds-btn-line);
  }
  :host([variant='secondary']) .btn:hover:not([aria-disabled='true']) {
    background: var(--ds-color-bg-subtle);
  }
  :host([variant='ghost']) .btn {
    background: transparent;
    color: var(--ds-btn-text);
  }
  :host([variant='ghost']) .btn:hover:not([aria-disabled='true']) {
    background: var(--ds-color-bg-subtle);
  }
  :host([square]) .btn {
    width: var(--ds-button-size);
    min-width: var(--ds-button-size);
    padding: 0;
  }
  :host([size='sm']) .btn {
    --ds-button-size: var(--ds-size-sm);
    --ds-button-min-width: 4rem;
  }
  :host([size='lg']) .btn {
    --ds-button-size: var(--ds-size-lg);
    --ds-button-min-width: 5rem;
  }
  :host([full-width]) {
    display: flex;
    width: 100%;
  }
  :host([full-width]) .btn {
    width: 100%;
  }
`;
