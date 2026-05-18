import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const mobileBreakpoint = unsafeCSS(breakpoint.sm);

export const footerStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: var(--ds-space-4);
    /* Fixed 36px height; symmetric 16px inline padding. Padding is
       declared via padding-inline only — vertical centering is owned by
       the flexbox + fixed height. */
    height: 36px;
    padding-inline: var(--ds-space-4);
    border-top: 1px solid var(--ds-color-border);
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    box-sizing: border-box;
  }
  .start,
  .middle,
  .end {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    min-width: 0;
  }
  .end {
    justify-content: flex-end;
  }
  @container (max-width: ${mobileBreakpoint}) {
    footer {
      gap: var(--ds-space-2);
      font-size: var(--ds-font-size-xs);
    }
    .start,
    .middle,
    .end {
      gap: var(--ds-space-2);
    }
  }
`;
