import { css } from 'lit';

export const buttonStyles = css`
  :host {
    --ds-button-size: var(--ds-size-md);
    --ds-button-min-width: 4.5rem;
    --ds-button-bg: var(--ds-color-accent);
    --ds-button-fg: var(--ds-color-accent-fg);
    --ds-button-bg-hover: color-mix(in oklab, var(--ds-button-bg) 92%, var(--ds-button-fg));
    --ds-button-bg-active: color-mix(in oklab, var(--ds-button-bg) 84%, var(--ds-button-fg));
    --ds-button-solid: var(--ds-button-bg);
    --ds-button-solid-hover: var(--ds-button-bg-hover);
    --ds-button-solid-active: var(--ds-button-bg-active);
    --ds-button-on-solid: var(--ds-button-fg);
    --ds-button-line: var(--ds-color-border-strong);
    --ds-button-text: var(--ds-color-fg);
    display: inline-flex;
    vertical-align: middle;
  }
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    padding: 0 var(--ds-space-2);
    height: var(--ds-button-size);
    min-width: var(--ds-button-min-width);
    border-radius: var(--ds-radius-xs);
    border: 1px solid transparent;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    font-weight: var(--ds-font-weight-medium);
    letter-spacing: var(--ds-letter-spacing-normal);
    line-height: var(--ds-line-height-none);
    cursor: pointer;
    background: transparent;
    color: var(--ds-color-fg);
    text-decoration: none;
    box-sizing: border-box;
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
  .content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    min-width: 0;
  }
  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stack {
    display: grid;
    grid-template-areas: 'stack';
    align-items: center;
    justify-items: center;
    min-width: 0;
  }
  .stack > * {
    grid-area: stack;
    min-width: 0;
  }
  .stack-item {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
  }
  .is-hidden {
    visibility: hidden;
  }
  .spinner.is-hidden {
    animation-play-state: paused;
  }
  :host([color='success']) {
    --ds-button-bg: var(--ds-color-success);
    --ds-button-bg-hover: var(--ds-color-success);
    --ds-button-bg-active: var(--ds-color-success);
    --ds-button-line: var(--ds-color-success);
    --ds-button-text: var(--ds-color-success);
  }
  :host([color='danger']) {
    --ds-button-bg: var(--ds-color-danger);
    --ds-button-bg-hover: var(--ds-color-danger);
    --ds-button-bg-active: var(--ds-color-danger);
    --ds-button-line: var(--ds-color-danger);
    --ds-button-text: var(--ds-color-danger);
  }
  :host([variant='primary']) .btn {
    background: var(--ds-button-solid);
    color: var(--ds-button-on-solid);
  }
  :host([variant='primary']) .btn:hover:not([aria-disabled='true']) {
    background: var(--ds-button-solid-hover);
  }
  :host([variant='primary']) .btn:active:not([aria-disabled='true']) {
    background: var(--ds-button-solid-active);
  }
  :host([variant='secondary']) .btn {
    background: transparent;
    color: var(--ds-button-text);
    border-color: var(--ds-button-line);
  }
  :host([variant='secondary']) .btn:hover:not([aria-disabled='true']) {
    background: var(--ds-color-bg-subtle);
  }
  :host([variant='ghost']) .btn {
    background: transparent;
    color: var(--ds-button-text);
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
