import { describe, expect, it } from 'vitest';
import { buttonStyles } from '../actions/button/button.styles.js';
import { menuStyles } from '../navigation/menu/menu.styles.js';
import { progressBarStyles } from '../feedback/progress-bar/progress-bar.styles.js';
import { selectCommonStyles } from '../forms/select/select.common-styles.js';
import { tableResponsiveStyles } from '../data-display/table/table-responsive.styles.js';
import { tableStyles } from '../data-display/table/table.styles.js';
import { cardStyles } from '../data-display/card/card.styles.js';
import { dialogStyles } from '../overlays/dialog/dialog.styles.js';
import { statTileStyles } from '../data-display/stat-tile/stat-tile.styles.js';
import { fieldControlStyles } from './field-control.styles.js';

const standardSurfaceStyles = [
  ['button', buttonStyles],
  ['card', cardStyles],
  ['dialog', dialogStyles],
  ['field control', fieldControlStyles],
  ['menu', menuStyles],
  ['responsive table', tableResponsiveStyles],
  ['select', selectCommonStyles],
  ['stat tile', statTileStyles],
  ['table', tableStyles],
] as const;

describe('standard surface radius', () => {
  it.each(standardSurfaceStyles)('%s uses radius-xs', (_, styles) => {
    expect(styles.cssText).toContain('var(--ds-radius-xs)');
    expect(styles.cssText).not.toMatch(/var\(--ds-radius-(sm|md)\)/);
  });

  it('keeps the progress track geometry rounded', () => {
    expect(progressBarStyles.cssText).toContain('border-radius: var(--ds-radius-sm)');
  });
});
