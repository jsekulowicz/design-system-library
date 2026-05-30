import { css } from 'lit';

// Shared scroll-driven fade. Registers the fade-colour custom properties and a
// keyframe that flips them at the scroll extremes — top fade hidden at
// scroll-top, bottom fade hidden at scroll-end, both visible in between. Add
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
      --ds-scroll-fade-bottom: rgb(0 0 0 / 0);
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
