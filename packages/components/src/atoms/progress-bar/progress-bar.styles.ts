import { css } from 'lit';

export const progressBarStyles = css`
  :host {
    --ds-progress-bar-label-vertical-margin: 3px;
    display: block;
    width: 100%;
  }
  .track {
    position: relative;
    width: 100%;
    height: 1.5rem;
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg-subtle);
    overflow: hidden;
  }
  .indicator {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 0;
    background: var(--ds-color-success);
    transition: width 240ms ease;
  }
  .label-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - var(--ds-progress-bar-label-vertical-margin) * 2);
    max-width: calc(100% - (var(--ds-space-2)));
    padding: 0 var(--ds-space-2);
    color: var(--ds-color-fg);
    background-color: var(--ds-color-bg-subtle);
    border-radius: var(--ds-radius-xs);
    white-space: nowrap;
    font-weight: var(--ds-font-weight-medium);
    opacity: 0.90;
  }
  .label--empty {
    display: none;
  }
`;
