import { css } from 'lit';

export const progressBarStyles = css`
  :host {
    --ds-progress-color: var(--ds-color-accent);
    --ds-progress-empty-color: var(--ds-color-bg-muted);
    --ds-progress-track-height: 0.25rem;
    --ds-progress-height: 2rem;
    width: 100%;
  }

  .progress-bar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--ds-progress-height);
  }

  .progress-bar--no-label .track {
    height: var(--ds-progress-height);
  }

  .track {
    position: absolute;
    height: var(--ds-progress-track-height);
    width: 100%;
    bottom: 0;
    border-radius: var(--ds-radius-sm);
    background-color: var(--ds-progress-empty-color);
    overflow: hidden;
  }

  .indicator {
    height: 100%;
    background-color: var(--ds-progress-color);
    transition: width 240ms ease;
  }

  .label {
    color: var(--ds-color-fg);
    font-weight: var(--ds-font-weight-medium);
    white-space: nowrap;
  }
`;
