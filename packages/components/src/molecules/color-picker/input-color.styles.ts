import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const belowMobileBreakpoint = unsafeCSS(`calc(${breakpoint.sm} - 0.02px)`);

export const inputColorStyles = css`
  :host {
    display: inline-flex;
    width: var(--color-picker-input-size, var(--ds-size-sm));
    height: var(--color-picker-input-size, var(--ds-size-sm));
  }

  input {
    width: 100%;
    height: 100%;
    padding: 1px;
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    cursor: pointer;
  }

  input:focus-visible {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }

  :host([disabled]) input {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: ${belowMobileBreakpoint}) {
    :host {
      width: 100%;
    }
  }
`;
