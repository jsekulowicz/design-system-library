import { describe, expect, it } from 'vitest';
import * as publicEntrypoint from './index.js';

const componentModules = import.meta.glob<Record<string, unknown>>(
  './{actions,data-display,feedback,forms,layout,navigation,overlays,patterns}/*/index.ts',
  { eager: true },
);

function getComponentNames(exports: Record<string, unknown>): string[] {
  return Object.keys(exports).filter((name) => name.startsWith('Ds'));
}

describe('public component entrypoint', () => {
  it('re-exports every component class', () => {
    const expected = Object.values(componentModules).flatMap(getComponentNames).sort();
    const actual = getComponentNames(publicEntrypoint).sort();

    expect(actual).toEqual(expected);
  });
});
