import { css } from 'lit';

export const progressBarStyles = css`
  :host {
    display: block;
    width: 100%;
    /* The bar colour: the track border, the filled indicator and the label
       text all use it, so a single override recolours the whole bar. */
    --ds-progress-color: var(--ds-color-accent);
  }
  .track {
    position: relative;
    width: 100%;
    height: 1.5rem;
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    overflow: hidden;
  }
  /* The border is painted on top of the fill (not on the clipping track) so the
     fill reaches the rounded edge with no seam. A border on the track itself
     would leave a subpixel gap at the corners between it and the fill. */
  .track::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid var(--ds-progress-color);
    border-radius: inherit;
    pointer-events: none;
  }
  /* No radius of its own: the track's overflow clips the leading corners while
     partial (flat trailing edge), and every corner once it fills the track. */
  .indicator {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 0;
    background: var(--ds-progress-color);
    transition: width 240ms ease;
  }
  .label-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  /* No chip, no outline: the text flips colour at the fill boundary so it stays
     legible over both the filled and the empty track. A hard-stop gradient —
     --ds-color-bg up to the fill (--ds-progress-fill, set per value), then
     --ds-progress-color — is painted through the glyphs via background-clip.
     The label spans the whole track so the stop lines up with the indicator.
     Inline icons keep their own colour (they set it explicitly), so give them
     their own contrast (e.g. a badge with its own background). */
  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-1);
    width: 100%;
    color: transparent;
    background: linear-gradient(
      90deg,
      var(--ds-color-bg) 0 var(--ds-progress-fill, 0%),
      var(--ds-progress-color) var(--ds-progress-fill, 0%) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-semibold);
    line-height: 1.4;
    white-space: nowrap;
  }
  .label--empty {
    display: none;
  }
`;
