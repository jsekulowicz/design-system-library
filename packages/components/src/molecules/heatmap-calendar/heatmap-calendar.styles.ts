import { css } from 'lit';

export const heatmapCalendarStyles = css`
  :host {
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
    outline: none;
    border-radius: var(--ds-radius-xs);
  }

  .frame:focus-visible {
    box-shadow: var(--ds-shadow-focus);
  }

  .loading-frame {
    width: fit-content;
  }

  .scroller {
    width: 100%;
    overflow-x: auto;
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
    rx: var(--ds-radius-xs);
    stroke: transparent;
    stroke-width: 1;
  }

  .cell.level-0 {
    stroke: var(--ds-color-border-subtle);
  }

  .cell.active {
    stroke: var(--ds-color-accent);
    stroke-width: 2;
  }

  .tooltip-title {
    font-weight: var(--ds-font-weight-medium);
  }

  .tooltip-date {
    color: inherit;
    font-size: var(--ds-font-size-body-sm);
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
    border-radius: var(--ds-radius-xs);
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
