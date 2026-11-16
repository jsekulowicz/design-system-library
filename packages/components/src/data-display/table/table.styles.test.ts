import { describe, expect, it } from 'vitest';
import { getDeclarationsOf } from '../../shared/css-rules.test-helpers.js';
import { tablePaginationStyles } from './table-pagination.styles.js';
import { tablePinnedStyles } from './table-pinned.styles.js';
import { tableScrollBodyStyles } from './table-scroll-body.styles.js';
import { tableStyles } from './table.styles.js';

describe('the table styles', () => {
  it('keep the current page accent-colored under the pointer, outranking the muted hover of the other page buttons', () => {
    const currentPageHover = getDeclarationsOf(
      tablePaginationStyles,
      "button[aria-current='page']:hover:not(:disabled)",
    );
    expect(currentPageHover).toContain('background: var(--ds-color-accent-hover)');
  });

  it('hide the prev and next labels when compact rather than dropping them, so ::part(prev-next-label) overrides keep applying', () => {
    expect(getDeclarationsOf(tablePaginationStyles, ':host([compact]) .label')).toContain('display: none');
  });

  it('paint every row background state onto pinned cells, since a transparent sticky cell lets scrolled cells show through', () => {
    expect(getDeclarationsOf(tablePinnedStyles, 'th.pinned, td.pinned')).toContain('background:');
    expect(getDeclarationsOf(tablePinnedStyles, 'tbody tr:nth-child(even) td.pinned')).toContain('background:');
    expect(getDeclarationsOf(tablePinnedStyles, 'tbody tr.clickable:hover td.pinned')).toContain('background:');
  });

  it('keep the pinned header corner on top, its :host prefix outranking the scroll-body header rule', () => {
    expect(getDeclarationsOf(tablePinnedStyles, ':host thead th.pinned')).toContain(
      'z-index: calc(var(--ds-z-index-raised) + 1)',
    );
  });

  it('draw the pin edge as a box shadow, since collapsed borders do not paint reliably on sticky cells', () => {
    const pinEdge = getDeclarationsOf(tablePinnedStyles, 'th.pin-edge, td.pin-edge');
    expect(pinEdge).toContain('box-shadow:');
    expect(pinEdge).not.toMatch(/(^|;) ?border[\w-]*:/);
  });

  it('turn off the overscroll rubber band of a scrolling body, which reads as broken against the pinned header', () => {
    expect(getDeclarationsOf(tableScrollBodyStyles, ':host([scroll-body]) .scroll')).toContain(
      'overscroll-behavior: none',
    );
  });

  it('start the scroll fade at the very top in the stacked layout, which has no header to offset past', () => {
    const stackedScroller = getDeclarationsOf(
      tableScrollBodyStyles,
      ":host([scroll-body]:not([responsive='scroll'])) .scroll",
    );
    expect(stackedScroller).toContain('--ds-scroll-fade-offset: 0px');
  });

  it('shrink the caption to its content so it has room to stick, capped so the stacked layout still wraps it', () => {
    const caption = getDeclarationsOf(tableStyles, 'caption');
    expect(caption).toContain('width: max-content');
    expect(caption).toContain('max-width: 100%');
  });

  it('keep the header row one line tall by never wrapping header text', () => {
    expect(getDeclarationsOf(tableStyles, 'thead th')).toContain('white-space: nowrap');
  });

  it('lay cell content out as flex so non-text content centers against text cells', () => {
    expect(getDeclarationsOf(tableStyles, '.cell-content')).toContain('align-items: center');
  });
});
