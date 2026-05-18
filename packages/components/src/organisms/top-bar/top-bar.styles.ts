import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const belowDesktopBreakpoint = unsafeCSS(`calc(${breakpoint.lg} - 0.02px)`);

export const topBarStyles = css`
  :host {
    display: block;
  }
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    /* Fixed responsive height; 16px symmetric inline padding. Padding is
       declared via padding-inline so vertical centering is controlled
       solely by the flexbox + fixed height. */
    height: 56px;
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
  @media (max-width: ${belowDesktopBreakpoint}) {
    nav {
      height: 48px;
    }
  }
`;
