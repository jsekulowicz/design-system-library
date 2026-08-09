import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/progress-bar/define';

const meta: Meta = {
  title: 'Atoms/Progress Bar',
  component: 'ds-progress-bar',
  argTypes: {
    value: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
  },
  args: { value: 45, max: 100 },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) =>
    html` <div style="max-width:24rem">
        <ds-progress-bar value=${args['value']} max=${args['max']}>
          <div class="counter-container">
            <span class="counter">${args['value']}</span>
            <span>∕</span>
            <span class="counter">${args['max']}</span>
          </div>
        </ds-progress-bar>
      </div>
      <style>
        .counter-container {
          display: flex;
          justify-content: center;
          width: 4rem;
        }

        .counter {
          min-width: 2.5ch;
          text-align: end;
        }
      </style>`,
};

export const WithoutLabel: Story = {
  render: () => html`
    <div style="max-width:24rem">
      <ds-progress-bar value="60"></ds-progress-bar>
    </div>
  `,
};

export const CustomHeightAndColor: Story = {
  render: () => html`
    <div style="max-width:24rem">
      <ds-progress-bar
        class="branded"
        value="350"
        max="500"
        style="--ds-progress-color: var(--ds-color-success); --ds-progress-track-height: 0.375rem;"
        >350 ∕ 500</ds-progress-bar
      >
    </div>
  `,
};
