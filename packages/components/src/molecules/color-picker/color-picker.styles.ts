import { css } from 'lit';

export const colorPickerStyles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    width: 100%;
  }
  .control-wrap {
    position: relative;
    width: 100%;
  }
  .trigger {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--ds-size-md);
    gap: var(--ds-space-3);
    padding: var(--ds-space-1) var(--ds-space-3);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    text-align: left;
    cursor: pointer;
    transition:
      border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .trigger:hover {
    border-color: var(--ds-color-fg-subtle);
  }
  .trigger:focus-visible,
  .trigger[aria-expanded='true'] {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
    outline: none;
  }
  :host([invalid]) .trigger {
    border-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  :host([disabled]) .trigger {
    opacity: 0.5;
    background: var(--ds-color-bg-subtle);
    cursor: not-allowed;
  }
  .preview,
  .swatch {
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
  }
  .preview {
    width: 28px;
    height: 28px;
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-xs);
    flex: 0 0 auto;
  }
  .trigger-text {
    display: grid;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }
  .trigger-label,
  .trigger-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .trigger-value {
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-xs);
  }
  .placeholder {
    color: var(--ds-color-fg-muted);
  }
  .panel {
    position: absolute;
    inset-inline: 0;
    top: calc(100% + var(--ds-space-1));
    z-index: 100;
    max-width: min(100%, calc(100vw - 2rem));
  }
  ds-card::part(card) {
    gap: var(--ds-space-4);
    box-shadow: var(--ds-shadow-md);
  }
  .panel-title {
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-semibold);
  }
  .section {
    display: grid;
    gap: var(--ds-space-2);
  }
  .section-label,
  .hex-label {
    color: var(--ds-color-fg);
    font-size: var(--ds-font-size-xs);
    font-weight: var(--ds-font-weight-medium);
  }
  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
    gap: var(--ds-space-2);
  }
  .swatch {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    min-width: 36px;
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    cursor: pointer;
  }
  .swatch:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus);
  }
  .swatch[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .swatch[aria-checked='true'] {
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
  .swatch[aria-checked='true'] .check {
    display: block;
  }
  .custom-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--ds-space-2);
    align-items: end;
  }
  .native-color {
    width: var(--ds-size-lg);
    height: var(--ds-size-lg);
    padding: 2px;
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    cursor: pointer;
  }
  .hex-field {
    display: grid;
    gap: var(--ds-space-1);
  }
  .hex-input {
    height: var(--ds-size-lg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    padding: 0 var(--ds-space-3);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
  }
  .hex-input:focus-visible {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
    outline: none;
  }
  .hex-input[aria-invalid='true'] {
    border-color: var(--ds-color-danger);
  }
  .input-error {
    margin: 0;
    color: var(--ds-color-danger);
    font-size: var(--ds-font-size-xs);
  }
  .panel-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--ds-space-2);
  }
  @media (max-width: 480px) {
    .custom-row {
      grid-template-columns: 1fr;
      align-items: stretch;
    }
    .native-color {
      width: 100%;
    }
    .panel-actions ds-button {
      flex: 1 1 120px;
    }
  }
`;
