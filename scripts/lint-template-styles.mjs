#!/usr/bin/env node
// Only `style`: SVG `d` and friends are long by nature and have nowhere better to live.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('..', import.meta.url));
const ROOTS = ['packages/components/src', 'packages/core/src', 'packages/react/src', 'packages/storybook/stories'];
const STYLE_ATTRIBUTE = /style=/;
const { printWidth } = JSON.parse(readFileSync(join(REPO, '.prettierrc.json'), 'utf8'));

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      yield* walk(path);
    } else if (path.endsWith('.ts')) {
      yield path;
    }
  }
}

const violations = [];
for (const root of ROOTS) {
  for (const path of walk(join(REPO, root))) {
    readFileSync(path, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (line.length > printWidth && STYLE_ATTRIBUTE.test(line)) {
          violations.push({ file: relative(REPO, path), line: index + 1, length: line.length });
        }
      });
  }
}

if (violations.length === 0) {
  process.exit(0);
}

console.error(`\n${violations.length} inline style attribute(s) Prettier cannot wrap:\n`);
for (const { file, line, length } of violations) {
  console.error(`  ${file}:${line}  ${length} chars`);
}
console.error(
  `\nAn attribute value is atomic to Prettier: it moves the attribute onto its own line but never breaks` +
    `\ninside it, so these stay over printWidth (${printWidth}) forever. Interpolating the value does not help` +
    '\neither - an interpolated attribute is just as atomic. Hoist it to a constant outside the template:' +
    '\n\n  const ROW = joinStyles("display:grid", "gap:var(--ds-space-3)");\n  html`<div style=${ROW}>`\n',
);
process.exit(1);
