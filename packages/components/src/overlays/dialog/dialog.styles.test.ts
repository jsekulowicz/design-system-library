import { describe, expect, it } from 'vitest';
import { getDeclarationsOf, toNormalizedCss } from '../../shared/css-rules.test-helpers.js';
import { dialogStyles } from './dialog.styles.js';

describe('the dialog styles', () => {
  it('make only the open dialog a flex box, so a closed one stays display: none as the user agent has it', () => {
    expect(getDeclarationsOf(dialogStyles, 'dialog[open]')).toContain('display: flex');
    expect(toNormalizedCss(dialogStyles)).not.toMatch(/(^|[{};]) ?dialog \{[^}]*display/);
  });

  it('cap the card height explicitly, since percentage heights do not resolve through the block host of the card', () => {
    expect(getDeclarationsOf(dialogStyles, 'ds-card::part(card)')).toContain('max-height: var(--ds-dialog-max-height');
  });
});
