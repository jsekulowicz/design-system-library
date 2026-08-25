import { html, type TemplateResult } from 'lit';
import { GROUP_LABEL, joinStyles } from '../shared/styles';

interface BrandExample {
  name: string;
  tokens: ReadonlyArray<readonly [string, string]>;
}

const BRAND_EXAMPLES: readonly BrandExample[] = [
  {
    name: 'Cobalt',
    tokens: [
      ['--ds-color-accent', '#4A72CC'],
      ['--ds-color-accent-hover', '#3860B8'],
      ['--ds-color-accent-active', '#2750A2'],
      ['--ds-color-accent-subtle', '#E8EEF9'],
    ],
  },
  {
    name: 'Vermilion',
    tokens: [
      ['--ds-color-accent', '#E2341D'],
      ['--ds-color-accent-hover', '#C12613'],
      ['--ds-color-accent-active', '#9A1B0C'],
      ['--ds-color-accent-subtle', 'rgba(226, 52, 29, 0.1)'],
    ],
  },
  {
    name: 'Rounded teal',
    tokens: [
      ['--ds-color-accent', '#1F7A7A'],
      ['--ds-color-accent-hover', '#166666'],
      ['--ds-color-accent-active', '#0D5252'],
      ['--ds-color-accent-subtle', 'rgba(31, 122, 122, 0.1)'],
      ['--ds-radius-xs', '12px'],
    ],
  },
];

const EXAMPLES_LAYOUT = joinStyles(
  'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--ds-space-5)',
  'font-family:var(--ds-font-body)',
  'font-size:var(--ds-font-size-body-lg)',
  'color:var(--ds-color-fg)',
);

function tokenStyles(tokens: BrandExample['tokens']): string {
  return tokens.map(([token, value]) => `${token}:${value}`).join(';');
}

function tokenCode(tokens: BrandExample['tokens']): string {
  const declarations = tokens.map(([token, value]) => `  ${token}: ${value};`).join('\n');
  return `.brand-example {\n${declarations}\n}`;
}

function componentShowcase(tokens: BrandExample['tokens']): TemplateResult {
  const style = joinStyles(
    tokenStyles(tokens),
    'display:grid;gap:var(--ds-space-4);width:100%;max-width:480px;min-width:0',
  );
  return html`<div style=${style}>
    <ds-card elevation="sm">
      <ds-badge slot="eyebrow" tone="accent">Themed</ds-badge>
      <span slot="title">Override the semantic layer</span>
      <p>
        Every <code>ds-*</code> component reads the same semantic tokens. Change the tokens and the components update.
      </p>
      <div slot="actions">
        <ds-button variant="primary">Primary</ds-button>
        <ds-button variant="ghost">Ghost</ds-button>
      </div>
    </ds-card>
    <ds-text-field placeholder="Type to test focus ring"></ds-text-field>
  </div>`;
}

function brandExample(example: BrandExample): TemplateResult {
  return html`<section style="display:grid;gap:var(--ds-space-3);align-content:start;min-width:0">
    <h3 style=${GROUP_LABEL}>${example.name}</h3>
    ${componentShowcase(example.tokens)}
    <pre class="ds-brand-example-code"><code>${tokenCode(example.tokens)}</code></pre>
  </section>`;
}

export function renderBrandExamples(): TemplateResult {
  return html`<div style=${EXAMPLES_LAYOUT}>${BRAND_EXAMPLES.map(brandExample)}</div>`;
}
