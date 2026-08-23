import { css } from 'lit';

const TILE_HEIGHT = 28;
const TILE_GAP = 4;

/** Pitch of a row of selected tiles; the overflow math counts in these. */
export const TILE_ROW_HEIGHT = TILE_HEIGHT + TILE_GAP;

export const selectCommonStyles = css`
  :host {
    --ds-select-size: var(--ds-size-md);
    display: inline-flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    width: 100%;
  }
  :host([size='sm']) {
    --ds-select-size: var(--ds-size-sm);
  }
  :host([size='lg']) {
    --ds-select-size: var(--ds-size-lg);
  }
  .control-wrap {
    position: relative;
    width: 100%;
  }
  .trigger {
    /* The popover listbox positions itself against this via CSS anchor
       positioning (scoped to this shadow root, so instances don't clash). */
    anchor-name: --ds-select-trigger;
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    width: 100%;
    height: var(--ds-select-size);
    padding: 0 var(--ds-space-3);
  }
  :host([disabled]) .trigger {
    pointer-events: none;
  }
  .trigger-multiple {
    height: auto;
    min-height: var(--ds-select-size);
    padding: max(1px, calc((var(--ds-select-size) - ${TILE_HEIGHT + 2}px) / 2)) var(--ds-space-3);
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ds-space-2);
    overflow: visible;
  }
  .tiles {
    display: flex;
    flex-wrap: wrap;
    gap: ${TILE_GAP}px;
    min-width: 0;
  }
  .tile {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    /* Grow with the label up to the full row width, then the label
       ellipsizes - rather than hard-capping every tile to a narrow width
       and wasting the rest of the row. */
    max-width: 100%;
    height: ${TILE_HEIGHT}px;
    padding: 0 var(--ds-space-1) 0 var(--ds-space-2);
    background: var(--ds-color-bg-subtle);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-xs);
    color: var(--ds-color-fg);
    font-size: var(--ds-font-size-body-md);
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
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tile-remove,
  .clear-btn {
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
    width: 20px;
    height: 20px;
  }
  .tile-remove:hover {
    color: var(--ds-color-fg);
    background: var(--ds-color-border);
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
    width: 1.5rem;
    height: 1.5rem;
  }
  .clear-btn:hover {
    color: var(--ds-color-fg);
  }
  .clear-btn:focus-visible {
    box-shadow: var(--ds-shadow-focus);
  }
  .caret {
    color: var(--ds-color-fg-muted);
    pointer-events: none;
    flex-shrink: 0;
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .listbox {
    /* In-flow fallback for browsers without the Popover API. When the API is
       available the listbox is shown via showPopover() (top layer, so it
       escapes any overflow:hidden / scroll ancestor) and positioned with CSS
       anchor positioning - see .listbox[popover]:popover-open below. */
    position: absolute;
    inset: calc(100% + var(--ds-space-1)) 0 auto;
    z-index: var(--ds-z-index-dropdown);
    max-height: 240px;
    overflow-y: auto;
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-xs);
    box-shadow: var(--ds-shadow-md);
    /* Thin, subtle scrollbar with a transparent track (matching the shell's
       main content) instead of the wide, bright default that painted over
       the listbox's rounded corners. No scrollbar-gutter: the dropdown
       shouldn't reserve a permanent track when it doesn't overflow. */
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
  }

  /* Shown in the top layer: position it under the trigger with CSS anchor
     positioning - matching the trigger's width (so long options wrap rather
     than widening the menu) and flipping above when there's no room below.
     The browser keeps it glued to the trigger on scroll, so no JS. */
  .listbox[popover]:popover-open {
    position: fixed;
    position-anchor: --ds-select-trigger;
    inset: auto;
    top: calc(anchor(bottom) + var(--ds-space-1));
    left: anchor(left);
    width: anchor-size(width);
    margin: 0;
    padding: 0;
    position-try-fallbacks: flip-block;
  }

  /* Informative note pinned to the top of the open dropdown (e.g. why an option
     is disabled). Sticky so it stays visible while the options scroll. */
  .listbox-hint {
    position: sticky;
    top: 0;
    z-index: var(--ds-z-index-raised);
    padding: var(--ds-space-2) var(--ds-space-3);
    background: var(--ds-color-bg);
    border-bottom: 1px solid var(--ds-color-border-strong);
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-sm);
    line-height: var(--ds-line-height-normal);
  }
`;
