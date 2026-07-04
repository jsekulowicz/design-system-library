import { css } from 'lit';

export const progressBarStyles = css`
  :host {
    display: block;
    width: 100%;
    /* The bar colour: the track border, the filled indicator and the label
       text all use it, so a single override recolours the whole bar. */
    --ds-progress-color: var(--ds-color-accent);
  }
  .track {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 1.5rem;
    border: 1px solid var(--ds-progress-color);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    overflow: hidden;
  }
  .indicator {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 0;
    background: var(--ds-progress-color);
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
  /* Bare text (no chip) in the bar colour, ringed with a --ds-color-bg outline
     so it stays legible over both the filled and the empty track. The outline
     is a filter so it hugs any content — text and inline icons alike. */
  .label {
    display: inline-flex;
    align-items: center;
    max-width: calc(100% - var(--ds-space-2));
    padding: 0 var(--ds-space-1);
    color: var(--ds-progress-color);
    filter:
      drop-shadow(0 0 1px var(--ds-color-bg))
      drop-shadow(0 0 1px var(--ds-color-bg))
      drop-shadow(0 0 1px var(--ds-color-bg));
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-xs);
    font-weight: var(--ds-font-weight-semibold);
    line-height: 1.4;
    white-space: nowrap;
  }
  .label--empty {
    display: none;
  }
`;
