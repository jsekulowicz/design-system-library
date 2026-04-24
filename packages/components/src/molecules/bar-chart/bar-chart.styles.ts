import { css } from 'lit';

export const barChartStyles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
  }

  .frame {
    position: relative;
    width: 100%;
    outline: none;
    border-radius: var(--ds-radius-md);
  }

  .frame:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .grid line {
    stroke: var(--ds-color-border-subtle);
    stroke-width: 1;
  }

  .axis line,
  .axis path {
    stroke: var(--ds-color-border);
    stroke-width: 1;
    fill: none;
  }

  .axis text {
    fill: var(--ds-color-fg-muted);
    font-size: 0.75rem;
  }

  .axis-label {
    fill: var(--ds-color-fg-muted);
    font-size: 0.75rem;
    font-weight: var(--ds-font-weight-medium);
  }

  .bar {
    transition: opacity var(--ds-duration-fast) var(--ds-easing-standard);
  }

  .bar-group.inactive .bar {
    opacity: 0.55;
  }

  .focus-ring {
    fill: none;
    stroke: var(--ds-color-accent);
    stroke-width: 2;
    pointer-events: none;
    rx: 4;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-2) var(--ds-space-4);
    margin-top: var(--ds-space-3);
    color: var(--ds-color-fg-muted);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
  }

  .legend-swatch {
    display: inline-block;
    width: 0.75em;
    height: 0.75em;
    border-radius: var(--ds-radius-xs);
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    background: var(--ds-color-bg-inverse);
    color: var(--ds-color-fg-inverse);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-md);
    padding: var(--ds-space-2) var(--ds-space-3);
    font-size: var(--ds-font-size-sm);
    box-shadow: var(--ds-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.18));
    min-width: 120px;
    z-index: 1;
  }

  .tooltip[data-position="above"] {
    transform: translate(-50%, -100%);
    margin-top: -8px;
  }

  .tooltip[data-position="below"] {
    transform: translate(-50%, 0);
    margin-top: 8px;
  }

  .tooltip[hidden] {
    display: none;
  }

  .tooltip-title {
    font-weight: var(--ds-font-weight-medium);
    margin-bottom: var(--ds-space-1);
  }

  .tooltip-rows {
    display: grid;
    grid-template-columns: auto auto;
    gap: 2px var(--ds-space-3);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tooltip-row-label {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
  }

  .tooltip-swatch {
    display: inline-block;
    width: 0.625em;
    height: 0.625em;
    border-radius: 2px;
  }

  .tooltip-row-value {
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
