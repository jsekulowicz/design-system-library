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
    display: flex;
    align-items: stretch;
    gap: var(--ds-space-1);
    padding: var(--ds-space-1);
    background: var(--ds-color-bg-subtle);
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-sm);
    max-width: 100%;
  }
  .segment {
    flex: 1 1 auto;
    min-width: 0;
  }
  /* Drop the button min-width floor so segments share the track evenly and
     can shrink without overflowing on narrow containers. */
  .segment::part(button) {
    min-width: 0;
  }
`;
