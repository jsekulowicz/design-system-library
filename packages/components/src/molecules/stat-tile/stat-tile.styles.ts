import { css } from 'lit';

export const statTileStyles = css`
  :host {
    display: flex;
    min-width: 0;
  }

  .tile {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    box-sizing: border-box;
    padding: var(--ds-space-4);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-md);
  }

  .value {
    display: flex;
    align-items: center;
    min-height: calc(var(--ds-font-size-heading-lg) * var(--ds-line-height-snug));
    font-size: var(--ds-font-size-heading-lg);
    font-weight: var(--ds-font-weight-bold);
    font-variant-numeric: tabular-nums;
    line-height: var(--ds-line-height-snug);
  }

  .label {
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-md);
  }

  .hint {
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-sm);
  }

  .value ds-skeleton {
    width: 4rem;
  }

  [hidden] {
    display: none;
  }
`;
