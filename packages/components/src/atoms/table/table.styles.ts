import { css } from 'lit';

export const tableStyles = css`
  :host {
    display: block;
    container-type: inline-size;
    width: 100%;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    --ds-table-header-height: calc(var(--ds-space-2) * 2 + var(--ds-font-size-body-lg) * 1.5 + 1px);
  }

  .toolbar {
    padding: var(--ds-space-3) 0;
  }

  .scroll {
    position: relative;
    width: 100%;
    overflow-x: auto;
    overscroll-behavior-x: none;
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-xs);
    background: var(--ds-color-bg);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  caption {
    caption-side: top;
    /* Shrink to content so sticky has slack, capped so the stacked layout still wraps. */
    position: sticky;
    left: 0;
    width: max-content;
    max-width: 100%;
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
    /* No wrapping keeps the header row a constant height. */
    white-space: nowrap;
    line-height: var(--ds-line-height-none);
  }

  tbody td {
    padding: var(--ds-space-2) var(--ds-space-3);
    border-bottom: 1px solid var(--ds-color-border-subtle);
    vertical-align: middle;
  }

  .cell-label {
    display: none;
  }

  /* Flex so non-text cell content centers against text cells. */
  .cell-content {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
  tbody tr:last-child td:first-child {
    border-bottom-left-radius: calc(var(--ds-radius-xs) - 1px);
  }
  tbody tr:last-child td:last-child {
    border-bottom-right-radius: calc(var(--ds-radius-xs) - 1px);
  }

  tbody tr:nth-child(even) td {
    background: var(--ds-color-bg-subtle);
  }

  .align-left {
    text-align: left;
  }
  .align-right {
    text-align: right;
  }
  .align-center {
    text-align: center;
  }
  .align-right .cell-content {
    justify-content: flex-end;
  }
  .align-center .cell-content {
    justify-content: center;
  }

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
