import { css } from 'lit';

export const topBarStyles = css`
  :host {
    display: block;
  }
  nav {
    /* Full-width chrome: background, border-bottom, and the fixed
       responsive height live on the nav itself so they always span
       the parent's full width regardless of the inner content cap. */
    height: 48px;
    background: var(--ds-top-bar-bg, var(--ds-color-bg));
    border-bottom: 1px solid var(--ds-color-border);
    font-family: var(--ds-font-body);
    color: var(--ds-color-fg);
    box-sizing: border-box;
  }
  .inner {
    /* Inner wrapper holds brand + actions, optionally capped to align
       with a constrained content column below the bar. 16px symmetric
       inline padding lives here so it scales with the (capped) content
       column, not the full-width chrome. */
    height: 100%;
    width: 100%;
    max-width: var(--ds-top-bar-content-max-width, none);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    padding-inline: var(--ds-space-4);
    box-sizing: border-box;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    min-width: 0;
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-heading-sm);
    color: var(--ds-color-fg);
  }
  .actions {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
  }
`;
