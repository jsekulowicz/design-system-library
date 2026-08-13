import { css } from 'lit';

// The mask must be declared on the scroller, not :host: a custom property resolves its
// inner var()s against the element it is declared on, and the controller sets the
// fade colors on the scroller. Hence the two scroller selectors below.
export const scrollFadeStyles = css`
  ds-card::part(body),
  .scroll,
  .scroll-fade {
    --ds-scroll-fade-mask: linear-gradient(
      to bottom,
      rgb(0 0 0) 0,
      rgb(0 0 0) var(--ds-scroll-fade-offset, 0px),
      var(--ds-scroll-fade-top, rgb(0 0 0)) var(--ds-scroll-fade-offset, 0px),
      rgb(0 0 0) calc(var(--ds-scroll-fade-offset, 0px) + var(--ds-scroll-fade-depth, var(--ds-space-8))),
      rgb(0 0 0) calc(100% - var(--ds-scroll-fade-depth, var(--ds-space-8))),
      var(--ds-scroll-fade-bottom, rgb(0 0 0)) 100%
    );
  }
`;

export const cardBodyScrollFadeStyles = css`
  ds-card::part(body) {
    flex: 1;
    min-height: 0;
    overflow-x: clip;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Padding + negative margin lets focus rings paint outside the clip box. */
    padding-inline: var(--ds-space-2);
    margin-inline: calc(var(--ds-space-2) * -1);
    scrollbar-width: none;
    mask-image: var(--ds-scroll-fade-mask);
  }
  ds-card::part(body)::-webkit-scrollbar {
    display: none;
  }
`;
