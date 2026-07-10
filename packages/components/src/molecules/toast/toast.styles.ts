import { css } from 'lit';

export const toastStyles = css`
  :host {
    display: block;
    pointer-events: auto;
    min-width: 280px;
    max-width: 420px;
  }
  :host(:focus) {
    outline: none;
  }
  .notice {
    flex-direction: column;
    align-items: stretch;
    gap: var(--ds-space-2);
    background: var(--ds-color-bg);
    box-shadow: var(--ds-shadow-md);
  }
  :host(:focus-visible) .notice {
    box-shadow: var(--ds-shadow-md), var(--ds-shadow-focus);
  }
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-3);
  }
  /* Pull the close button into the top-right corner past the notice padding,
     and keep it there even when no title precedes it. */
  .close-btn {
    margin-block-start: calc(var(--ds-space-2) * -1);
    margin-inline-end: calc(var(--ds-space-2) * -1);
    margin-inline-start: auto;
  }
  .body {
    min-width: 0;
  }
  ::slotted([slot='actions']) {
    margin-top: var(--ds-space-2);
    display: flex;
    gap: var(--ds-space-2);
    justify-content: flex-end;
  }
`;
