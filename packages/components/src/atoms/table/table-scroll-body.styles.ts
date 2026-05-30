import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const mobileBreakpoint = unsafeCSS(breakpoint.sm);

// `scroll-body`: the body scrolls under a pinned header. The scrollbar is
// hidden and overflow is signalled by the shared scroll-driven fade (see
// shared/scroll-fade.styles). The header is pinned to a fixed
// `--ds-table-header-height`, and the top fade is offset by that same height so
// it dims the body just below the header rather than the header itself — no
// measurement needed. The fade depth is about half a row so the cue stays
// visible. Natural `table-layout: auto` column widths are preserved; the host
// needs a bounded height (e.g. `flex: 1` in a flex column).
export const tableScrollBodyStyles = css`
  :host([scroll-body]) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  :host([scroll-body]) .scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    /* No overscroll bounce — the rubber-band at the top/bottom looks glitchy
       against the pinned header and the offset scroll-fade. */
    overscroll-behavior: none;
    scrollbar-width: none;
    mask-image: linear-gradient(
      to bottom,
      rgb(0 0 0) 0,
      rgb(0 0 0) var(--ds-table-header-height),
      var(--ds-scroll-fade-top, rgb(0 0 0)) var(--ds-table-header-height),
      rgb(0 0 0) calc(var(--ds-table-header-height) * 2),
      rgb(0 0 0) calc(100% - var(--ds-table-header-height)),
      var(--ds-scroll-fade-bottom, rgb(0 0 0)) 100%
    );
    animation: ds-scroll-fade linear;
    animation-timeline: scroll(self);
  }
  :host([scroll-body]) .scroll::-webkit-scrollbar {
    display: none;
  }
  :host([scroll-body]) thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    box-sizing: border-box;
    block-size: var(--ds-table-header-height);
  }

  /* Stacked (mobile) layout hides the header and renders rows as cards, so the
     top fade must NOT be offset by the header height — fade from the very top
     like ds-dialog / ds-drawer. */
  @container (max-width: ${mobileBreakpoint}) {
    :host([scroll-body]:not([responsive='scroll'])) .scroll {
      mask-image: linear-gradient(
        to bottom,
        var(--ds-scroll-fade-top, rgb(0 0 0)) 0,
        rgb(0 0 0) var(--ds-table-header-height),
        rgb(0 0 0) calc(100% - var(--ds-table-header-height)),
        var(--ds-scroll-fade-bottom, rgb(0 0 0)) 100%
      );
    }
  }
`;
