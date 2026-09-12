import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkFixture, componentSource } from './test-fixture.mjs';

const exceptions = new Map([
  ['ds-owner', { names: ['button-prev'], reason: 'button name interpolates the direction' }],
]);
const owner = componentSource(
  'ds-owner',
  ['button-prev'],
  'render() { return html`<button part="button-${this.direction}"></button>`; }',
);

test('reports dynamic attributes without a scoped exception', (context) => {
  const source = componentSource(
    'ds-example',
    [],
    'render() { return html`<button part="button-${this.direction}"></button>`; }',
  );
  const result = checkFixture(context, { 'example.ts': source });
  assert.deepEqual(result.violations, [
    {
      tag: 'ds-example',
      undocumented: [],
      unrendered: [],
      unresolved: ['button-${...}'],
    },
  ]);
});

test('limits a runtime exception to its owning component', (context) => {
  const result = checkFixture(
    context,
    {
      'owner.ts': owner,
      'other.ts': componentSource('ds-other', ['button-prev'], 'render() { return html`<div></div>`; }'),
    },
    exceptions,
  );
  assert.deepEqual(result.violations, [{ tag: 'ds-other', undocumented: [], unrendered: ['button-prev'] }]);
  assert.deepEqual(result.stale, []);
});

test('reports runtime exceptions whose documented component is gone', (context) => {
  const result = checkFixture(
    context,
    {
      'other.ts': componentSource(
        'ds-other',
        ['button-prev'],
        'render() { return html`<button part="button-prev"></button>`; }',
      ),
    },
    exceptions,
  );
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.stale, [
    { tag: 'ds-owner', part: 'button-prev', reason: 'button name interpolates the direction' },
  ]);
});

for (const [scenario, parts, body] of [
  ['removed documentation', [], 'render() { return html`<button part="button-${this.direction}"></button>`; }'],
  ['removed rendering', ['button-prev'], 'render() { return html`<button></button>`; }'],
  [
    'renamed dynamic prefix',
    ['button-prev'],
    'render() { return html`<button part="toggle-${this.direction}"></button>`; }',
  ],
  [
    'replaced interpolation with static rendering',
    ['button-prev'],
    'render() { return html`<button part="button-prev"></button>`; }',
  ],
]) {
  test(`reports a stale runtime exception after ${scenario}`, (context) => {
    const result = checkFixture(context, { 'owner.ts': componentSource('ds-owner', parts, body) }, exceptions);
    assert.equal(result.stale.length, 1);
    assert.equal(result.stale[0].part, 'button-prev');
  });
}
