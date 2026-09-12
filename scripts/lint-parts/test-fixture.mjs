import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { checkParts } from './check-parts.mjs';

export function componentSource(tag, parts, body) {
  const documentation = [`@tag ${tag}`, ...parts.map((part) => `@csspart ${part} - ${part}`)];
  return `/**\n${documentation.map((line) => ` * ${line}`).join('\n')}\n */\nexport class Component { ${body} }`;
}

export function checkFixture(context, files, exceptions = new Map()) {
  const root = mkdtempSync(join(tmpdir(), 'lint-parts-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [name, source] of Object.entries(files)) {
    const path = join(root, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, source);
  }
  const result = checkParts(root, exceptions);
  return {
    ...result,
    violations: result.violations.map(({ tag, undocumented, unrendered, unresolved }) => ({
      tag,
      undocumented,
      unrendered,
      ...(unresolved.length ? { unresolved } : {}),
    })),
  };
}
