import { css } from 'lit';

export const segmentedControlStyles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    max-width: 100%;
  }
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .group {
    /* Equal columns that all size to the widest segment: with a shrink-to-fit
       track, equal 1fr columns each resolve to the widest cell's content, so
       no segment ends up narrower than its label needs. When the host is given
       an explicit width they simply share it evenly. */
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: var(--ds-space-1);
    padding: var(--ds-space-1);
    background: var(--ds-color-bg-subtle);
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-sm);
    max-width: 100%;
  }
  .segment {
    min-width: 0;
  }
  /* Drop the button min-width floor so the grid, not the button, drives sizing. */
  .segment::part(button) {
    min-width: 0;
  }
`;
