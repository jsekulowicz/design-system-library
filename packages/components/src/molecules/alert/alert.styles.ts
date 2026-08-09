import { css } from 'lit';

export const alertStyles = css`
  :host {
    display: block;
  }
  .notice {
    background: var(--ds-color-bg-subtle);
  }
  .icon {
    flex-shrink: 0;
    width: 1.1rem;
    height: 1.1rem;
    margin-top: 0.1rem;
  }
  /* Past the notice padding, into the corner — matches ds-toast. */
  .close-btn {
    margin-block-start: calc(var(--ds-space-2) * -1);
    margin-inline-end: calc(var(--ds-space-2) * -1);
    margin-inline-start: auto;
  }
`;
