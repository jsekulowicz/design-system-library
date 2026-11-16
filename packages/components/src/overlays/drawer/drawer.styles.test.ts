import { describe, expect, it } from 'vitest';
import { getDeclarationsOf, toNormalizedCss } from '../../shared/css-rules.test-helpers.js';
import { drawerStyles } from './drawer.styles.js';

describe('the drawer styles', () => {
  it('make only the open drawer a flex box, so a closed one stays display: none as the user agent has it', () => {
    expect(getDeclarationsOf(drawerStyles, 'dialog[open]')).toContain('display: flex');
    expect(toNormalizedCss(drawerStyles)).not.toMatch(/(^|[{};]) ?dialog \{[^}]*display:/);
  });

  it('set the card height explicitly, since percentage heights do not resolve through the block host of the card', () => {
    expect(getDeclarationsOf(drawerStyles, 'ds-card::part(card)')).toContain('height: var(--ds-drawer-height, 100dvh)');
  });

  it('remove the card border outright, since the border-box background would still fill a transparent one', () => {
    expect(getDeclarationsOf(drawerStyles, 'ds-card::part(card)')).toContain('border: 0');
  });

  it("center the title text with flex so the heading's line height cannot inflate the row", () => {
    expect(getDeclarationsOf(drawerStyles, '.title-text')).toContain('display: flex');
  });
});
