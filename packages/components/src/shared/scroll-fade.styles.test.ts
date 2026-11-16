import { describe, expect, it } from 'vitest';
import { getDeclarationsOf } from './css-rules.test-helpers.js';
import { cardBodyScrollFadeStyles, scrollFadeStyles } from './scroll-fade.styles.js';

describe('the scroll fade styles', () => {
  it('declare the mask on the scroller and never on :host, since the mask resolves its fade colors where it is declared and the controller sets them on the scroller', () => {
    const { cssText } = scrollFadeStyles;
    expect(cssText).not.toContain(':host');
    expect(cssText).toMatch(/\.scroll,\s*\.scroll-fade\s*\{\s*--ds-scroll-fade-mask/);
  });

  it('give focus rings in a card body room past the clip box through padding that a matching negative margin cancels', () => {
    const body = getDeclarationsOf(cardBodyScrollFadeStyles, 'ds-card::part(body)');
    expect(body).toContain('padding-inline: var(--ds-space-2)');
    expect(body).toContain('margin-inline: calc(var(--ds-space-2) * -1)');
  });
});
