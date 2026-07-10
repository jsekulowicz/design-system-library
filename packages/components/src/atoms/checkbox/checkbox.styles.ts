import { css } from 'lit';

export const checkboxStyles = css`
  .control {
    border-radius: var(--ds-radius-xs);
  }
  :host([checked]) .control,
  :host([indeterminate]) .control {
    background: var(--ds-color-accent);
    border-color: var(--ds-color-accent);
  }
  :host([invalid]) .control {
    border-color: var(--ds-color-danger);
  }
  .check {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    color: var(--ds-color-bg);
    visibility: hidden;
    opacity: 0;
    transition: opacity var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host([checked]) .check,
  :host([indeterminate]) .check {
    visibility: visible;
    opacity: 1;
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
`;
