import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/carousel/define';
import '@jsekulowicz/ds-components/card/define';

const TOPICS = ['Getting started', 'Layout', 'Typography', 'Color', 'Motion', 'Forms', 'Navigation', 'Feedback'];

function renderCards(names: readonly string[]) {
  return names.map(
    (name) => html`
      <ds-card elevation="sm">
        <span slot="eyebrow">Guide</span>
        <span slot="title">${name}</span>
        A short introduction to ${name.toLowerCase()}.
      </ds-card>
    `,
  );
}

const meta: Meta = {
  title: 'Layout/Carousel',
  component: 'ds-carousel',
  argTypes: {
    label: { control: 'text' },
    roleDescription: { control: 'text' },
    prevLabel: { control: 'text' },
    nextLabel: { control: 'text' },
  },
  args: {
    label: 'Featured guides',
    roleDescription: 'carousel',
    prevLabel: 'Scroll back',
    nextLabel: 'Scroll forward',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-carousel
      .label=${args['label']}
      .roleDescription=${args['roleDescription']}
      .prevLabel=${args['prevLabel']}
      .nextLabel=${args['nextLabel']}
    >
      ${renderCards(TOPICS)}
    </ds-carousel>
  `,
};

export const EverythingFits: Story = {
  render: () => html`<ds-carousel label="Featured guides">${renderCards(TOPICS.slice(0, 2))}</ds-carousel>`,
};

export const NextItemPeeksOnNarrowScreens: Story = {
  render: () => html`
    <ds-carousel label="Featured guides" style="--ds-carousel-item-width:min(16rem, 80%)">
      ${renderCards(TOPICS)}
    </ds-carousel>
  `,
};

export const TightGap: Story = {
  render: () => html`
    <ds-carousel label="Featured guides" style="--ds-carousel-gap:var(--ds-space-2)">
      ${renderCards(TOPICS)}
    </ds-carousel>
  `,
};
