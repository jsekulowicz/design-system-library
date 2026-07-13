import { css } from 'lit';

/* Label layout and the 1rem bordered control shared by ds-checkbox (.control
   is the square box) and ds-radio (.control is the round dot). */
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
    align-items: center;
    gap: var(--ds-space-2);
    line-height: 1;
  }
  .control {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--ds-color-border-strong);
    background: var(--ds-color-bg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background var(--ds-duration-fast) var(--ds-easing-standard),
      border-color var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host(:focus-within) .control {
    box-shadow: var(--ds-shadow-focus);
  }
`;
