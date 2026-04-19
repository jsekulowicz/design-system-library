import { css } from 'lit';

export const searchableSelectStyles = css`
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
    height: var(--ds-size-md);
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    padding: 0 var(--ds-space-3);
    transition:
      border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .trigger:hover {
    border-color: var(--ds-color-fg-subtle);
  }
  .trigger:focus-within {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
    outline: none;
  }
  .trigger.open {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  :host([invalid]) .trigger {
    border-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  :host([invalid]) .trigger:focus-within {
    box-shadow: 0 0 0 3px rgba(178, 26, 10, 0.3);
  }
  :host([disabled]) .trigger {
    opacity: 0.5;
    background: var(--ds-color-bg-subtle);
    cursor: not-allowed;
    pointer-events: none;
  }
  .search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    min-width: 0;
    cursor: pointer;
  }
  .search-input::placeholder {
    color: var(--ds-color-fg-muted);
  }
  .trigger.open .search-input {
    cursor: text;
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
  .trigger.open .caret {
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
    height: 36px; /* must match ITEM_HEIGHT constant in virtual-list.ts */
    box-sizing: border-box;
    padding: 0 var(--ds-space-3);
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
  .empty {
    margin: 0;
    padding: var(--ds-space-3);
    font-size: var(--ds-font-size-sm);
    color: var(--ds-color-fg-muted);
    text-align: center;
  }
  mark.match {
    background: none;
    color: var(--ds-color-accent);
    font-weight: var(--ds-font-weight-medium);
  }
`;
