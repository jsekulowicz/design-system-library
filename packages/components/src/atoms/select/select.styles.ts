import { css } from 'lit';

export const selectStyles = css`
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
    background: var(--ds-color-danger-subtle);
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
  .trigger-multiple {
    height: auto;
    min-height: var(--ds-size-md);
    padding: 6px var(--ds-space-3);
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ds-space-1);
    overflow: visible;
  }
  .tiles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-1);
    flex: 1;
    min-width: 0;
  }
  .tile {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    height: 24px;
    padding: 0 var(--ds-space-1) 0 var(--ds-space-2);
    background: var(--ds-color-bg-subtle);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-xs);
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-fg);
    white-space: nowrap;
  }
  .tile-focused {
    border-color: var(--ds-color-accent);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ds-color-accent) 35%, transparent);
  }
  .tile-overflow {
    background: var(--ds-color-accent-subtle);
    border-color: var(--ds-color-accent);
    color: var(--ds-color-accent);
    padding: 0 var(--ds-space-2);
    font-weight: var(--ds-font-weight-medium);
  }
  .tile-label {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tile-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    padding: 0;
    border: none;
    background: none;
    color: var(--ds-color-fg-muted);
    cursor: pointer;
    border-radius: var(--ds-radius-xs);
    flex-shrink: 0;
  }
  .tile-remove:hover {
    color: var(--ds-color-fg);
    background: var(--ds-color-border);
  }
  .tile-remove svg {
    width: 10px;
    height: 10px;
  }
  .leading {
    display: inline-flex;
    align-items: center;
    color: var(--ds-color-fg-muted);
    margin-right: var(--ds-space-2);
    flex-shrink: 0;
  }
  .leading[hidden] {
    display: none;
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
  .clear-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.2rem;
    height: 1.2rem;
    padding: 0;
    border: none;
    background: none;
    color: var(--ds-color-fg-muted);
    cursor: pointer;
    border-radius: var(--ds-radius-xs);
    flex-shrink: 0;
  }
  .clear-btn:hover {
    color: var(--ds-color-fg);
  }
  .clear-btn:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus);
  }
  .clear-btn svg {
    width: 1rem;
    height: 1rem;
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
`;
