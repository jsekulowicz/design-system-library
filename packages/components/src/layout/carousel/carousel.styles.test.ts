import { describe, expect, it } from 'vitest';
import { getDeclarationsOf, toNormalizedCss } from '../../shared/css-rules.test-helpers.js';
import { carouselStyles } from './carousel.styles.js';

function getScrollLinkedTrackRule(): string {
  const css = toNormalizedCss(carouselStyles);
  return css.slice(css.indexOf('@supports (animation-timeline: scroll())'));
}

describe('the carousel styles', () => {
  it('keep a sideways swipe inside the row in browsers without scroll-linked animations', () => {
    expect(getDeclarationsOf(carouselStyles, '.track')).toContain('overscroll-behavior-x: contain');
  });

  it('let a sideways swipe reach the browser back gesture while every item fits, because a row with nothing to scroll has an inactive scroll timeline', () => {
    const track = getScrollLinkedTrackRule();

    expect(track).toContain('overscroll-behavior-x: auto');
    expect(track).toContain('scroll-timeline: --ds-carousel-track inline');
    expect(track).toContain('animation-timeline: --ds-carousel-track');
  });

  it('end the animation past the scroll range, because an animation that finished at the scroll end keeps its effect after the row stops overflowing', () => {
    expect(getScrollLinkedTrackRule()).toContain('animation-range: normal 200%');
  });

  it('keep a sideways swipe inside the row over the whole scroll range while the row overflows', () => {
    expect(toNormalizedCss(carouselStyles)).toMatch(
      /@keyframes ds-carousel-contain-overscroll \{ from, to \{ overscroll-behavior-x: contain; \} \}/,
    );
  });
});
