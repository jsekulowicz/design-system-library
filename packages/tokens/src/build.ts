import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBaseCss, buildThemeCss, buildLayerDeclaration } from './build/css.js';

const here = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(here);

async function writeOut(filename: string, contents: string): Promise<void> {
  const target = resolve(distDir, filename);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, 'utf8');
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
