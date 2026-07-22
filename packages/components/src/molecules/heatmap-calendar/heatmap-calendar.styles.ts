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
    border-radius: var(--ds-radius-md);
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

  .tooltip {
    position: absolute;
    display: grid;
    gap: 2px;
    pointer-events: none;
    left: clamp(
      calc(4rem + var(--ds-space-2)),
      calc(var(--heatmap-tooltip-x) - var(--heatmap-scroll-left) + var(--ds-space-2)),
      calc(100% - 4rem - var(--ds-space-2))
    );
    top: calc(var(--heatmap-tooltip-y) + var(--ds-space-2));
    min-width: 8rem;
    padding: var(--ds-space-2) var(--ds-space-3);
    background: var(--ds-color-bg-inverse);
    color: var(--ds-color-fg-inverse);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-md);
    box-shadow: var(--ds-shadow-md, 0 4px 12px rgb(0 0 0 / 18%));
    text-align: center;
    z-index: var(--ds-z-index-raised);
  }

  .tooltip[data-position='above'] {
    transform: translate(-50%, calc(-100% - 6px));
  }

  .tooltip[data-position='below'] {
    transform: translate(-50%, 6px);
  }

  .tooltip[hidden] {
    display: none;
  }

  .tooltip span {
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
