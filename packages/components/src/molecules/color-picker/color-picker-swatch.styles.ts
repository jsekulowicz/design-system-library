import { css } from 'lit';

export const colorPickerSwatchStyles = css`
  :host {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    width: var(--color-picker-swatch-size, 28px);
    min-width: var(--color-picker-swatch-size, 28px);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    background: var(--color-picker-value, transparent);
    cursor: pointer;
  }

  :host(:focus-visible) {
    outline: none;
    box-shadow: var(--ds-shadow-focus);
  }

  :host([disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :host([selected]) {
    border-color: transparent;
  }

  .check {
    display: none;
    width: 18px;
    height: 18px;
    color: var(--color-picker-check-color, var(--ds-color-bg));
  }

  :host([selected]) .check {
    display: block;
  }
`;
