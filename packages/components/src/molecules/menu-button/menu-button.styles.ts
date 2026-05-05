import { css } from 'lit';

export const menuButtonStyles = css`
  :host {
    display: inline-block;
    position: relative;
  }
  .control-wrap {
    position: relative;
    display: inline-block;
  }
  .trigger-wrap {
    display: inline-flex;
  }
  .panel {
    position: absolute;
    z-index: 100;
    min-width: max-content;
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
`;
