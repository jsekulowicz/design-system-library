import { css } from 'lit';

export const dividerStyles = css`
  :host {
    display: block;
    color: var(--ds-color-border);
    margin-block: var(--ds-space-3);
  }
  :host([orientation='vertical']) {
    display: inline-block;
    height: 1em;
    align-self: stretch;
    margin-block: 0;
    margin-inline: var(--ds-space-3);
  }
  [part='line'] {
    display: block;
    background: currentColor;
    width: 100%;
    height: 1px;
  }
  :host([orientation='vertical']) [part='line'] {
    width: 1px;
    height: 100%;
  }
`;
