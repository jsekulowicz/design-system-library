import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

interface CemEvent {
  name: string;
}

interface CemClass {
  kind: string;
  customElement?: boolean;
  name: string;
  tagName?: string;
  events?: CemEvent[];
}

interface CemModule {
  path: string;
  declarations?: CemClass[];
}

interface Cem {
  modules: CemModule[];
}

interface WrapperSpec {
  tagName: string;
  className: string;
  events: string[];
  modulePath: string;
}

const INTERNAL_TAGS = new Set(['ds-select-option']);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const CEM_PATH = resolve(ROOT, '../components/custom-elements.json');
const OUT_DIR = resolve(ROOT, 'src');

function toPascal(tag: string): string {
  return tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toEventPropName(event: string): string {
  return `on${toPascal(event)}`;
}

function resolveSubpath(modulePath: string): string {
  const match = modulePath.match(/src\/(?:atoms|molecules|organisms|templates|pages)\/([^/]+)\//);
  if (!match) {
    throw new Error(`Cannot derive subpath from ${modulePath}`);
  }
  return match[1];
}

function collectWrapperSpecs(cem: Cem): WrapperSpec[] {
  const specs: WrapperSpec[] = [];
  for (const mod of cem.modules) {
    for (const decl of mod.declarations ?? []) {
      if (decl.kind !== 'class' || !decl.customElement || !decl.tagName) {
        continue;
      }
      if (INTERNAL_TAGS.has(decl.tagName)) {
        continue;
      }
      specs.push({
        tagName: decl.tagName,
        className: decl.name,
        events: (decl.events ?? []).map((e) => e.name),
        modulePath: mod.path,
      });
    }
  }
  return specs.sort((a, b) => a.tagName.localeCompare(b.tagName));
}

function renderEventMap(events: string[]): string {
  if (events.length === 0) {
    return '{}';
  }
  const entries = events.map((name) => `    '${toEventPropName(name)}': '${name}' as EventName<CustomEvent>`);
  return `{\n${entries.join(',\n')},\n  }`;
}

function renderWrapperFile(spec: WrapperSpec): string {
  const componentName = spec.className.replace(/^Ds/, '');
  const subpath = resolveSubpath(spec.modulePath);
  const events = renderEventMap(spec.events);
  const litReactImport = spec.events.length > 0
    ? "import { createComponent, type EventName } from '@lit/react';"
    : "import { createComponent } from '@lit/react';";
  return `import * as React from 'react';
${litReactImport}
import { ${spec.className} } from '@ds/components/${subpath}';
import '@ds/components/${subpath}/define';

export const ${componentName} = createComponent({
  tagName: '${spec.tagName}',
  elementClass: ${spec.className},
  react: React,
  events: ${events},
  displayName: '${componentName}',
});
`;
}

function renderIndex(specs: WrapperSpec[]): string {
  const lines = specs.map((s) => {
    const componentName = s.className.replace(/^Ds/, '');
    return `export { ${componentName} } from './${s.tagName}.js';`;
  });
  return `${lines.join('\n')}\n`;
}

async function generate(): Promise<void> {
  const raw = await readFile(CEM_PATH, 'utf8');
  const cem = JSON.parse(raw) as Cem;
  const specs = collectWrapperSpecs(cem);
  await mkdir(OUT_DIR, { recursive: true });
  for (const spec of specs) {
    const outPath = resolve(OUT_DIR, `${spec.tagName}.ts`);
    await writeFile(outPath, renderWrapperFile(spec), 'utf8');
  }
  await writeFile(resolve(OUT_DIR, 'index.ts'), renderIndex(specs), 'utf8');
  console.log(`Generated ${specs.length} React wrappers`);
}

generate().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
