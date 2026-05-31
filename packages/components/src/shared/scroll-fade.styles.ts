import { css } from 'lit';

// Shared scroll fade. The fade colours (`--ds-scroll-fade-top` /
// `--ds-scroll-fade-bottom`) are set per scroll position by
// `ScrollFadeController` (see scroll-fade-controller). The gradient itself is
// exposed as `--ds-scroll-fade-mask` so any scroll container can apply it with
//   mask-image: var(--ds-scroll-fade-mask);
// `--ds-scroll-fade-depth` tunes how deep each edge fades, and
// `--ds-scroll-fade-offset` shifts the top fade down past a sticky header
// (0 for ds-dialog / ds-drawer; the header height for ds-table `scroll-body`).
export const scrollFadeStyles = css`
  :host {
    --ds-scroll-fade-depth: var(--ds-space-8);
    --ds-scroll-fade-offset: 0px;
    --ds-scroll-fade-mask: linear-gradient(
      to bottom,
      rgb(0 0 0) 0,
      rgb(0 0 0) var(--ds-scroll-fade-offset),
      var(--ds-scroll-fade-top, rgb(0 0 0)) var(--ds-scroll-fade-offset),
      rgb(0 0 0) calc(var(--ds-scroll-fade-offset) + var(--ds-scroll-fade-depth)),
      rgb(0 0 0) calc(100% - var(--ds-scroll-fade-depth)),
      var(--ds-scroll-fade-bottom, rgb(0 0 0)) 100%
    );
  }
`;

// The scrolling body shared by the ds-card-based panels (ds-dialog, ds-drawer):
// identical flex / overflow / inline padding plus the masked scroll fade.
export const cardBodyScrollFadeStyles = css`
  ds-card::part(body) {
    flex: 1;
    min-height: 0;
    overflow-x: clip;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Inline padding + negative margin lets focus rings on full-width
       children paint outside the body's clip box. */
    padding-inline: var(--ds-space-2);
    margin-inline: calc(var(--ds-space-2) * -1);
    scrollbar-width: none;
    mask-image: var(--ds-scroll-fade-mask);
  }
  ds-card::part(body)::-webkit-scrollbar {
    display: none;
  }
`;
