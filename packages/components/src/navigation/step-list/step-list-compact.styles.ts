import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const belowTabletBreakpoint = unsafeCSS(`calc(${breakpoint.md} - 0.02px)`);

export const stepListCompactStyles = css`
  .compact {
    display: none;
    flex-direction: column;
  }

  .compact-current {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    min-inline-size: 0;
  }

  .rail {
    display: flex;
    gap: var(--ds-space-1);
  }

  .rail .reason-tooltip {
    flex: 1 1 0;
  }

  .segment {
    flex: 1 1 0;
    display: flex;
    align-items: center;
    block-size: var(--ds-step-list-segment-target, 2.75rem);
  }

  .segment::after {
    content: '';
    inline-size: 100%;
    block-size: var(--ds-space-1);
    border-radius: var(--ds-radius-full);
    background: var(--ds-color-fg-muted);
  }

  .segment:is([data-status='done'], [data-status='current']):not([aria-disabled='true'])::after {
    background: var(--ds-color-accent);
  }

  .segment[aria-disabled='true']::after {
    opacity: 0.6;
  }

  @container (max-width: ${belowTabletBreakpoint}) {
    ol {
      display: none;
    }
    .compact {
      display: flex;
    }
  }

  :host([compact]) ol {
    display: none;
  }

  :host([compact]) .compact {
    display: flex;
  }
`;
