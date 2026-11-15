import { css } from 'lit';

export const heatmapCalendarStyles = css`
  :host {
    --ds-point-tooltip-max-width: 18rem;
    --heatmap-active-stroke-width: 2px;
    display: block;
    position: relative;
    width: 100%;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-md);
  }

  .frame {
    position: relative;
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    padding: var(--ds-space-2);
    border-radius: var(--ds-radius-xs);
  }

  .loading-frame {
    width: fit-content;
  }

  .scroller {
    width: 100%;
    overflow-x: auto;
    padding-inline-end: calc(var(--heatmap-active-stroke-width) / 2);
    padding-block-end: calc(var(--heatmap-active-stroke-width) / 2);
  }

  .canvas {
    position: relative;
    width: max-content;
    min-width: min(100%, var(--heatmap-viewport-width));
  }

  svg {
    display: block;
    overflow: visible;
  }

  text {
    fill: var(--ds-color-fg-muted);
    font-size: 0.6875rem;
  }

  .cell {
    rx: var(--ds-heatmap-cell-radius, var(--ds-radius-xs));
    stroke: transparent;
    stroke-width: 1;
    outline: none;
  }

  .cell.level-0 {
    stroke: var(--ds-color-border-subtle);
  }

  .cell:is(.active, :focus) {
    stroke: var(--ds-color-accent);
    stroke-width: var(--heatmap-active-stroke-width);
  }

  .point-tooltip {
    text-align: start;
  }

  .tooltip-date {
    font-size: var(--ds-font-size-body-md);
  }

  .tooltip-title {
    margin-top: 2px;
    font-size: var(--ds-font-size-body-lg);
    font-weight: var(--ds-font-weight-medium);
  }

  .tooltip-details {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: start;
    gap: 2px var(--ds-space-3);
    margin: var(--ds-space-2) 0 0;
    font-size: var(--ds-font-size-body-md);
  }

  .tooltip-details dt {
    color: var(--ds-color-fg-muted);
  }

  .tooltip-details dd {
    margin: 0;
    font-variant-numeric: tabular-nums;
  }

  .legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ds-space-1);
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-sm);
  }

  .legend-cell {
    width: 0.75rem;
    height: 0.75rem;
    border: 1px solid transparent;
    border-radius: var(--ds-heatmap-cell-radius, var(--ds-radius-xs));
    background: var(--ds-color-bg-muted);
  }

  .legend-cell.level-0 {
    border-color: var(--ds-color-border-subtle);
  }

  .legend-cell.level-1 {
    background: color-mix(in oklab, var(--heatmap-color) 30%, var(--ds-color-bg-subtle));
  }
  .legend-cell.level-2 {
    background: color-mix(in oklab, var(--heatmap-color) 55%, var(--ds-color-bg-subtle));
  }
  .legend-cell.level-3 {
    background: color-mix(in oklab, var(--heatmap-color) 80%, var(--ds-color-bg-subtle));
  }
  .legend-cell.level-4 {
    background: var(--heatmap-color);
  }
`;
