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
    /* 1fr columns on a shrink-to-fit track all resolve to the widest label. */
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    /* The track colour showing through is the hairline frame and dividers. */
    gap: 1px;
    padding: 1px;
    background: var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-xs);
    max-width: 100%;
  }
  .segment {
    min-width: 0;
  }
  /* Lift above neighbours so the focus ring isn't painted over. */
  .segment:focus-within {
    position: relative;
    z-index: var(--ds-z-index-raised);
  }
  /* Drop the button min-width floor so the grid drives sizing. */
  .segment::part(button) {
    min-width: 0;
    border-radius: calc(var(--ds-radius-xs) - 1px);
  }
  .segment[variant='ghost']::part(button) {
    background: var(--ds-color-bg);
  }
  .segment[variant='ghost']::part(button):hover {
    background: var(--ds-color-bg-subtle);
  }
  /* Only the outer corners round, so the row reads as one control. */
  .segment:first-child:not(:last-child)::part(button) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .segment:last-child:not(:first-child)::part(button) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .segment:not(:first-child):not(:last-child)::part(button) {
    border-radius: 0;
  }
`;
