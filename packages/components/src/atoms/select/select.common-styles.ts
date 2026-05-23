import { css } from 'lit';

export const selectCommonStyles = css`
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
    gap: var(--ds-space-2);
    width: 100%;
    height: var(--ds-size-md);
    padding: 0 var(--ds-space-3);
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    transition: border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .trigger:hover {
    border-color: var(--ds-color-fg-subtle);
  }
  :host([invalid]) .trigger {
    border-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  :host([invalid]) .trigger:is(:focus-visible, :focus-within) {
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
    gap: var(--ds-space-2);
    overflow: visible;
  }
  .tiles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-1);
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
    color: var(--ds-color-fg);
    font-size: var(--ds-font-size-xs);
    white-space: nowrap;
  }
  .tile-focused {
    border-color: var(--ds-color-accent);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ds-color-accent) 35%, transparent);
  }
  .tile-overflow {
    padding: 0 var(--ds-space-2);
    background: var(--ds-color-accent-subtle);
    border-color: var(--ds-color-accent);
    color: var(--ds-color-accent);
    font-weight: var(--ds-font-weight-medium);
  }
  .tile-label {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tile-remove, .clear-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;
    color: var(--ds-color-fg-muted);
    cursor: pointer;
    border-radius: var(--ds-radius-xs);
    flex-shrink: 0;
  }
  .tile-remove {
    width: 14px; height: 14px;
  }
  .tile-remove:hover {
    color: var(--ds-color-fg);
    background: var(--ds-color-border);
  }
  .tile-remove svg {
    width: 10px; height: 10px;
  }
  .leading {
    display: inline-flex;
    align-items: center;
    color: var(--ds-color-fg-muted);
    flex-shrink: 0;
  }
  .leading[hidden] {
    display: none;
  }
  .clear-btn {
    width: 1.2rem; height: 1.2rem;
  }
  .clear-btn:hover {
    color: var(--ds-color-fg);
  }
  .clear-btn:focus-visible {
    box-shadow: var(--ds-shadow-focus);
  }
  .clear-btn svg {
    width: 1rem; height: 1rem;
  }
  .caret {
    width: 1.2rem;
    height: 1.2rem;
    color: var(--ds-color-fg-muted);
    pointer-events: none;
    flex-shrink: 0;
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .listbox {
    /* Default in-flow positioning is the fallback for browsers that
       don't support the Popover API. When the API is available the
       listbox is shown via showPopover() and JS sets inline
       position/top/left/min-width — see DsSelect.#positionListbox.
       That escapes any overflow:hidden / overflow:auto ancestor
       (dialogs, scroll containers) by placing the listbox in the
       browser's top layer. */
    position: absolute;
    inset: calc(100% + var(--ds-space-1)) 0 auto;
    z-index: 100;
    max-height: 240px;
    overflow-y: auto;
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    box-shadow: var(--ds-shadow-md);
  }

  /* Reset the UA defaults that the popover spec applies to shown
     popovers (inset:0, margin:auto, padding:0.25em). The inline coords
     from #positionListbox take care of placement; padding would just
     visually pad the listbox content. */
  .listbox[popover]:popover-open {
    inset: unset;
    margin: 0;
    padding: 0;
  }
`;
