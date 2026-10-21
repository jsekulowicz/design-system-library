import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/progress-bar/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/arrow-up-tray-solid';
import '@jsekulowicz/ds-components/icon/check-circle-solid';
import { joinStyles } from '../shared/styles';

const meta: Meta = {
  title: 'Feedback/Progress Bar',
  component: 'ds-progress-bar',
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    max: { control: { type: 'number' } },
    labelAlign: { control: { type: 'inline-radio' }, options: ['start', 'center', 'end'] },
    color: { control: { type: 'color' } },
  },
  args: { value: 45, max: 100, labelAlign: 'center', color: '#4a72cc' },
};

export default meta;
type Story = StoryObj;

const upload = html`<ds-icon slot="leading" name="arrow-up-tray-solid" size="md"></ds-icon>`;
const check = html`<ds-icon slot="leading" name="check-circle-solid" size="md"></ds-icon>`;

function renderStack(content: unknown) {
  return html`<div style="display: grid; gap: 0.75rem; max-width: 24rem;">${content}</div>`;
}

export const Playground: Story = {
  render: (args) => html`
    <div style="max-width: 24rem">
      <ds-progress-bar
        value=${args['value']}
        max=${args['max']}
        label-align=${args['labelAlign']}
        style="--ds-progress-color: ${args['color']}"
        >${args['value']} / ${args['max']}</ds-progress-bar
      >
    </div>
  `,
};

export const WithALeadingIcon: Story = {
  render: () =>
    renderStack(html`
      <ds-progress-bar value="340" max="700">${upload}Uploading 340 of 700 MB</ds-progress-bar>
      <ds-progress-bar value="0" max="5" style="--ds-progress-color: #b8860b"
        >${check}0 of 5 steps done</ds-progress-bar
      >
    `),
};

export const LabelAlignment: Story = {
  render: () =>
    renderStack(html`
      <ds-progress-bar value="30" label-align="start">${upload}Start</ds-progress-bar>
      <ds-progress-bar value="50">${upload}Center</ds-progress-bar>
      <ds-progress-bar value="70" label-align="end">${upload}End</ds-progress-bar>
    `),
};

export const AnyColorStaysLegible: Story = {
  render: () =>
    renderStack(
      ['#ffdd00', '#00ff66', '#1f7a7a', '#b83280', '#7c5cd6', '#e2341d', '#888888'].map(
        (color, index) =>
          html`<ds-progress-bar value=${20 + index * 12} style="--ds-progress-color: ${color}"
            >${color}</ds-progress-bar
          >`,
      ),
    ),
};

export const SizedToItsLabel: Story = {
  render: () => html`
    <div style="display: grid; justify-items: center;">
      <ds-progress-bar value="12" max="18" style="width: fit-content; --ds-progress-padding-inline: 0.75rem;"
        >12 of 18 tasks complete</ds-progress-bar
      >
    </div>
  `,
};

export const NumbersThatDoNotShift: Story = {
  render: () =>
    renderStack(
      [7, 42, 340].map(
        (value) =>
          html`<ds-progress-bar value=${value} max="700"
            ><span style="display: inline-block; min-width: 3ch; text-align: end;">${value}</span> / 700
            MB</ds-progress-bar
          >`,
      ),
    ),
};

const EXACT_COLORS = joinStyles(
  '--ds-progress-fill-color: #6f8fd0',
  '--ds-progress-empty-color: #faf8f5',
  '--ds-progress-label-color: #0b0b0c',
  '--ds-progress-outline-color: #6b6b6e',
);

export const ExactColors: Story = {
  render: () =>
    renderStack(html`
      <ds-progress-bar value="60" style=${EXACT_COLORS}>Exact colors you check yourself</ds-progress-bar>
    `),
};

export const WithoutLabel: Story = {
  render: () => renderStack(html`<ds-progress-bar value="60" label="Upload progress"></ds-progress-bar>`),
};
