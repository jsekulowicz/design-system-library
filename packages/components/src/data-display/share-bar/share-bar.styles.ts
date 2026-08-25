import { css } from 'lit';

export const shareBarStyles = css`
  :host {
    --ds-share-bar-height: var(--ds-space-4);
    --ds-share-bar-radius: var(--ds-radius-sm);
    --ds-share-bar-gap: var(--ds-space-2);
    --ds-share-bar-segment-min-width: 2px;

    display: block;
    width: 100%;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
  }

  .share {
    display: flex;
    flex-direction: column;
    gap: var(--ds-share-bar-gap);
  }

  .title {
    margin: 0;
    font-weight: var(--ds-font-weight-semibold);
  }

  .title:empty {
    display: none;
  }

  .bar {
    display: flex;
    overflow: hidden;
    height: var(--ds-share-bar-height);
    border-radius: var(--ds-share-bar-radius);
    background: var(--ds-color-bg-subtle);
  }

  .segment {
    flex-basis: 0;
    min-width: var(--ds-share-bar-segment-min-width);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-1) var(--ds-space-4);
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--ds-font-size-body-md);
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
  }

  .swatch {
    flex: none;
    width: var(--ds-space-2);
    height: var(--ds-space-2);
    border-radius: 2px;
  }

  .percent {
    color: var(--ds-color-fg-muted);
    font-variant-numeric: tabular-nums;
  }

  .empty {
    margin: 0;
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-md);
  }
`;
