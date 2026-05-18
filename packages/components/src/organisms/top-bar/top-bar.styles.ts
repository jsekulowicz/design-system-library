import { css } from 'lit';

export const topBarStyles = css`
  :host {
    display: block;
  }
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    /* Fixed 48px height at every viewport; 16px symmetric inline
       padding. Padding is declared via padding-inline only — vertical
       centering is owned by the flexbox + fixed height. */
    height: 48px;
    padding-inline: var(--ds-space-4);
    background: var(--ds-top-bar-bg, var(--ds-color-bg));
    border-bottom: 1px solid var(--ds-color-border);
    font-family: var(--ds-font-body);
    color: var(--ds-color-fg);
    box-sizing: border-box;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    min-width: 0;
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-lg);
    color: var(--ds-color-fg);
  }
  .actions {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
  }
`;
