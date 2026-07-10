import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const belowMobileBreakpoint = unsafeCSS(`calc(${breakpoint.sm} - 0.02px)`);

export const colorPickerStyles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    width: 100%;
  }
  :host([compact]) {
    width: auto;
  }
  .control-wrap {
    position: relative;
    width: 100%;
  }
  :host([compact]) .control-wrap {
    width: auto;
  }
  .trigger {
    width: 100%;
  }
  :host([compact]) .trigger {
    width: auto;
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
  :host([compact]) .trigger::part(button) {
    --color-picker-compact-size: 24px;
    width: var(--color-picker-compact-size);
    min-width: var(--color-picker-compact-size);
    height: var(--color-picker-compact-size);
    min-height: var(--color-picker-compact-size);
    padding: 0;
    border-color: var(--color-picker-compact-bg, var(--ds-color-border-strong));
    background: var(--color-picker-compact-bg, var(--ds-color-bg));
    color: var(--color-picker-compact-fg, var(--ds-color-fg));
    justify-content: center;
  }
  :host([compact]) .trigger:hover::part(button),
  :host([compact]) .trigger[aria-expanded='true']::part(button) {
    border-color: var(--color-picker-compact-fg, var(--ds-color-fg-subtle));
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
    width: 24px;
    height: 24px;
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    flex: 0 0 auto;
  }
  :host([compact]) .preview {
    display: none;
  }
  .compact-icon {
    display: none;
  }
  :host([compact]) .compact-icon {
    display: inline-flex;
    color: currentColor;
    font-size: 1rem;
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
    z-index: var(--ds-z-index-dropdown);
    max-width: min(100%, calc(100vw - 2rem));
  }
  :host([compact]) .panel {
    width: min(280px, calc(100vw - 2rem));
    max-width: calc(100vw - 2rem);
    inset-inline-end: auto;
  }
  ds-card::part(card) {
    gap: var(--ds-space-3);
    padding: var(--ds-space-4);
    box-shadow: var(--ds-shadow-md);
  }
  ds-card::part(body) {
    display: grid;
    gap: var(--ds-space-3);
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
    font-size: var(--ds-font-size-sm);
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
    --color-picker-input-size: var(--ds-size-sm);
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
  @media (max-width: ${belowMobileBreakpoint}) {
    .custom-row {
      grid-template-columns: 1fr;
      align-items: stretch;
    }
    .panel-actions ds-button {
      flex: 1 1 120px;
    }
  }
`;
