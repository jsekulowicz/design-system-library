import { css } from 'lit';

export const pieChartStyles = css`
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
    width: 100%;
  }

  .canvas {
    position: relative;
    width: min(100%, var(--pie-size));
    aspect-ratio: 1;
    margin-inline: auto;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .slice {
    outline: none;
    transition: opacity var(--ds-duration-fast) var(--ds-easing-standard);
  }

  .slice.inactive {
    opacity: 0.55;
  }

  .slice-shape {
    stroke: var(--ds-color-bg);
    stroke-width: 1;
    stroke-linejoin: round;
  }

  .slice-label {
    fill: var(--ds-color-fg);
    font-size: 4.5px;
    font-weight: var(--ds-font-weight-medium);
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }

  .leader-line {
    stroke: var(--ds-color-border);
    stroke-width: 0.5;
  }

  .focus-ring {
    fill: none;
    stroke: var(--ds-color-accent);
    stroke-width: 2;
    pointer-events: none;
  }

  .center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-1);
    pointer-events: none;
    text-align: center;
  }

  .center-value {
    font-size: var(--ds-font-size-heading-sm);
    font-weight: var(--ds-font-weight-bold);
    font-variant-numeric: tabular-nums;
  }

  .center-label {
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-sm);
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--ds-color-fg-muted);
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

  .legend-value {
    font-variant-numeric: tabular-nums;
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    background: var(--ds-color-bg-inverse);
    color: var(--ds-color-fg-inverse);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-md);
    padding: var(--ds-space-2) var(--ds-space-3);
    font-size: var(--ds-font-size-body-md);
    box-shadow: var(--ds-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.18));
    width: max-content;
    max-width: min(220px, 100%);
    box-sizing: border-box;
    z-index: var(--ds-z-index-raised);
  }

  .tooltip[hidden] {
    display: none;
  }

  .tooltip-title {
    font-weight: var(--ds-font-weight-medium);
    margin-bottom: var(--ds-space-1);
  }

  .tooltip-row-value {
    font-variant-numeric: tabular-nums;
  }

  @media (forced-colors: active) {
    .slice-shape {
      stroke: CanvasText;
      stroke-width: 1.5;
    }

    .focus-ring {
      stroke: Highlight;
    }

    .slice-label {
      fill: CanvasText;
    }
  }
`;
