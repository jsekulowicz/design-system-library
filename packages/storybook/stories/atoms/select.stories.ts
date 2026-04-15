import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/select/define';

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Operations', value: 'ops' },
];

const meta: Meta = {
  title: 'Atoms/Select',
  component: 'ds-select',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => html`
    <ds-select
      placeholder="Pick a discipline"
      .options=${options}
    ></ds-select>
  `,
};

export const Preselected: Story = {
  render: () => html`
    <ds-select .options=${options} value="engineering"></ds-select>
  `,
};
