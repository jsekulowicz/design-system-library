import { describe, expect, it } from 'vitest';
import { getDeclarationsOf } from '../../shared/css-rules.test-helpers.js';
import { pageShellStyles } from './page-shell.styles.js';

describe('the page shell styles', () => {
  it('collapse the hidden end aside through a 0fr track, animating it without measuring, and keep room for the toggle on its edge', () => {
    const hiddenCluster = getDeclarationsOf(pageShellStyles, ":host([aside-end-state='hidden']) .aside-end-cluster");
    expect(hiddenCluster).toContain('grid-template-columns: 0fr');
    expect(hiddenCluster).toContain('min-width:');
  });
});
