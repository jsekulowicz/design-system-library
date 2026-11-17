import { describe, expect, it } from 'vitest';
import { getDeclarationsOf } from '../../shared/css-rules.test-helpers.js';
import { cardStyles } from './card.styles.js';

describe('the card styles', () => {
  const card = getDeclarationsOf(cardStyles, '.card');

  it('take the padding from --ds-card-padding, so small cards shrink without reaching into ::part(card)', () => {
    expect(card).toContain('padding: var(--ds-card-padding, var(--ds-space-6))');
  });

  it('take the space between regions from --ds-card-gap', () => {
    expect(card).toContain('gap: var(--ds-card-gap, var(--ds-space-4))');
  });

  it('take the rest border color from a card-only variable, so borders inside the card keep --ds-color-border', () => {
    expect(card).toContain('border: 1px solid var(--ds-card-border-color, var(--ds-color-border))');
  });

  it('keep the hover border color of interactive cards on a selector that outranks a custom rest color', () => {
    expect(getDeclarationsOf(cardStyles, ':host([interactive]) .card:hover')).toContain(
      'border-color: var(--ds-color-fg-subtle)',
    );
  });
});
