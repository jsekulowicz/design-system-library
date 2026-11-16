import { describe, expect, it } from 'vitest';
import { getDeclarationsOf } from '../../shared/css-rules.test-helpers.js';
import { segmentedControlStyles } from './segmented-control.styles.js';

describe('the segmented control styles', () => {
  it('size every segment to the widest label through 1fr columns on a shrink-to-fit track', () => {
    expect(getDeclarationsOf(segmentedControlStyles, '.group')).toContain('grid-auto-columns: 1fr');
  });

  it('draw the frame and dividers as the track color showing through a 1px gap and padding', () => {
    const group = getDeclarationsOf(segmentedControlStyles, '.group');
    expect(group).toContain('gap: 1px');
    expect(group).toContain('padding: 1px');
  });

  it('lift the focused segment above its neighbors so they cannot paint over its focus ring', () => {
    expect(getDeclarationsOf(segmentedControlStyles, '.segment:focus-within')).toContain('z-index:');
  });
});
