import { css } from 'lit';

export const toastStyles = css`
  :host {
    display: block;
    pointer-events: auto;
    min-width: 280px;
    max-width: 420px;
  }
  .notice {
    background: var(--ds-color-bg);
    box-shadow: var(--ds-shadow-md);
  }
  .content {
    min-width: 0;
  }
  ::slotted([slot='actions']) {
    margin-top: var(--ds-space-2);
    display: flex;
    gap: var(--ds-space-2);
  }
`;
