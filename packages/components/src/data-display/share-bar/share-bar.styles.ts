import { css } from 'lit';

export const shareBarStyles = css`
  :host {
    --ds-share-bar-height: var(--ds-space-4);
    --ds-share-bar-radius: var(--ds-radius-xs);
    --ds-share-bar-gap: var(--ds-space-2);
    --ds-share-bar-segment-min-width: 2px;
    --ds-share-bar-icon-size: var(--ds-space-4);
    --ds-share-bar-icon-tile-size: calc(var(--ds-share-bar-icon-size) + 2 * var(--ds-space-1));
    --ds-share-bar-icon-radius: var(--ds-radius-xs);
    --ds-share-bar-icon-color: var(--ds-color-bg);

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

  .track {
    position: relative;
    display: flex;
    align-items: center;
  }

  .track--with-icons {
    min-height: var(--ds-share-bar-icon-tile-size);
  }

  .bar {
    display: flex;
    flex: 1;
    overflow: hidden;
    height: var(--ds-share-bar-height);
    border-radius: var(--ds-share-bar-radius);
    background: var(--ds-color-bg-subtle);
  }

  .segment,
  .icon-slot {
    flex-basis: 0;
    min-width: var(--ds-share-bar-segment-min-width);
  }

  .icons {
    position: absolute;
    inset: 0;
    display: flex;
    pointer-events: none;
  }

  .icon-slot {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .segment-icon {
    display: grid;
    flex: none;
    place-items: center;
    width: var(--ds-share-bar-icon-tile-size);
    height: var(--ds-share-bar-icon-tile-size);
    border-radius: var(--ds-share-bar-icon-radius);
    color: var(--ds-share-bar-icon-color);
  }

  .segment-icon ds-icon {
    width: var(--ds-share-bar-icon-size);
    height: var(--ds-share-bar-icon-size);
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
