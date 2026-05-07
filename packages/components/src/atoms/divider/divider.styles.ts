import { css } from 'lit';

export const dividerStyles = css`
  :host {
    display: block;
    color: var(--ds-color-border);
  }
  :host([orientation='vertical']) {
    display: inline-block;
    height: 1em;
    align-self: stretch;
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
