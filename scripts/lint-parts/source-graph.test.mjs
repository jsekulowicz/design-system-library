import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkFixture, componentSource } from './test-fixture.mjs';

function renderer(name, part) {
  return `export function ${name}() { return html\`<span part="${part}"></span>\`; }`;
}

test('resolves renamed imports through a re-export and a delegating helper', (context) => {
  const result = checkFixture(context, {
    'widgets/example.ts':
      `import { renderLabel as label } from '../shared/index.js';\n` +
      componentSource('ds-example', ['label'], 'render() { return label(); }'),
    'shared/index.ts': `export { renderLabel } from './delegate.js';`,
    'shared/delegate.ts': `import { label } from './label.js'; export function renderLabel() { return label(); }`,
    'shared/label.ts': renderer('label', 'label'),
  });
  assert.deepEqual(result, { violations: [], stale: [] });
});

test('resolves namespace calls without confusing equally named helpers', (context) => {
  const result = checkFixture(context, {
    'first.ts':
      `import * as helpers from './first-helper.js';\n` +
      componentSource('ds-first', [], 'render() { return helpers.renderFocusRing(); }'),
    'second.ts':
      `import { renderFocusRing } from './second-helper.js';\n` +
      componentSource('ds-second', ['second'], 'render() { return renderFocusRing(); }'),
    'first-helper.ts': renderer('renderFocusRing', 'first'),
    'second-helper.ts': renderer('renderFocusRing', 'second'),
  });
  assert.deepEqual(result.violations, [{ tag: 'ds-first', undocumented: ['first'], unrendered: [] }]);
});

test('does not credit an unused co-located renderer or a callback parameter sharing its name', (context) => {
  const result = checkFixture(context, {
    'example.ts':
      `import { renderLabel } from './helpers.js';\n` +
      componentSource(
        'ds-example',
        ['label', 'unused'],
        'render() { return renderLabel(); } run(unused) { unused(); }',
      ),
    'helpers.ts': renderer('renderLabel', 'label') + renderer('unused', 'unused'),
  });
  assert.deepEqual(result.violations, [{ tag: 'ds-example', undocumented: [], unrendered: ['unused'] }]);
});

test('keeps sibling components behind their shadow boundaries', (context) => {
  const result = checkFixture(context, {
    'parent.ts':
      `import { Component as Child } from './child.js';\n` +
      componentSource('ds-parent', ['inner'], 'render() { new Child(); return html`<ds-child></ds-child>`; }'),
    'child.ts': componentSource('ds-child', ['inner'], 'render() { return html`<div part="inner"></div>`; }'),
  });
  assert.deepEqual(result.violations, [{ tag: 'ds-parent', undocumented: [], unrendered: ['inner'] }]);
});

test('follows helper classes, callbacks and cyclic delegates without collecting unrelated functions', (context) => {
  const result = checkFixture(context, {
    'example.ts':
      `import { Controller } from './controller.js';\n` +
      componentSource('ds-example', ['label'], 'controller = new Controller();'),
    'controller.ts': `import { first } from './cycle.js'; export class Controller { render() { return [].map(first); } }`,
    'cycle.ts': `export function first() { return second(); }
      function second() { return html\`<div part="label">\${first()}</div>\`; }
      ${renderer('unrelated', 'unused')}`,
  });
  assert.deepEqual(result, { violations: [], stale: [] });
});

test('recognizes aliased and namespace template tags', (context) => {
  const result = checkFixture(context, {
    'example.ts':
      `import { html as markup } from './lit.js'; import * as lit from './lit.js';\n` +
      componentSource(
        'ds-example',
        ['label', 'point'],
        'render() { return markup`<span part="label">${lit.svg`<circle part="point"></circle>`}</span>`; }',
      ),
    'lit.ts': 'export function html() {} export function svg() {}',
  });
  assert.deepEqual(result, { violations: [], stale: [] });
});
