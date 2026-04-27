import { css } from 'lit';

export const tooltipStyles = css`
  :host {
    display: inline-flex;
    position: relative;
  }
  .anchor {
    position: relative;
    display: inline-flex;
  }
  .tooltip {
    position: fixed;
    top: 0;
    left: 0;
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
    opacity: 0;
    visibility: hidden;
    transition:
      opacity var(--ds-duration-fast) var(--ds-easing-standard),
      visibility 0s linear var(--ds-duration-fast);
  }
  :host([data-visible]) .tooltip {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
  }
`;
