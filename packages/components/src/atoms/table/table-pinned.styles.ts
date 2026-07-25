import { css } from 'lit';

// Frozen columns. Offsets and separator/shadow gates come from
// PinnedColumnsController. Sticky cells are transparent by default, so every row
// background state is re-declared to keep them opaque over scrolling content.
export const tablePinnedStyles = css`
  :host {
    --ds-table-pin-max-ratio: 0.75;
  }

  th.pinned,
  td.pinned {
    position: sticky;
    background: var(--ds-color-bg);
  }
  td.pinned {
    z-index: 1;
  }
  /* :host raises specificity above :host([scroll-body]) thead th so the pinned
     header corner stays top of the stack. */
  :host thead th.pinned {
    z-index: calc(var(--ds-z-index-raised) + 1);
    background: var(--ds-color-bg-subtle);
  }
  tbody tr:nth-child(even) td.pinned {
    background: var(--ds-color-bg-subtle);
  }
  tbody tr.clickable:hover td.pinned {
    background: var(--ds-color-bg-muted);
  }

  /* Box-shadow, not border: collapsed borders don't paint reliably on sticky
     cells. Separator is always on; the drop-shadow fades in on horizontal scroll. */
  th.pin-edge,
  td.pin-edge {
    box-shadow:
      inset calc(-1px * var(--ds-table-pin-active, 0)) 0 0 0 var(--ds-color-border),
      6px 0 8px -6px rgb(0 0 0 / calc(0.16 * var(--ds-table-pin-shadow, 0)));
  }
`;
