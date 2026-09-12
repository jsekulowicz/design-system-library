import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkFixture, componentSource } from './test-fixture.mjs';

const validTemplates = [
  [
    'single, double and unquoted attributes',
    ['one', 'two', 'three'],
    `<div part='one two'></div><div part = "three"></div><div part=one></div>`,
  ],
  [
    'only the conditional result branches',
    ['item', 'current'],
    '<li part=${this.mode === "active" ? "item current" : "item"}></li>',
  ],
  [
    'nested conditional results',
    ['one', 'two', 'three'],
    '<div part=${this.a ? (this.b ? "one" : "two") : "three"}></div>',
  ],
  ['quoted interpolated attributes', ['item', 'current'], '<div part="item ${this.active ? "current" : ""}"></div>'],
  [
    'nested template expressions',
    ['button', 'button-prev', 'button-next'],
    '<button part=${`button button-${this.prev ? "prev" : "next"}`}></button>',
  ],
  ['renamed forwarded parts', ['outer', 'body'], '<ds-child exportparts="inner:outer, body"></ds-child>'],
  [
    'dynamic forwarded parts',
    ['outer', 'body'],
    '<ds-child exportparts=${this.active ? "inner:outer" : "body"}></ds-child>',
  ],
  [
    'unrelated attributes and HTML comments',
    [],
    `<div data-part="fake" title='part="fake"'></div><!-- <div part="fake"></div> -->`,
  ],
];

for (const [scenario, parts, markup] of validTemplates) {
  test(`extracts ${scenario}`, (context) => {
    const source = componentSource('ds-example', parts, `render() { return html\`${markup}\`; }`);
    assert.deepEqual(checkFixture(context, { 'example.ts': source }), { violations: [], stale: [] });
  });
}

test('reports undocumented and unrendered parts together', (context) => {
  const source = componentSource('ds-example', ['missing'], 'render() { return html`<div part="extra"></div>`; }');
  assert.deepEqual(checkFixture(context, { 'example.ts': source }).violations, [
    { tag: 'ds-example', undocumented: ['extra'], unrendered: ['missing'] },
  ]);
});

test('does not credit selectors, CSS or source comments as rendered parts', (context) => {
  const body = `
    static styles = css\`[part="ghost"] { color: red; }\`;
    render() {
      // return html\`<div part="ghost"></div>\`;
      this.shadowRoot.querySelector('[part="ghost"]');
      return html\`<div></div>\`;
    }
  `;
  const result = checkFixture(context, { 'example.ts': componentSource('ds-example', ['ghost'], body) });
  assert.deepEqual(result.violations, [{ tag: 'ds-example', undocumented: [], unrendered: ['ghost'] }]);
});

test('reads imperative writes with either quote style and static constants', (context) => {
  const source =
    `const PART = 'marker';\n` +
    componentSource(
      'ds-example',
      ['marker', 'active'],
      `
    connectedCallback() { this.element.setAttribute("part", this.active ? PART + ' active' : PART); }
  `,
    );
  assert.deepEqual(checkFixture(context, { 'example.ts': source }), { violations: [], stale: [] });
});

test('reads SVG templates and nested HTML templates', (context) => {
  const source = componentSource(
    'ds-example',
    ['point', 'label'],
    `
    render() { return html\`<svg>\${svg\`<circle part="point"></circle>\`}</svg>\${html\`<span part="label"></span>\`}\`; }
  `,
  );
  assert.deepEqual(checkFixture(context, { 'example.ts': source }), { violations: [], stale: [] });
});
