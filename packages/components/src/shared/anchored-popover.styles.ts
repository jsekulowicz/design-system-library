import { css } from 'lit';

export const anchoredPopoverStyles = css`
  :host {
    display: inline-block;
    position: relative;
  }
  .control-wrap {
    position: relative;
    display: inline-block;
  }
  .trigger-wrap {
    anchor-name: --ds-popover-trigger;
    display: inline-flex;
  }
  .panel {
    position: absolute;
    z-index: var(--ds-z-index-dropdown);
    min-width: max-content;
    margin: 0;
    border: 0;
    padding: 0;
    background: transparent;
    overflow: visible;
  }
  :host([placement='bottom-start']) .panel {
    inset-inline-start: 0;
    inset-block-start: 100%;
    margin-block-start: var(--ds-space-1);
  }
  :host([placement='bottom-end']) .panel {
    inset-inline-end: 0;
    inset-block-start: 100%;
    margin-block-start: var(--ds-space-1);
  }
  :host([placement='top-start']) .panel {
    inset-inline-start: 0;
    inset-block-end: 100%;
    margin-block-end: var(--ds-space-1);
  }
  :host([placement='top-end']) .panel {
    inset-inline-end: 0;
    inset-block-end: 100%;
    margin-block-end: var(--ds-space-1);
  }
  .panel[popover]:popover-open {
    position: fixed;
    position-anchor: --ds-popover-trigger;
    inset: auto;
    position-try-fallbacks: flip-block, flip-inline;
  }
  :host([placement='bottom-start']) .panel[popover]:popover-open {
    top: calc(anchor(bottom) + var(--ds-space-1));
    left: anchor(left);
  }
  :host([placement='bottom-end']) .panel[popover]:popover-open {
    top: calc(anchor(bottom) + var(--ds-space-1));
    right: anchor(right);
  }
  :host([placement='top-start']) .panel[popover]:popover-open {
    bottom: calc(anchor(top) + var(--ds-space-1));
    left: anchor(left);
  }
  :host([placement='top-end']) .panel[popover]:popover-open {
    bottom: calc(anchor(top) + var(--ds-space-1));
    right: anchor(right);
  }
`;
