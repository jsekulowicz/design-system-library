import { css } from 'lit';

export const tooltipStyles = css`
  :host {
    display: inline-flex;
    position: relative;
  }
  :host([full-width]) {
    display: flex;
    width: 100%;
  }
  .anchor {
    position: relative;
    display: inline-flex;
  }
  :host([full-width]) .anchor {
    display: flex;
    width: 100%;
  }
  .tooltip {
    /* Override UA popover defaults so JS-set top/left/transform stay authoritative. */
    position: fixed;
    inset: auto;
    margin: 0;
    border: none;
    width: max-content;
    height: auto;
    overflow: visible;
    z-index: var(--ds-z-index-tooltip, 999);
    background: var(--ds-color-fg);
    color: var(--ds-color-bg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-xs);
    line-height: 1.4;
    padding: var(--ds-space-1) var(--ds-space-3);
    border-radius: var(--ds-radius-xs);
    max-width: 16rem;
    pointer-events: none;
  }
`;
