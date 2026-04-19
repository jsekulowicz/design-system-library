import { css } from 'lit';

export const tabPanelStyles = css`
  :host {
    display: block;
    outline: none;
  }
  :host(:focus-visible) {
    border-radius: var(--ds-radius-sm);
    box-shadow: var(--ds-shadow-focus);
  }
  :host([hidden]) {
    display: none;
  }
`;
