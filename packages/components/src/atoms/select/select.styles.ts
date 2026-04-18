import { css } from 'lit';

export const selectStyles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    width: 100%;
  }
  .label {
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    color: var(--ds-color-fg);
    line-height: 1.4;
    cursor: default;
  }
  :host([invalid]) .label {
    color: var(--ds-color-danger);
  }
  .required {
    color: var(--ds-color-danger);
  }
  .control-wrap {
    position: relative;
    width: 100%;
  }
  .trigger {
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--ds-size-md);
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    padding: 0 var(--ds-space-3);
    cursor: pointer;
    text-align: left;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    color: var(--ds-color-fg);
    transition:
      border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .trigger:hover {
    border-color: var(--ds-color-fg-subtle);
  }
  .trigger:focus-visible {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
    outline: none;
  }
  .trigger[aria-expanded='true'] {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  :host([invalid]) .trigger {
    border-color: var(--ds-color-danger);
  }
  :host([invalid]) .trigger:focus-visible {
    box-shadow: 0 0 0 3px rgba(178, 26, 10, 0.3);
  }
  :host([disabled]) .trigger {
    opacity: 0.5;
    background: var(--ds-color-bg-subtle);
    cursor: not-allowed;
    pointer-events: none;
  }
  .trigger-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .trigger-label.placeholder {
    color: var(--ds-color-fg-muted);
  }
  .caret {
    pointer-events: none;
    width: 1.2rem;
    height: 1.2rem;
    margin-left: var(--ds-space-2);
    color: var(--ds-color-fg-muted);
    flex-shrink: 0;
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host([invalid]) .caret {
    color: var(--ds-color-danger);
  }
  .trigger[aria-expanded='true'] .caret {
    transform: rotate(180deg);
  }
  .listbox {
    position: absolute;
    top: calc(100% + var(--ds-space-1));
    left: 0;
    right: 0;
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    box-shadow: var(--ds-shadow-md);
    z-index: 100;
    max-height: 240px;
    overflow-y: auto;
  }
  .option {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    padding: var(--ds-space-2) var(--ds-space-3);
    cursor: pointer;
    font-size: var(--ds-font-size-sm);
    color: var(--ds-color-fg);
  }
  .option:hover,
  .option.focused {
    background: var(--ds-color-bg-subtle);
  }
  .option.selected {
    background: var(--ds-color-accent-subtle);
  }
  .option.selected.focused,
  .option.selected:hover {
    background: var(--ds-color-bg-subtle);
  }
  .option.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .option-label {
    flex: 1;
  }
  .check-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    color: var(--ds-color-accent);
  }
  .description {
    margin: 0;
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-fg-muted);
    line-height: 1.4;
  }
  .error {
    margin: 0;
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-danger);
    line-height: 1.4;
  }
`;
