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
`;
