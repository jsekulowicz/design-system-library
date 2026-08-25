import { css } from 'lit';

export const tabPanelStyles = css`
  :host {
    display: block;
  }
  :host(:focus-visible) {
    border-radius: var(--ds-radius-xs);
    box-shadow: var(--ds-shadow-focus);
  }
`;
