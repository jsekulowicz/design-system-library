import { css } from 'lit';

export const listStyles = css`
  :host {
    display: block;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  :host([variant='bordered']) ul {
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-md);
    background: var(--ds-color-bg);
  }
  :host([variant='bordered']) ::slotted(ds-list-item:not(:last-of-type)) {
    border-bottom: 1px solid var(--ds-color-border-subtle);
  }
`;
