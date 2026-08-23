import * as primitive from '../primitive/index.js';
import { semanticLight } from '../semantic/light.js';
import { semanticDark } from '../semantic/dark.js';
import { flatten, type TokenTree, type FlatTokens } from './flatten.js';
import { renderBlock, renderFile, FILE_HEADER } from './emit.js';

export const PIXEL_GRID = 2;

export function roundedLineHeight(multiplier: string): string {
  return `round(up, ${multiplier}em, ${PIXEL_GRID}px)`;
}

function snapLineHeights(tokens: FlatTokens): FlatTokens {
  for (const [name, multiplier] of Object.entries(primitive.lineHeight)) {
    const key = `--ds-line-height-${name}`;
    if (key in tokens) {
      tokens[key] = roundedLineHeight(multiplier);
    }
  }
  return tokens;
}

export function buildBaseCss(): string {
  const tokens = snapLineHeights(flatten(primitive as unknown as TokenTree));
  const block = renderBlock(tokens, {
    selector: ':root',
    layer: 'ds.base',
    extraProps: { 'line-height': 'var(--ds-line-height-normal)' },
  });
  return renderFile(FILE_HEADER, [block]);
}

export function buildThemeCss(name: 'light' | 'dark'): string {
  const semantic = name === 'light' ? semanticLight : semanticDark;
  const tokens = snapLineHeights(flatten(semantic as unknown as TokenTree));
  const colorScheme = name === 'light' ? 'light' : 'dark';
  const root = renderBlock(tokens, {
    selector: name === 'light' ? ':root, [data-ds-theme="light"]' : '[data-ds-theme="dark"]',
    layer: 'ds.theme',
    extraProps: { 'color-scheme': colorScheme },
  });
  if (name !== 'dark') {
    return renderFile(FILE_HEADER, [root]);
  }
  const prefersDark = renderBlock(tokens, {
    selector: ':root:not([data-ds-theme])',
    layer: 'ds.theme',
    mediaQuery: '(prefers-color-scheme: dark)',
    extraProps: { 'color-scheme': 'dark' },
  });
  return renderFile(FILE_HEADER, [root, prefersDark]);
}

export function buildLayerDeclaration(): string {
  return '@layer ds.base, ds.theme, ds.components, ds.utilities;\n';
}
