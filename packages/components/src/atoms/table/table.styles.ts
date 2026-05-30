import { css } from 'lit';

export const tableStyles = css`
  :host {
    display: block;
    container-type: inline-size;
    width: 100%;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    /* Header row height (used as the top scroll-fade offset in scroll-body
       mode). Single-line by construction; override to taste. */
    --ds-table-header-height: calc(var(--ds-space-2) * 2 + var(--ds-font-size-sm) * 1.5 + 1px);
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
    /* Headers never wrap, so the row height stays constant. When a column
       is width-capped, a long header truncates with an ellipsis (and a
       native title tooltip) instead of widening the table. */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  tbody td {
    padding: var(--ds-space-2) var(--ds-space-3);
    border-bottom: 1px solid var(--ds-color-border-subtle);
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr:nth-child(even) td {
    background: var(--ds-color-bg-subtle);
  }

  .align-left { text-align: left; }
  .align-right { text-align: right; }
  .align-center { text-align: center; }

  tbody tr.clickable {
    cursor: pointer;
    outline: none;
  }
  tbody tr.clickable:hover td {
    background: var(--ds-color-bg-muted);
  }
  tbody tr.clickable:focus-visible {
    box-shadow: inset 0 0 0 2px var(--ds-color-focus);
  }

  .skeleton-table {
    min-width: 32rem;
  }
  .skeleton-label {
    display: none;
  }

  .loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    min-height: 100%;
    background: color-mix(in srgb, var(--ds-color-bg) 78%, transparent);
    color: var(--ds-color-fg);
    pointer-events: auto;
  }

  .loading span {
    padding: var(--ds-space-2) var(--ds-space-3);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    box-shadow: var(--ds-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.12));
    font-weight: var(--ds-font-weight-medium);
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
