import { css } from 'lit';

export const checkboxStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    color: var(--ds-color-fg);
  }
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .box {
    width: 1rem;
    height: 1rem;
    border: 1.5px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-xs);
    background: var(--ds-color-bg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background var(--ds-duration-fast) var(--ds-easing-standard),
      border-color var(--ds-duration-fast) var(--ds-easing-standard);
    flex-shrink: 0;
  }
  :host(:focus-within) .box {
    box-shadow: var(--ds-shadow-focus);
  }
  :host([checked]) .box {
    background: var(--ds-color-accent);
    border-color: var(--ds-color-accent);
  }
  :host([indeterminate]) .box {
    background: var(--ds-color-accent);
    border-color: var(--ds-color-accent);
  }
  .check {
    width: 0.7rem;
    height: 0.7rem;
    color: var(--ds-color-accent-fg);
    display: none;
  }
  :host([checked]) .check,
  :host([indeterminate]) .check {
    display: block;
  }
  :host([invalid]) .box {
    border-color: var(--ds-color-danger);
  }
  input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  label {
    cursor: inherit;
  }
`;
