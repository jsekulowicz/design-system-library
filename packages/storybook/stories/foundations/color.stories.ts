import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Foundations/Color',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

interface Swatch {
  token: string;
  label: string;
  desc: string;
}

interface Group {
  name: string;
  swatches: Swatch[];
}

const GROUPS: Group[] = [
  {
    name: 'Surface',
    swatches: [
      { token: '--ds-color-bg', label: 'Background', desc: 'Page canvas. Base layer for all content.' },
      { token: '--ds-color-bg-subtle', label: 'Background subtle', desc: 'Cards, sidebars, input fills, zebra stripes.' },
      { token: '--ds-color-bg-muted', label: 'Background muted', desc: 'Dividers, table row separators, skeleton loaders.' },
      { token: '--ds-color-bg-inverse', label: 'Background inverse', desc: 'Reverse surface for tooltips and dark panels.' },
    ],
  },
  {
    name: 'Text',
    swatches: [
      { token: '--ds-color-fg', label: 'Foreground', desc: 'Primary text and icons. Always passes APCA on bg.' },
      { token: '--ds-color-fg-muted', label: 'Foreground muted', desc: 'Secondary text, descriptions, placeholder copy.' },
      { token: '--ds-color-fg-subtle', label: 'Foreground subtle', desc: 'Disabled state, de-emphasised metadata.' },
      { token: '--ds-color-fg-inverse', label: 'Foreground inverse', desc: 'Text/icons on inverse (dark) surfaces.' },
    ],
  },
  {
    name: 'Accent',
    swatches: [
      { token: '--ds-color-accent', label: 'Accent', desc: 'Brand colour. Filled buttons, active links, focus rings.' },
      { token: '--ds-color-accent-hover', label: 'Accent hover', desc: 'One step darker on pointer hover.' },
      { token: '--ds-color-accent-active', label: 'Accent active', desc: 'Two steps darker on press / current state.' },
      { token: '--ds-color-accent-fg', label: 'Accent foreground', desc: 'Text and icons placed on solid accent backgrounds.' },
      { token: '--ds-color-accent-subtle', label: 'Accent subtle', desc: 'Tinted fill: selected rows, active nav items, badges.' },
    ],
  },
  {
    name: 'Border & Focus',
    swatches: [
      { token: '--ds-color-border', label: 'Border', desc: 'Default hairline. Card outlines, separators.' },
      { token: '--ds-color-border-strong', label: 'Border strong', desc: 'Heavier outlines for inputs, modals, drawers.' },
      { token: '--ds-color-border-subtle', label: 'Border subtle', desc: 'Very light structural lines. Row dividers in tables.' },
      { token: '--ds-color-focus', label: 'Focus ring', desc: 'Keyboard focus halo. Never suppressed; always 3 px.' },
    ],
  },
  {
    name: 'Status',
    swatches: [
      { token: '--ds-color-success', label: 'Success', desc: 'Positive outcomes, confirmations, saved states.' },
      { token: '--ds-color-success-subtle', label: 'Success subtle', desc: 'Tinted background for success banners and badges.' },
      { token: '--ds-color-warning', label: 'Warning', desc: 'Caution, non-blocking issues, degraded states.' },
      { token: '--ds-color-warning-subtle', label: 'Warning subtle', desc: 'Tinted background for warning banners and badges.' },
      { token: '--ds-color-danger', label: 'Danger', desc: 'Errors, destructive actions, critical alerts.' },
      { token: '--ds-color-danger-subtle', label: 'Danger subtle', desc: 'Tinted background for error banners and badges.' },
    ],
  },
  {
    name: 'Chart',
    swatches: [
      { token: '--ds-color-chart-1', label: 'Chart 1 — Cobalt', desc: 'Primary data series.' },
      { token: '--ds-color-chart-2', label: 'Chart 2 — Teal', desc: 'Second series.' },
      { token: '--ds-color-chart-3', label: 'Chart 3 — Amber', desc: 'Third series.' },
      { token: '--ds-color-chart-4', label: 'Chart 4 — Plum', desc: 'Fourth series.' },
      { token: '--ds-color-chart-5', label: 'Chart 5 — Green', desc: 'Fifth series.' },
      { token: '--ds-color-chart-6', label: 'Chart 6 — Violet', desc: 'Sixth series.' },
    ],
  },
];

function swatchCard(s: Swatch): TemplateResult {
  return html`
    <figure style="margin:0;border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-md);overflow:hidden">
      <div style="height:56px;background:var(${s.token})" aria-hidden="true"></div>
      <figcaption style="padding:var(--ds-space-3);display:grid;gap:2px;background:var(--ds-color-bg-subtle)">
        <strong style="font-size:var(--ds-font-size-sm)">${s.label}</strong>
        <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${s.token}</code>
        <p style="margin:0;font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-subtle);margin-top:var(--ds-space-1)">${s.desc}</p>
      </figcaption>
    </figure>`;
}

export const SemanticPalette: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-8);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  ${GROUPS.map(g => html`
    <div style="display:grid;gap:var(--ds-space-3)">
      <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">${g.name}</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:var(--ds-space-3)">
        ${g.swatches.map(swatchCard)}
      </div>
    </div>`)}
</section>`,
};

const PAIRINGS = [
  { bg: '--ds-color-bg', fg: '--ds-color-fg', label: 'Primary on background', sample: 'Main body text, headings, icons.' },
  { bg: '--ds-color-bg', fg: '--ds-color-fg-muted', label: 'Muted on background', sample: 'Secondary text, descriptions, placeholder copy.' },
  { bg: '--ds-color-bg-subtle', fg: '--ds-color-fg', label: 'Primary on subtle', sample: 'Content inside cards, sidebars, and tinted panels.' },
  { bg: '--ds-color-accent', fg: '--ds-color-accent-fg', label: 'Accent foreground on accent', sample: 'Filled primary buttons, active badges, selected chips.' },
  { bg: '--ds-color-bg-inverse', fg: '--ds-color-fg-inverse', label: 'Inverse on inverse background', sample: 'Tooltip text, dark overlay panels, reverse banners.' },
];

export const UsagePairings: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-4);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  ${PAIRINGS.map(p => html`
    <div style="border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-md);overflow:hidden">
      <div style="padding:var(--ds-space-5);background:var(${p.bg});color:var(${p.fg})">
        <p style="margin:0;font-size:var(--ds-font-size-md)">${p.sample}</p>
      </div>
      <div style="padding:var(--ds-space-2) var(--ds-space-4);background:var(--ds-color-bg-subtle);display:flex;align-items:center;gap:var(--ds-space-4);flex-wrap:wrap;border-top:1px solid var(--ds-color-border)">
        <span style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted);min-width:14rem">${p.label}</span>
        <div style="display:flex;align-items:center;gap:var(--ds-space-2)">
          <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">${p.bg}</code>
          <span style="color:var(--ds-color-fg-subtle);font-size:var(--ds-font-size-xs)">+</span>
          <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">${p.fg}</code>
        </div>
      </div>
    </div>`)}
</section>`,
};
