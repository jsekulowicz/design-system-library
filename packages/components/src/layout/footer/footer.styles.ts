import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const mobileBreakpoint = unsafeCSS(breakpoint.sm);

export const footerStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }
  footer {
    /* Full-width chrome: fixed 36px height + border-top span the
       footer's full width regardless of the inner content cap. */
    height: 36px;
    border-top: 1px solid var(--ds-color-border);
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-md);
    box-sizing: border-box;
  }
  .inner {
    /* Inner wrapper holds start / middle / end, optionally capped to
       align with a constrained content column above. 16px symmetric
       inline padding lives here so it scales with the (capped) content
       column, not the full-width chrome. */
    height: 100%;
    width: 100%;
    max-width: var(--ds-footer-content-max-width, none);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: var(--ds-space-4);
    padding-inline: var(--ds-space-4);
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
    .inner {
      gap: var(--ds-space-2);
      font-size: var(--ds-font-size-body-sm);
    }
    .start,
    .middle,
    .end {
      gap: var(--ds-space-2);
    }
  }
`;
