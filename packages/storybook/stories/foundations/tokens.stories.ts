import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { radius, shadow, border, duration, easing, breakpoint, container, zIndex } from '@jsekulowicz/ds-tokens';
import { bodyRow, GROUP_LABEL, joinStyles, MONO_MUTED_CELL, NUM_CELL, TABLE } from '../shared/styles';

const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: { docs: { story: { inline: true } } },
};

export default meta;
type Story = StoryObj;

function radiusSwatch(val: string): string {
  return joinStyles(
    'width:56px;height:56px',
    'background:var(--ds-color-accent-subtle)',
    'border:1.5px solid var(--ds-color-accent)',
    `border-radius:${val}`,
  );
}

function shadowSwatch(name: string): string {
  return joinStyles(
    'height:64px',
    'background:var(--ds-color-bg)',
    'border-radius:var(--ds-radius-md)',
    `box-shadow:var(--ds-shadow-${name})`,
  );
}

function barSwatch(val: string): string {
  return joinStyles(
    'height:6px',
    'background:var(--ds-color-accent-subtle)',
    'border:1px solid var(--ds-color-accent)',
    'border-radius:2px',
    `max-width:${val}`,
  );
}

const RADIUS_STEPS = Object.entries(radius) as [string, string][];
const SHADOW_STEPS = Object.entries(shadow) as [string, string][];
const BORDER_STEPS = Object.entries(border) as [string, string][];

export const Shape: Story = {
  render: () =>
    html` <section style="display:grid;gap:var(--ds-space-8);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
      <div style="display:grid;gap:var(--ds-space-4)">
        <h3 style=${GROUP_LABEL}>Radius</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:var(--ds-space-3)">
          ${RADIUS_STEPS.map(
            ([name, val]) =>
              html` <div style="display:grid;gap:var(--ds-space-2);align-items:start">
                <div style=${radiusSwatch(val)}></div>
                <div>
                  <code style="display:block;font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                    >radius-${name}</code
                  >
                  <span style="font-size:var(--ds-font-size-body-sm);color:var(--ds-color-fg-muted)">${val}</span>
                </div>
              </div>`,
          )}
        </div>
      </div>

      <div style="display:grid;gap:var(--ds-space-4)">
        <h3 style=${GROUP_LABEL}>Shadow</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--ds-space-5)">
          ${SHADOW_STEPS.map(
            ([name]) =>
              html` <div style="display:grid;gap:var(--ds-space-3)">
                <div style=${shadowSwatch(name)}></div>
                <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                  >shadow-${name}</code
                >
              </div>`,
          )}
        </div>
      </div>

      <div style="display:grid;gap:var(--ds-space-4)">
        <h3 style=${GROUP_LABEL}>Border width</h3>
        <div style=${TABLE}>
          ${BORDER_STEPS.map(
            ([name, val], i) =>
              html` <div style=${bodyRow('9rem 4rem 1fr', i)}>
                <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                  >border-${name}</code
                >
                <span style=${NUM_CELL}>${val}</span>
                <div style="height:${val};background:var(--ds-color-fg);border-radius:1px;max-width:120px"></div>
              </div>`,
          )}
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
  render: () =>
    html` <section style="display:grid;gap:var(--ds-space-8);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Duration</h3>
        <div role="table" style=${TABLE}>
          ${DURATION_STEPS.map(
            ([name, val], i) =>
              html` <div role="row" style=${bodyRow('9rem 4.5rem 1fr', i)}>
                <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                  >duration-${name}</code
                >
                <span role="cell" style=${NUM_CELL}>${val}</span>
                <span role="cell" style="font-size:var(--ds-font-size-body-sm);color:var(--ds-color-fg-muted)"
                  >${DURATION_USE[name]}</span
                >
              </div>`,
          )}
        </div>
      </div>

      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Easing</h3>
        <div role="table" style=${TABLE}>
          ${EASING_STEPS.map(
            ([name, val], i) =>
              html` <div role="row" style=${bodyRow('9rem 1fr 1fr', i)}>
                <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                  >easing-${name}</code
                >
                <code role="cell" style=${MONO_MUTED_CELL}>${val}</code>
                <span role="cell" style="font-size:var(--ds-font-size-body-sm);color:var(--ds-color-fg-muted)"
                  >${EASING_USE[name]}</span
                >
              </div>`,
          )}
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
  render: () =>
    html` <section style="display:grid;gap:var(--ds-space-8);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Breakpoints</h3>
        <div role="table" style=${TABLE}>
          ${BREAKPOINT_STEPS.map(
            ([name, val], i) =>
              html` <div role="row" style=${bodyRow('7rem 6rem 1fr', i)}>
                <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                  >breakpoint-${name}</code
                >
                <span role="cell" style=${NUM_CELL}>${val}</span>
                <div role="cell" style=${barSwatch(val)}></div>
              </div>`,
          )}
        </div>
      </div>

      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Container max-widths</h3>
        <div role="table" style=${TABLE}>
          ${CONTAINER_STEPS.map(
            ([name, val], i) =>
              html` <div role="row" style=${bodyRow('7rem 4.5rem 1fr', i)}>
                <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                  >container-${name}</code
                >
                <span role="cell" style=${NUM_CELL}>${val}</span>
                <div
                  role="cell"
                  style="height:6px;background:var(--ds-color-bg-muted);border-radius:2px;max-width:min(${val},100%)"
                ></div>
              </div>`,
          )}
        </div>
      </div>

      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Z-index</h3>
        <div role="table" style=${TABLE}>
          ${ZINDEX_STEPS.map(
            ([name, val], i) =>
              html` <div role="row" style=${bodyRow('9rem 4rem 1fr', i)}>
                <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)"
                  >z-index-${name}</code
                >
                <span role="cell" style=${NUM_CELL}>${val}</span>
                <span role="cell" style="font-size:var(--ds-font-size-body-sm);color:var(--ds-color-fg-muted)"
                  >${ZINDEX_USE[name]}</span
                >
              </div>`,
          )}
        </div>
      </div>
    </section>`,
};
