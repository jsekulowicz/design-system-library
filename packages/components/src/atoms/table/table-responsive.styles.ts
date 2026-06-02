import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const mobileBreakpoint = unsafeCSS(breakpoint.sm);

export const tableResponsiveStyles = css`
  @container (max-width: ${mobileBreakpoint}) {
    :host(:not([responsive="scroll"])) .scroll {
      overflow-x: visible;
      border: 0;
      border-radius: 0;
      background: transparent;
    }

    :host(:not([responsive="scroll"])) table,
    :host(:not([responsive="scroll"])) tbody,
    :host(:not([responsive="scroll"])) tr {
      display: block;
    }

    :host(:not([responsive="scroll"])) table {
      border-collapse: separate;
      border-spacing: 0;
    }

    :host(:not([responsive="scroll"])) .skeleton-table {
      min-width: 0;
    }

    :host(:not([responsive="scroll"])) caption {
      display: block;
      padding-inline: 0;
    }

    :host(:not([responsive="scroll"])) colgroup {
      display: none;
    }

    :host(:not([responsive="scroll"])) thead {
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

    :host(:not([responsive="scroll"])) tbody {
      display: grid;
      gap: var(--ds-space-3);
    }

    :host(:not([responsive="scroll"])) tbody tr {
      overflow: hidden;
      border: 1px solid var(--ds-color-border-subtle);
      border-radius: var(--ds-radius-md);
      background: var(--ds-color-bg);
    }

    :host(:not([responsive="scroll"])) tbody tr.clickable:has(.row-action:focus-visible) {
      box-shadow: var(--ds-shadow-focus);
    }

    :host(:not([responsive="scroll"])) .skeleton-table tbody tr {
      display: grid;
      gap: var(--ds-space-3);
      padding: var(--ds-space-3);
    }

    :host(:not([responsive="scroll"])) tbody td {
      display: grid;
      grid-template-columns: minmax(7rem, 38%) minmax(0, 1fr);
      gap: var(--ds-space-3);
      align-items: start;
      min-width: 0;
      overflow-wrap: anywhere;
      text-align: left;
    }

    :host(:not([responsive="scroll"])) .cell-label {
      display: block;
      color: var(--ds-color-fg-muted);
      font-weight: var(--ds-font-weight-medium);
      min-width: 0;
      overflow-wrap: anywhere;
    }

    :host(:not([responsive="scroll"])) tbody td[data-label=""],
    :host(:not([responsive="scroll"])) tbody td.empty {
      display: block;
    }

    :host(:not([responsive="scroll"])) tbody td[data-label=""] .cell-label,
    :host(:not([responsive="scroll"])) tbody td.empty .cell-label,
    :host(:not([responsive="scroll"])) .skeleton-table .cell-label {
      display: none;
    }

    :host(:not([responsive="scroll"])) .skeleton-table tbody td {
      padding: 0;
      border-bottom: 0;
      background: transparent;
    }

    :host(:not([responsive="scroll"])) .skeleton-label {
      display: block;
    }
  }
`;
