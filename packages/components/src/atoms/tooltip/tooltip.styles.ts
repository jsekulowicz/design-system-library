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
    /* The popover bubble positions itself against this via CSS anchor
       positioning (scoped to this shadow root, so instances don't clash). */
    anchor-name: --ds-tooltip-anchor;
  }
  :host([full-width]) .anchor {
    display: flex;
    width: 100%;
  }
  .tooltip {
    /* Shown in the Popover API top layer (escapes ancestor overflow) and
       positioned entirely in CSS via anchor positioning — the browser keeps
       it glued to the trigger on scroll, no JS. Default placement: above,
       centered; flips to the opposite side when there's no room, and slides
       to the available side near a left/right edge. */
    position: fixed;
    position-anchor: --ds-tooltip-anchor;
    position-area: top;
    position-try-fallbacks: flip-block, --ds-tooltip-top-start, --ds-tooltip-top-end;
    margin: var(--ds-space-1);
    inset: auto;
    border: none;
    width: max-content;
    height: auto;
    overflow: hidden;
    overflow-wrap: anywhere;
    white-space: normal;
    z-index: var(--ds-z-index-tooltip);
    background: var(--ds-color-fg);
    color: var(--ds-color-bg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-md);
    line-height: 1.4;
    padding: var(--ds-space-1) var(--ds-space-3);
    border-radius: var(--ds-radius-xs);
    max-width: min(16rem, calc(100vw - var(--ds-space-4)));
    pointer-events: none;
  }
  :host([placement='bottom']) .tooltip {
    position-area: bottom;
    position-try-fallbacks: flip-block, --ds-tooltip-bottom-start, --ds-tooltip-bottom-end;
  }
  :host([placement='left']) .tooltip {
    position-area: left;
    position-try-fallbacks: flip-inline;
  }
  :host([placement='right']) .tooltip {
    position-area: right;
    position-try-fallbacks: flip-inline;
  }

  /* Near a left/right edge, keep the side placement but slide the bubble
     toward the available side instead of overflowing. */
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
