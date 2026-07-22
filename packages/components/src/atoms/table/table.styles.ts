import { css } from 'lit';

export const tableStyles = css`
  :host {
    display: block;
    container-type: inline-size;
    width: 100%;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    /* Header row height (used as the top scroll-fade offset in scroll-body
       mode). Single-line by construction; override to taste. */
    --ds-table-header-height: calc(var(--ds-space-2) * 2 + var(--ds-font-size-body-lg) * 1.5 + 1px);
  }

  .toolbar {
    padding: var(--ds-space-3) 0;
  }

  .scroll {
    position: relative;
    width: 100%;
    overflow-x: auto;
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-md);
    background: var(--ds-color-bg);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  caption {
    caption-side: top;
    padding: var(--ds-space-3);
    color: var(--ds-color-fg-muted);
    text-align: left;
  }
  caption:empty {
    display: none;
    padding: 0;
  }

  thead th {
    background: var(--ds-color-bg-subtle);
    color: var(--ds-color-fg);
    font-weight: var(--ds-font-weight-medium);
    padding: var(--ds-space-2) var(--ds-space-3);
    border-bottom: 1px solid var(--ds-color-border);
    /* Headers never wrap, so the header row keeps a constant height (a long
       header widens its column / scrolls rather than growing taller). */
    white-space: nowrap;
  }

  tbody td {
    padding: var(--ds-space-2) var(--ds-space-3);
    border-bottom: 1px solid var(--ds-color-border-subtle);
    vertical-align: middle;
  }

  .cell-label {
    display: none;
  }

  /* Flex (not block) so custom cell content (icon scales, badges, links)
     centres vertically against text cells. justify-content mirrors the
     column alignment for non-text items; text-align (below) still handles
     wrapped text inside the item. */
  .cell-content {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
  tbody tr:last-child td:first-child {
    border-bottom-left-radius: calc(var(--ds-radius-md) - 1px);
  }
  tbody tr:last-child td:last-child {
    border-bottom-right-radius: calc(var(--ds-radius-md) - 1px);
  }

  tbody tr:nth-child(even) td {
    background: var(--ds-color-bg-subtle);
  }

  .align-left { text-align: left; }
  .align-right { text-align: right; }
  .align-center { text-align: center; }
  .align-right .cell-content { justify-content: flex-end; }
  .align-center .cell-content { justify-content: center; }

  tbody tr.clickable {
    position: relative;
    cursor: pointer;
    outline: none;
  }
  tbody tr.clickable:hover td {
    background: var(--ds-color-bg-muted);
  }
  tbody tr.clickable:has(.row-action:focus-visible) td {
    background: var(--ds-color-bg-muted);
    box-shadow:
      inset 0 2px 0 var(--ds-color-focus),
      inset 0 -2px 0 var(--ds-color-focus);
  }
  tbody tr.clickable:has(.row-action:focus-visible) td:first-child {
    box-shadow:
      inset 2px 0 0 var(--ds-color-focus),
      inset 0 2px 0 var(--ds-color-focus),
      inset 0 -2px 0 var(--ds-color-focus);
  }
  tbody tr.clickable:has(.row-action:focus-visible) td:last-child {
    box-shadow:
      inset -2px 0 0 var(--ds-color-focus),
      inset 0 2px 0 var(--ds-color-focus),
      inset 0 -2px 0 var(--ds-color-focus);
  }
  tbody tr.clickable:has(.row-action:focus-visible) td:first-child:last-child {
    box-shadow: inset 0 0 0 2px var(--ds-color-focus);
  }


  .skeleton-table {
    min-width: 32rem;
  }
  .skeleton-label {
    display: none;
  }

  .empty {
    padding: var(--ds-space-6);
    text-align: center;
    color: var(--ds-color-fg-muted);
  }

  .footer {
    padding: var(--ds-space-3) 0;
  }
`;
