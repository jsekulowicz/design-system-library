import { css } from 'lit';

// Shared scroll-driven fade. Registers the fade-colour custom properties and a
// keyframe that flips them while scrolling. The resting 0% keyframe paints NO
// fade: a scroll-progress timeline on a NON-scrollable container is meant to be
// inactive (so the fade stays hidden), but some engines instead clamp it to 0%
// — leaving a phantom bottom fade on content that doesn't actually scroll. By
// making 0% the no-fade state, a panel that fits its content never fades on any
// engine. The 100% (scrolled-to-bottom) keyframe still shows the top fade since
// that position is only reachable when the content really is scrollable. Add
// `scrollFadeStyles` to a component's styles, then on the scroll container:
//   scrollbar-width: none;
//   mask-image: linear-gradient(to bottom,
//     var(--ds-scroll-fade-top, rgb(0 0 0)) ...,
//     var(--ds-scroll-fade-bottom, rgb(0 0 0)) ...);
//   animation: ds-scroll-fade linear;
//   animation-timeline: scroll(self);
// and hide the WebKit scrollbar with `::-webkit-scrollbar { display: none }`.
// Used by ds-dialog, ds-drawer and ds-table (`scroll-body`).
export const scrollFadeStyles = css`
  /* @property registration so the scroll-driven keyframe can interpolate the
     fades as colours. Near-instant flips keep the transitions binary. */
  @property --ds-scroll-fade-top {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(0 0 0);
  }
  @property --ds-scroll-fade-bottom {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(0 0 0);
  }
  @keyframes ds-scroll-fade {
    0% {
      --ds-scroll-fade-top: rgb(0 0 0);
      --ds-scroll-fade-bottom: rgb(0 0 0);
    }
    0.001%, 99.999% {
      --ds-scroll-fade-top: rgb(0 0 0 / 0);
      --ds-scroll-fade-bottom: rgb(0 0 0 / 0);
    }
    100% {
      --ds-scroll-fade-top: rgb(0 0 0 / 0);
      --ds-scroll-fade-bottom: rgb(0 0 0);
    }
  }
`;
