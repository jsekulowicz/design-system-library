import { describe, expect, it } from 'vitest';
import { getDeclarationsOf } from '../../shared/css-rules.test-helpers.js';
import { breadcrumbItemStyles } from './breadcrumb-item.styles.js';

describe('the breadcrumb item styles', () => {
  it("widen the link's focus ring with padding that a matching negative margin cancels, leaving its footprint unchanged", () => {
    const link = getDeclarationsOf(breadcrumbItemStyles, 'a');
    expect(link).toContain('padding: var(--ds-space-1) 2px');
    expect(link).toContain('margin-inline: -2px');
  });
});
