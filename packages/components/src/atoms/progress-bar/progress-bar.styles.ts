import { css } from 'lit';

export const progressBarStyles = css`
  :host {
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
    border-start-start-radius: var(--ds-radius-sm);
    border-end-start-radius: var(--ds-radius-sm);
    transition: width 240ms ease;
  }
  .indicator--full {
    border-radius: var(--ds-radius-sm);
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
    display: inline-flex;
    align-items: center;
    max-width: calc(100% - var(--ds-space-2));
    padding: 0 var(--ds-space-2);
    border-radius: var(--ds-radius-xs);
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border);
    box-shadow: var(--ds-shadow-sm);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-xs);
    font-weight: var(--ds-font-weight-medium);
    line-height: 1.4;
    white-space: nowrap;
  }
  .label--empty {
    display: none;
  }
`;
