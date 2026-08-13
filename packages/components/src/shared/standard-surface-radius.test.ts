import { describe, expect, it } from 'vitest';
import { buttonStyles } from '../atoms/button/button.styles.js';
import { menuStyles } from '../atoms/menu/menu.styles.js';
import { progressBarStyles } from '../atoms/progress-bar/progress-bar.styles.js';
import { selectCommonStyles } from '../atoms/select/select.common-styles.js';
import { tableResponsiveStyles } from '../atoms/table/table-responsive.styles.js';
import { tableStyles } from '../atoms/table/table.styles.js';
import { cardStyles } from '../molecules/card/card.styles.js';
import { dialogStyles } from '../molecules/dialog/dialog.styles.js';
import { statTileStyles } from '../molecules/stat-tile/stat-tile.styles.js';
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
