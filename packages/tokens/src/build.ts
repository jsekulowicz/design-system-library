import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as primitive from './primitive/index.js';
import { semanticLight } from './semantic/light.js';
import { semanticDark } from './semantic/dark.js';
import { flatten, type TokenTree } from './build/flatten.js';
import { renderBlock, renderFile, FILE_HEADER } from './build/emit.js';

const here = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(here);

async function writeOut(filename: string, contents: string): Promise<void> {
  const target = resolve(distDir, filename);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, 'utf8');
}

function buildBaseCss(): string {
  const tokens = flatten(primitive as unknown as TokenTree);
  const block = renderBlock(tokens, { selector: ':root', layer: 'ds.base' });
  return renderFile(FILE_HEADER, [block]);
}

function buildThemeCss(name: 'light' | 'dark'): string {
  const semantic = name === 'light' ? semanticLight : semanticDark;
  const tokens = flatten(semantic as unknown as TokenTree);
  const root = renderBlock(tokens, {
    selector: name === 'light' ? ':root, [data-ds-theme="light"]' : '[data-ds-theme="dark"]',
    layer: 'ds.theme',
  });
  if (name !== 'dark') {
    return renderFile(FILE_HEADER, [root]);
  }
  const prefersDark = renderBlock(tokens, {
    selector: ':root:not([data-ds-theme])',
    layer: 'ds.theme',
    mediaQuery: '(prefers-color-scheme: dark)',
  });
  return renderFile(FILE_HEADER, [root, prefersDark]);
}

function buildLayerDeclaration(): string {
  return '@layer ds.base, ds.theme, ds.components, ds.utilities;\n';
}

async function run(): Promise<void> {
  await writeOut('base.css', buildLayerDeclaration() + buildBaseCss());
  await writeOut('theme-default-light.css', buildThemeCss('light'));
  await writeOut('theme-default-dark.css', buildThemeCss('dark'));
  await writeOut(
    'theme-default.css',
    `@import './base.css';\n@import './theme-default-light.css';\n@import './theme-default-dark.css';\n`,
  );
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
