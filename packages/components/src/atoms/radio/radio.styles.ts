import { css } from 'lit';

export const radioStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    color: var(--ds-color-fg);
    cursor: pointer;
  }
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .dot {
    width: 1.1rem;
    height: 1.1rem;
    border: 1.5px solid var(--ds-color-border-strong);
    border-radius: 50%;
    background: var(--ds-color-bg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color var(--ds-duration-fast) var(--ds-easing-standard);
    flex-shrink: 0;
  }
  :host(:focus-within) .dot {
    box-shadow: var(--ds-shadow-focus);
  }
  .dot::after {
    content: '';
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--ds-color-accent);
    transform: scale(0);
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host([checked]) .dot {
    border-color: var(--ds-color-accent);
  }
  :host([checked]) .dot::after {
    transform: scale(1);
  }
  input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
  label {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    cursor: inherit;
  }
`;
