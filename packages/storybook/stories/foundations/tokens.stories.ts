import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { radius, shadow, border, duration, easing, breakpoint, container, zIndex } from '@ds/tokens';

const meta: Meta = {
  title: 'Foundations/Tokens',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

function stripeRow(i: number): string {
  return i % 2 !== 0 ? 'background:color-mix(in oklab,var(--ds-color-fg) 3%,transparent)' : '';
}

const RADIUS_STEPS = Object.entries(radius) as [string, string][];
const SHADOW_STEPS = Object.entries(shadow) as [string, string][];
const BORDER_STEPS = Object.entries(border) as [string, string][];

export const Shape: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-8);font-family:var(--ds-font-body);color:var(--ds-color-fg)">

  <div style="display:grid;gap:var(--ds-space-4)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Radius</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:var(--ds-space-3)">
      ${RADIUS_STEPS.map(([name, val]) => html`
        <div style="display:grid;gap:var(--ds-space-2);align-items:start">
          <div style="width:56px;height:56px;background:var(--ds-color-accent-subtle);border:1.5px solid var(--ds-color-accent);border-radius:${val}"></div>
          <div>
            <code style="display:block;font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">radius-${name}</code>
            <span style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${val}</span>
          </div>
        </div>`)}
    </div>
  </div>

  <div style="display:grid;gap:var(--ds-space-4)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Shadow</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--ds-space-5)">
      ${SHADOW_STEPS.map(([name]) => html`
        <div style="display:grid;gap:var(--ds-space-3)">
          <div style="height:64px;background:var(--ds-color-bg);border-radius:var(--ds-radius-md);box-shadow:var(--ds-shadow-${name})"></div>
          <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">shadow-${name}</code>
        </div>`)}
    </div>
  </div>

  <div style="display:grid;gap:var(--ds-space-4)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Border width</h3>
    <div style="display:grid;gap:0">
      ${BORDER_STEPS.map(([name, val], i) => html`
        <div style="display:grid;grid-template-columns:9rem 4rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
          <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">border-${name}</code>
          <span style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${val}</span>
          <div style="height:${val};background:var(--ds-color-fg);border-radius:1px;max-width:120px"></div>
        </div>`)}
    </div>
  </div>
</section>`,
};

const DURATION_STEPS = Object.entries(duration) as [string, string][];
const EASING_STEPS = Object.entries(easing) as [string, string][];
const DURATION_USE: Record<string, string> = {
  instant: 'Micro-interactions: toggle, checkbox check',
  fast: 'Hover states, icon swaps, badge updates',
  normal: 'Drawer open, popover appear, tab switch',
  slow: 'Panel slide, card expand, skeleton fade',
  slower: 'Full-page transitions, staggered list entry',
};
const EASING_USE: Record<string, string> = {
  standard: 'Default for most transitions',
  emphasized: 'Attention-drawing, springy overshoot',
  enter: 'Elements entering the screen',
  exit: 'Elements leaving the screen',
};

export const Motion: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-8);font-family:var(--ds-font-body);color:var(--ds-color-fg)">

  <div style="display:grid;gap:var(--ds-space-3)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Duration</h3>
    <div role="table" style="display:grid;gap:0">
      ${DURATION_STEPS.map(([name, val], i) => html`
        <div role="row" style="display:grid;grid-template-columns:9rem 4.5rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
          <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">duration-${name}</code>
          <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${val}</span>
          <span role="cell" style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${DURATION_USE[name]}</span>
        </div>`)}
    </div>
  </div>

  <div style="display:grid;gap:var(--ds-space-3)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Easing</h3>
    <div role="table" style="display:grid;gap:0">
      ${EASING_STEPS.map(([name, val], i) => html`
        <div role="row" style="display:grid;grid-template-columns:9rem 1fr 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
          <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">easing-${name}</code>
          <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${val}</code>
          <span role="cell" style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${EASING_USE[name]}</span>
        </div>`)}
    </div>
  </div>
</section>`,
};

const BREAKPOINT_STEPS = Object.entries(breakpoint) as [string, string][];
const CONTAINER_STEPS = Object.entries(container) as [string, string][];
const ZINDEX_STEPS = Object.entries(zIndex) as [string, string][];
const ZINDEX_USE: Record<string, string> = {
  base: 'Normal document flow',
  raised: 'Sticky elements within a section',
  dropdown: 'Menus, autocomplete panels',
  sticky: 'Sticky headers and sidebars',
  overlay: 'Backdrop overlays behind modals',
  modal: 'Dialogs, drawers, sheets',
  toast: 'Notification toasts',
  tooltip: 'Tooltips (Popover API top layer — z-index is a fallback)',
};

export const BreakpointsAndZIndex: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-8);font-family:var(--ds-font-body);color:var(--ds-color-fg)">

  <div style="display:grid;gap:var(--ds-space-3)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Breakpoints</h3>
    <div role="table" style="display:grid;gap:0">
      ${BREAKPOINT_STEPS.map(([name, val], i) => html`
        <div role="row" style="display:grid;grid-template-columns:7rem 6rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
          <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">breakpoint-${name}</code>
          <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${val}</span>
          <div role="cell" style="height:6px;background:var(--ds-color-accent-subtle);border:1px solid var(--ds-color-accent);border-radius:2px;max-width:${val}"></div>
        </div>`)}
    </div>
  </div>

  <div style="display:grid;gap:var(--ds-space-3)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Container max-widths</h3>
    <div role="table" style="display:grid;gap:0">
      ${CONTAINER_STEPS.map(([name, val], i) => html`
        <div role="row" style="display:grid;grid-template-columns:7rem 4.5rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
          <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">container-${name}</code>
          <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${val}</span>
          <div role="cell" style="height:6px;background:var(--ds-color-bg-muted);border-radius:2px;max-width:min(${val},100%)"></div>
        </div>`)}
    </div>
  </div>

  <div style="display:grid;gap:var(--ds-space-3)">
    <h3 style="margin:0;font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Z-index</h3>
    <div role="table" style="display:grid;gap:0">
      ${ZINDEX_STEPS.map(([name, val], i) => html`
        <div role="row" style="display:grid;grid-template-columns:9rem 4rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
          <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">z-index-${name}</code>
          <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${val}</span>
          <span role="cell" style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${ZINDEX_USE[name]}</span>
        </div>`)}
    </div>
  </div>
</section>`,
};
