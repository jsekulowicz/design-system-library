#!/usr/bin/env node
import { join, relative } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { checkParts } from './lint-parts/check-parts.mjs';

const REPO = fileURLToPath(new URL('..', import.meta.url));
const { violations, stale } = checkParts(join(REPO, 'packages/components/src'));

function reportParts(tag, file, parts, problem) {
  if (parts.length > 0) {
    console.error(`${relative(REPO, file)}: ${tag} ${problem}: ${parts.join(', ')}`);
  }
}

for (const { tag, file, undocumented, unrendered, unresolved } of violations) {
  reportParts(tag, file, undocumented, 'renders undocumented parts');
  reportParts(tag, file, unrendered, 'documents unrendered parts');
  reportParts(tag, file, unresolved, 'has dynamic parts requiring a scoped exception');
}
for (const { tag, part, reason } of stale) {
  console.error(`scripts/lint-parts/check-parts.mjs: stale exception for ${tag}::part(${part}): ${reason}`);
}
process.exitCode = violations.length || stale.length ? 1 : 0;
