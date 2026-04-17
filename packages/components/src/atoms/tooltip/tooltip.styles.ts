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
    position: absolute;
    z-index: var(--ds-z-index-tooltip, 999);
    background: var(--ds-color-fg);
    color: var(--ds-color-bg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-xs);
    line-height: 1.4;
    padding: var(--ds-space-1) var(--ds-space-3);
    border-radius: var(--ds-radius-xs);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--ds-duration-fast) var(--ds-easing-standard),
      visibility 0s linear var(--ds-duration-fast);
  }
  :host(:hover) .tooltip,
  :host(:focus-within) .tooltip,
  :host([open]) .tooltip {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
  }
  :host(:not([placement])) .tooltip,
  :host([placement='top']) .tooltip {
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
  }
  :host([placement='bottom']) .tooltip {
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
  }
  :host([placement='left']) .tooltip {
    right: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
  }
  :host([placement='right']) .tooltip {
    left: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
  }
`;
