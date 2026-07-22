import { css } from 'lit';

export const loadingOverlayStyles = css`
  .loading-overlay {
    position: absolute;
    inset: 0;
    z-index: var(--ds-z-index-raised);
    display: grid;
    place-items: center;
    min-height: 100%;
    background: color-mix(in srgb, var(--ds-color-bg) 78%, transparent);
    color: var(--ds-color-fg);
    pointer-events: auto;
  }

  .loading-overlay-label {
    padding: var(--ds-space-2) var(--ds-space-3);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    box-shadow: var(--ds-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.12));
    font-weight: var(--ds-font-weight-medium);
  }
`;
