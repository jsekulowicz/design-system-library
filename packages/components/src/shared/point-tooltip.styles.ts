import { css } from 'lit';

export const pointTooltipStyles = css`
  .point-anchor {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    anchor-name: --ds-point-tooltip-anchor;
  }

  .point-tooltip {
    position: fixed;
    position-anchor: --ds-point-tooltip-anchor;
    position-area: var(--ds-point-tooltip-area, top);
    position-try-fallbacks:
      flip-block,
      flip-inline,
      flip-block flip-inline;
    inset: auto;
    margin: var(--ds-space-2);
    box-sizing: border-box;
    width: max-content;
    min-width: var(--ds-point-tooltip-min-width, 8rem);
    max-width: min(var(--ds-point-tooltip-max-width, 14rem), calc(100vw - var(--ds-space-4)));
    padding: var(--ds-space-2) var(--ds-space-3);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-xs);
    background: var(--ds-color-bg-inverse);
    color: var(--ds-color-fg-inverse);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-md);
    line-height: var(--ds-line-height-tight);
    box-shadow: var(--ds-shadow-md, 0 4px 12px rgb(0 0 0 / 18%));
    pointer-events: none;
  }

  .point-tooltip:not([data-open]) {
    display: none;
  }
`;
