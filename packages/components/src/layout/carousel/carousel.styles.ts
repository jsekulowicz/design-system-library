import { css } from 'lit';

export const carouselStyles = css`
  :host {
    display: block;
    min-width: 0;
  }
  .carousel {
    position: relative;
  }
  .track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--ds-carousel-item-width, 16rem);
    gap: var(--ds-carousel-gap, var(--ds-space-4));
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding-block: var(--ds-space-1);
  }
  .track::-webkit-scrollbar {
    display: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    .track {
      scroll-behavior: smooth;
    }
  }
  ::slotted(*) {
    scroll-snap-align: start;
    min-width: 0;
  }
  .scroll-button {
    position: absolute;
    inset-block-start: 50%;
    translate: 0 -50%;
    z-index: var(--ds-z-index-raised);
    border-radius: var(--ds-radius-full);
    box-shadow: var(--ds-shadow-sm);
  }
  .scroll-button::part(button) {
    border-color: var(--ds-color-border);
    border-radius: inherit;
    background: var(--ds-color-bg);
  }
  .scroll-button:hover::part(button) {
    background: var(--ds-color-bg-subtle);
  }
  .scroll-button--prev {
    inset-inline-start: var(--ds-space-2);
  }
  .scroll-button--next {
    inset-inline-end: var(--ds-space-2);
  }
  .scroll-button ds-icon:dir(rtl) {
    scale: -1 1;
  }
`;
