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
    /* Anchor name is shadow-root scoped, so instances don't clash. */
    anchor-name: --ds-tooltip-anchor;
  }
  :host([full-width]) .anchor {
    display: flex;
    width: 100%;
  }
  .tooltip {
    /* Top layer + anchor positioning: the browser tracks the trigger, no JS. */
    position: fixed;
    position-anchor: --ds-tooltip-anchor;
    position-area: top;
    position-try-fallbacks: flip-block, --ds-tooltip-top-start, --ds-tooltip-top-end;
    margin: var(--ds-space-1);
    inset: auto;
    border: none;
    width: fit-content;
    height: auto;
    overflow: hidden;
    overflow-wrap: anywhere;
    text-align: start;
    white-space: normal;
    z-index: var(--ds-z-index-tooltip);
    background: var(--ds-color-fg);
    color: var(--ds-color-bg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-md);
    line-height: var(--ds-line-height-normal);
    padding: var(--ds-space-1) var(--ds-space-3);
    border-radius: var(--ds-radius-xs);
    max-width: min(var(--ds-tooltip-max-width, 24rem), calc(100% - var(--ds-space-2)));
    pointer-events: none;
  }
  :host([placement='bottom']) .tooltip {
    position-area: bottom;
    position-try-fallbacks: flip-block, --ds-tooltip-bottom-start, --ds-tooltip-bottom-end;
  }
  :host([placement='left']) .tooltip {
    position-area: left;
    justify-self: end;
    position-try-fallbacks: flip-inline;
  }
  :host([placement='right']) .tooltip {
    position-area: right;
    justify-self: start;
    position-try-fallbacks: flip-inline;
  }

  /* Slide toward the available side rather than overflow. */
  @position-try --ds-tooltip-top-start {
    position-area: top span-right;
  }
  @position-try --ds-tooltip-top-end {
    position-area: top span-left;
  }
  @position-try --ds-tooltip-bottom-start {
    position-area: bottom span-right;
  }
  @position-try --ds-tooltip-bottom-end {
    position-area: bottom span-left;
  }
`;
