import { css, unsafeCSS } from 'lit';
import { breakpoint } from '@jsekulowicz/ds-tokens';

const mobileBreakpoint = unsafeCSS(breakpoint.sm);

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
    /* The rubber-band reads as broken against the pinned header. */
    overscroll-behavior: none;
    scrollbar-width: none;
    --ds-scroll-fade-offset: var(--ds-table-header-height);
    mask-image: var(--ds-scroll-fade-mask);
  }
  :host([scroll-body]) .scroll::-webkit-scrollbar {
    display: none;
  }
  :host([scroll-body]) thead th {
    position: sticky;
    top: 0;
    z-index: var(--ds-z-index-raised);
    box-sizing: border-box;
    block-size: var(--ds-table-header-height);
  }

  /* Stacked layout has no header to offset past. */
  @container (max-width: ${mobileBreakpoint}) {
    :host([scroll-body]:not([responsive='scroll'])) .scroll {
      --ds-scroll-fade-offset: 0px;
    }
  }
`;
