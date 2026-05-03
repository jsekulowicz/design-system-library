import { css } from 'lit';

export const toastStackStyles = css`
  :host {
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    pointer-events: none;
    max-width: calc(100vw - var(--ds-space-8, 2rem));
  }
  :host([placement='top-left']),
  :host([placement='top-right']) {
    top: var(--ds-space-4);
  }
  :host([placement='bottom-left']),
  :host([placement='bottom-right']) {
    bottom: var(--ds-space-4);
    flex-direction: column-reverse;
  }
  :host([placement='top-left']),
  :host([placement='bottom-left']) {
    left: var(--ds-space-4);
    align-items: flex-start;
  }
  :host([placement='top-right']),
  :host([placement='bottom-right']) {
    right: var(--ds-space-4);
    align-items: flex-end;
  }
  ::slotted(ds-toast) {
    pointer-events: auto;
  }
`;
