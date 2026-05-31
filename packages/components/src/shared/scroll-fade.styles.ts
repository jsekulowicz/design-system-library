import { css } from 'lit';

// Shared scroll fade. The fade colours (`--ds-scroll-fade-top` /
// `--ds-scroll-fade-bottom`) are set per scroll position by
// `ScrollFadeController`. The gradient is exposed as `--ds-scroll-fade-mask`
// so any scroll container can apply it with `mask-image: var(--ds-scroll-fade-mask)`.
//
// IMPORTANT: the gradient must be DECLARED on the scroll container itself, not
// on :host — a custom property resolves its inner var()s against the element it
// is declared on, and the controller sets the fade colours on the scroller. So
// this rule targets the two scroller selectors directly (a component only
// matches its own one). `--ds-scroll-fade-depth` tunes the fade size and
// `--ds-scroll-fade-offset` shifts the top fade past a sticky header; both
// inherit, so a host can override them.
export const scrollFadeStyles = css`
  ds-card::part(body),
  .scroll {
    --ds-scroll-fade-mask: linear-gradient(
      to bottom,
      rgb(0 0 0) 0,
      rgb(0 0 0) var(--ds-scroll-fade-offset, 0px),
      var(--ds-scroll-fade-top, rgb(0 0 0)) var(--ds-scroll-fade-offset, 0px),
      rgb(0 0 0)
        calc(var(--ds-scroll-fade-offset, 0px) + var(--ds-scroll-fade-depth, var(--ds-space-8))),
      rgb(0 0 0) calc(100% - var(--ds-scroll-fade-depth, var(--ds-space-8))),
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
