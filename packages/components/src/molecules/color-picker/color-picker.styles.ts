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
    width: 100%;
  }
  .trigger::part(button) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: var(--ds-size-md);
    gap: var(--ds-space-3);
    padding: var(--ds-space-1) var(--ds-space-3);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    height: auto;
    text-align: left;
    transition:
      border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .trigger:hover::part(button) {
    border-color: var(--ds-color-fg-subtle);
  }
  .trigger[aria-expanded='true']::part(button) {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
    outline: none;
  }
  :host([invalid]) .trigger::part(button) {
    border-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  :host([disabled]) .trigger::part(button) {
    opacity: 0.5;
    background: var(--ds-color-bg-subtle);
    cursor: not-allowed;
  }
  .preview {
    background: var(--color-picker-value, transparent);
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
  .section-label {
    color: var(--ds-color-fg);
    font-size: var(--ds-font-size-xs);
    font-weight: var(--ds-font-weight-medium);
  }
  .custom-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--ds-space-2);
    align-items: end;
  }
  .native-color {
    align-self: end;
  }
  .hex-input {
    min-width: 0;
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
    .panel-actions ds-button {
      flex: 1 1 120px;
    }
  }
`;
