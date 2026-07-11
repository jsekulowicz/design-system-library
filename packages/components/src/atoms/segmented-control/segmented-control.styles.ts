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
    /* The track colour shows through the 1px padding and gaps as a hairline
       frame and dividers between the otherwise borderless segments. */
    gap: 1px;
    padding: 1px;
    background: var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-sm);
    max-width: 100%;
  }
  .segment {
    min-width: 0;
  }
  /* Lift the focused segment above its neighbours so the full focus ring is
     visible instead of being painted over by the adjacent segment. */
  .segment:focus-within {
    position: relative;
    z-index: var(--ds-z-index-raised);
  }
  /* Give unselected segments a surface that's distinct from the track so each
     option reads as its own tile; the selected one keeps the accent fill from
     the primary button variant. Drop the button min-width floor so the grid
     drives sizing. */
  .segment::part(button) {
    min-width: 0;
    border-radius: calc(var(--ds-radius-sm) - 1px);
  }
  .segment[variant='ghost']::part(button) {
    background: var(--ds-color-bg);
  }
  .segment[variant='ghost']::part(button):hover {
    background: var(--ds-color-bg-subtle);
  }
  /* Square off the inner edges so the row reads as one connected control,
     rounding only the outer corners of the first and last segments. */
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
