import { css } from 'lit';

export const colorPickerSwatchStyles = css`
  :host {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    min-width: 36px;
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    background:
      linear-gradient(45deg, #d7dce4 25%, transparent 25%),
      linear-gradient(-45deg, #d7dce4 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #d7dce4 75%),
      linear-gradient(-45deg, transparent 75%, #d7dce4 75%),
      var(--color-picker-value, transparent);
    background-position:
      0 0,
      0 6px,
      6px -6px,
      -6px 0;
    background-size: 12px 12px;
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
    box-shadow:
      inset 0 0 0 2px var(--ds-color-bg),
      0 0 0 2px var(--ds-color-accent);
  }

  .check {
    display: none;
    width: 20px;
    height: 20px;
    padding: 3px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.92);
    color: #111827;
  }

  :host([selected]) .check {
    display: block;
  }
`;
