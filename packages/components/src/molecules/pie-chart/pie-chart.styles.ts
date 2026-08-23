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
    left: 50%;
    top: 50%;
    width: var(--pie-center-size, 0%);
    height: var(--pie-center-size, 0%);
    container-type: inline-size;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-1);
    pointer-events: none;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
  }

  .center-value {
    --ds-pie-center-value-widest-em: 4.25;
    font-size: min(var(--ds-font-size-heading-sm), calc(100cqi / var(--ds-pie-center-value-widest-em)));
    font-weight: var(--ds-font-weight-bold);
    font-variant-numeric: tabular-nums;
    line-height: var(--ds-line-height-none);
    max-width: 100%;
    white-space: nowrap;
  }

  .center-label {
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-sm);
    line-height: var(--ds-line-height-tight);
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .center ::slotted(*) {
    max-width: 100%;
    max-height: 100%;
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

  .tooltip-anchor {
    position: absolute;
    width: 0;
    height: 0;
    anchor-name: --ds-pie-tooltip-anchor;
  }

  .tooltip {
    position: fixed;
    position-anchor: --ds-pie-tooltip-anchor;
    position-try-fallbacks:
      flip-inline,
      flip-block,
      flip-inline flip-block;
    inset: auto;
    margin: var(--ds-space-1);
    pointer-events: none;
    background: var(--ds-color-bg-inverse);
    color: var(--ds-color-fg-inverse);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-xs);
    padding: var(--ds-space-2) var(--ds-space-3);
    font-size: var(--ds-font-size-body-md);
    box-shadow: var(--ds-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.18));
    width: max-content;
    max-width: min(220px, calc(100vw - var(--ds-space-4)));
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
