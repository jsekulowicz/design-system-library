import { css } from 'lit';

export const toggleControlStyles = css`
  :host {
    display: inline-flex;
    cursor: pointer;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    color: var(--ds-color-fg);
  }
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }
  label {
    cursor: inherit;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--ds-space-2);
    /* Room for descenders: line-height 1 makes the host shorter than its own text. */
    line-height: var(--ds-line-height-snug);
  }
  /* Baseline from the label text, not the textless control box. */
  [part~='label'] {
    align-self: baseline;
  }
  .control {
    width: 1rem;
    height: 1rem;
    margin-block-start: calc((var(--ds-line-height-snug) * 1em - 1rem) / 2);
    border: 2px solid var(--ds-color-border-strong);
    background: var(--ds-color-bg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      background var(--ds-duration-fast) var(--ds-easing-standard),
      border-color var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host(:focus-within) .control {
    box-shadow: var(--ds-shadow-focus);
  }
`;
