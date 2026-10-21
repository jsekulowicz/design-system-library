import { css, unsafeCSS } from 'lit';
import { PROGRESS_FILL_LIGHTNESS, PROGRESS_FILL_MAX_CHROMA } from './progress-bar-fill.js';

const fillLightness = unsafeCSS(PROGRESS_FILL_LIGHTNESS);
const fillMaxChroma = unsafeCSS(PROGRESS_FILL_MAX_CHROMA);

export const progressBarStyles = css`
  :host {
    display: block;
  }

  .track [hidden] {
    display: none;
  }

  .track {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    min-height: var(--ds-progress-height, var(--ds-size-xs));
    padding-inline: var(--ds-progress-padding-inline, var(--ds-space-2));
    border-radius: var(--ds-progress-radius, var(--ds-radius-sm));
    overflow: hidden;
    background: var(--ds-progress-empty-color, var(--ds-color-progress-track));
    color: var(--ds-progress-label-color, var(--ds-color-progress-label));
    font-size: var(--ds-progress-font-size, var(--ds-font-size-body-lg));
    font-weight: var(--ds-font-weight-semibold);
    line-height: var(--ds-line-height-tight);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .track::after {
    content: '';
    position: absolute;
    inset: 0;
    border: var(--ds-progress-outline-width, 1px) solid
      var(--ds-progress-outline-color, var(--ds-color-progress-outline));
    border-radius: inherit;
    pointer-events: none;
  }

  .indicator {
    position: absolute;
    z-index: -1;
    inset-block: 0;
    inset-inline-start: 0;
    background: var(--ds-progress-fill-color, var(--ds-progress-color, var(--ds-color-accent)));
    transition: width 240ms ease;
  }

  @supports (color: oklch(from red l c h)) {
    .indicator {
      background: var(
        --ds-progress-fill-color,
        oklch(
          from var(--ds-progress-color, var(--ds-color-accent)) var(--ds-progress-fill-lightness, ${fillLightness})
            min(c, ${fillMaxChroma}) h
        )
      );
    }
  }

  .leading {
    grid-column: 1;
    justify-self: start;
    display: inline-flex;
    align-items: center;
    margin-inline-end: var(--ds-progress-gap, var(--ds-space-2));
  }

  .label {
    grid-column: 2;
    justify-self: center;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([label-align='start']) .track,
  :host([label-align='end']) .track {
    grid-template-columns: auto 1fr;
  }

  :host([label-align='start']) .label {
    justify-self: start;
  }

  :host([label-align='end']) .label {
    justify-self: end;
  }
`;
