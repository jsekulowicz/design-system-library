import { describe, expect, it } from 'vitest';
import { toNormalizedCss } from '../../shared/css-rules.test-helpers.js';
import { navItemStyles } from './nav-item.styles.js';

describe('the nav item styles', () => {
  it("redefine the accent color while disabled, so a consumer's accent-colored icon dims with the label", () => {
    expect(toNormalizedCss(navItemStyles)).toMatch(
      /:host\(\[disabled\]\) \{ --ds-color-accent: var\(--ds-color-fg-subtle\)/,
    );
  });
});
