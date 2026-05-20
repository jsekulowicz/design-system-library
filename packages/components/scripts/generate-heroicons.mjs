import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageJsonPath = require.resolve('heroicons/package.json');
const heroiconsRoot = dirname(packageJsonPath);
const iconDir = fileURLToPath(new URL('../src/atoms/icon/icons/', import.meta.url));
const defaultSource = { size: '24', style: 'outline' };
const variantOverrides = new Map([
  ['check', { size: '16', style: 'solid' }],
  ['chevron-down', { size: '16', style: 'solid' }],
  ['minus', { size: '16', style: 'solid' }],
]);

async function getIconNames() {
  const files = await readdir(join(heroiconsRoot, defaultSource.size, defaultSource.style));
  return files
    .filter((file) => file.endsWith('.svg'))
    .map((file) => file.replace(/\.svg$/, ''))
    .sort((left, right) => left.localeCompare(right));
}

async function readIcon(name) {
  const source = variantOverrides.get(name) ?? defaultSource;
  const file = join(heroiconsRoot, source.size, source.style, `${name}.svg`);
  const svg = await readFile(file, 'utf8');
  return {
    source,
    svg: svg.trim().replace(/>\s+</g, '><').replace(/\s{2,}/g, ' '),
  };
}

function renderIconModule(name, source, svg) {
  return `// Generated from Heroicons ${source.size}/${source.style}: ${name}. Do not edit by hand.
import { registerIcon } from '../icon.js';

registerIcon(
  '${name}',
  ${JSON.stringify(svg)},
);
`;
}

function renderAllModule(names) {
  const imports = names.map((name) => `import './${name}.js';`).join('\n');
  return `// Generated from Heroicons. Do not edit by hand.
${imports}
`;
}

function renderNamesModule(names) {
  return `// Generated from Heroicons. Do not edit by hand.
export const heroiconNames = ${JSON.stringify(names, null, 2)} as const;
export type HeroiconName = typeof heroiconNames[number];
`;
}

async function main() {
  const names = await getIconNames();
  await rm(iconDir, { force: true, recursive: true });
  await mkdir(iconDir, { recursive: true });

  for (const name of names) {
    const { source, svg } = await readIcon(name);
    await writeFile(join(iconDir, `${name}.ts`), renderIconModule(name, source, svg));
  }

  await writeFile(join(iconDir, 'all.ts'), renderAllModule(names));
  await writeFile(join(iconDir, 'names.ts'), renderNamesModule(names));
}

await main();
