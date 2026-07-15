import { css } from 'lit';

export const statTileStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  .tile {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    min-height: 7.25rem;
    box-sizing: border-box;
    padding: var(--ds-space-4);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-md);
  }

  .value {
    min-height: 2.125rem;
    font-size: var(--ds-font-size-heading-lg);
    font-weight: var(--ds-font-weight-bold);
    font-variant-numeric: tabular-nums;
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
    padding-block: 0.5rem;
  }

  [hidden] {
    display: none;
  }
`;
