import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const mobileBreakpoint = unsafeCSS(breakpoint.sm);

export const tableResponsiveStyles = css`
  @container (max-width: ${mobileBreakpoint}) {
    :host(:not([responsive='scroll'])) .scroll {
      overflow-x: visible;
      border: 0;
      border-radius: 0;
      background: transparent;
    }

    :host(:not([responsive='scroll'])) table,
    :host(:not([responsive='scroll'])) tbody,
    :host(:not([responsive='scroll'])) tr {
      display: block;
    }

    :host(:not([responsive='scroll'])) table {
      border-collapse: separate;
      border-spacing: 0;
    }

    :host(:not([responsive='scroll'])) .skeleton-table {
      min-width: 0;
    }

    :host(:not([responsive='scroll'])) caption {
      display: block;
      padding-inline: 0;
    }

    :host(:not([responsive='scroll'])) colgroup {
      display: none;
    }

    :host(:not([responsive='scroll'])) thead {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      clip-path: inset(50%);
      border: 0;
      white-space: nowrap;
    }

    :host(:not([responsive='scroll'])) tbody {
      display: grid;
      gap: var(--ds-space-3);
    }

    :host(:not([responsive='scroll'])) tbody tr {
      overflow: hidden;
      border: 1px solid var(--ds-color-border-subtle);
      border-radius: var(--ds-radius-xs);
      background: var(--ds-color-bg);
    }

    :host(:not([responsive='scroll'])) tbody tr.clickable:has(.row-action:focus-visible) {
      box-shadow: var(--ds-shadow-focus);
    }

    :host(:not([responsive='scroll'])) .skeleton-table tbody tr {
      display: grid;
      gap: var(--ds-space-3);
      padding: var(--ds-space-3);
    }

    :host(:not([responsive='scroll'])) tbody td {
      display: grid;
      grid-template-columns: minmax(7rem, 38%) minmax(0, 1fr);
      gap: var(--ds-space-3);
      align-items: start;
      align-content: center;
      min-block-size: var(--ds-space-10);
      min-width: 0;
      overflow-wrap: anywhere;
      text-align: left;
    }

    :host(:not([responsive='scroll'])) .align-right .cell-content,
    :host(:not([responsive='scroll'])) .align-center .cell-content {
      justify-content: flex-start;
    }

    :host(:not([responsive='scroll'])) table:not(.skeleton-table) tbody tr:last-child td {
      border-bottom: 1px solid var(--ds-color-border-subtle);
    }

    :host(:not([responsive='scroll'])) table:not(.skeleton-table) tbody tr td:last-child {
      border-bottom: 0;
    }

    :host(:not([responsive='scroll'])) tbody tr:last-child td:first-child,
    :host(:not([responsive='scroll'])) tbody tr:last-child td:last-child {
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }

    :host(:not([responsive='scroll'])) tbody tr:nth-child(even):not(:hover):not(:has(.row-action:focus-visible)) td {
      background: transparent;
    }

    :host(:not([responsive='scroll'])) th.pinned,
    :host(:not([responsive='scroll'])) td.pinned {
      position: static;
      background: transparent;
    }

    :host(:not([responsive='scroll'])) th.pin-edge,
    :host(:not([responsive='scroll'])) td.pin-edge {
      box-shadow: none;
    }

    :host(:not([responsive='scroll'])) .cell-label {
      display: block;
      color: var(--ds-color-fg-muted);
      font-weight: var(--ds-font-weight-medium);
      min-width: 0;
      overflow-wrap: anywhere;
    }

    :host(:not([responsive='scroll'])) tbody td[data-label=''] {
      display: flex;
      align-items: center;
    }

    :host(:not([responsive='scroll'])) tbody td[data-label=''] .cell-content {
      flex: 1 1 auto;
    }

    :host(:not([responsive='scroll'])) tbody td.empty {
      display: block;
    }

    :host(:not([responsive='scroll'])) tbody td[data-label=''] .cell-label,
    :host(:not([responsive='scroll'])) tbody td.empty .cell-label,
    :host(:not([responsive='scroll'])) .skeleton-table .cell-label {
      display: none;
    }

    :host(:not([responsive='scroll'])) .skeleton-table tbody td {
      padding: 0;
      min-block-size: 0;
      border-bottom: 0;
      background: transparent;
    }

    :host(:not([responsive='scroll'])) .skeleton-label {
      display: block;
    }
  }
`;
