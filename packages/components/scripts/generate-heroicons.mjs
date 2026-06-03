import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageJsonPath = require.resolve('heroicons/package.json');
const heroiconsRoot = dirname(packageJsonPath);
const iconDir = fileURLToPath(new URL('../src/atoms/icon/icons/', import.meta.url));
const defaultSource = { size: '24', style: 'outline' };
// Solid variants are exposed under a `-solid` suffix (Heroicons 24/solid), e.g.
// `star-solid`, for filled states like rating stars.
const solidSource = { size: '24', style: 'solid' };
const SOLID_SUFFIX = '-solid';
const variantOverrides = new Map([
  ['check', { size: '16', style: 'solid' }],
  ['chevron-down', { size: '16', style: 'solid' }],
  ['minus', { size: '16', style: 'solid' }],
]);

async function listSvgNames(size, style) {
  const files = await readdir(join(heroiconsRoot, size, style));
  return files
    .filter((file) => file.endsWith('.svg'))
    .map((file) => file.replace(/\.svg$/, ''))
    .sort((left, right) => left.localeCompare(right));
}

async function getIconNames() {
  return listSvgNames(defaultSource.size, defaultSource.style);
}

function cleanSvg(svg) {
  return svg.trim().replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ');
}

async function readIcon(name) {
  const source = variantOverrides.get(name) ?? defaultSource;
  const file = join(heroiconsRoot, source.size, source.style, `${name}.svg`);
  const svg = await readFile(file, 'utf8');
  return { source, svg: cleanSvg(svg) };
}

async function readSolidIcon(baseName) {
  const file = join(heroiconsRoot, solidSource.size, solidSource.style, `${baseName}.svg`);
  const svg = await readFile(file, 'utf8');
  return { source: solidSource, svg: cleanSvg(svg) };
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
  const outlineNames = await getIconNames();
  const solidBaseNames = await listSvgNames(solidSource.size, solidSource.style);
  await rm(iconDir, { force: true, recursive: true });
  await mkdir(iconDir, { recursive: true });

  for (const name of outlineNames) {
    const { source, svg } = await readIcon(name);
    await writeFile(join(iconDir, `${name}.ts`), renderIconModule(name, source, svg));
  }

  const solidNames = [];
  for (const baseName of solidBaseNames) {
    const name = `${baseName}${SOLID_SUFFIX}`;
    const { source, svg } = await readSolidIcon(baseName);
    await writeFile(join(iconDir, `${name}.ts`), renderIconModule(name, source, svg));
    solidNames.push(name);
  }

  const names = [...outlineNames, ...solidNames].sort((a, b) => a.localeCompare(b));
  await writeFile(join(iconDir, 'all.ts'), renderAllModule(names));
  await writeFile(join(iconDir, 'names.ts'), renderNamesModule(names));
}

await main();
