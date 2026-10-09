import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/step-list/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/arrow-path';

const CHECKOUT_STEPS = [
  { label: 'Contact', description: 'Name and email' },
  { label: 'Shipping', description: 'Where it goes' },
  { label: 'Payment', description: 'How you pay' },
  { label: 'Review' },
];

interface StepListElement extends HTMLElement {
  currentIndex: number;
}

function moveToTheSelectedStep(event: Event): void {
  const list = event.currentTarget as StepListElement;
  list.currentIndex = (event as CustomEvent<{ index: number }>).detail.index;
}

function startOverFromTheFirstStep(event: Event): void {
  const list = (event.currentTarget as HTMLElement).closest<StepListElement>('ds-step-list');
  if (list) {
    list.currentIndex = 0;
  }
}

const meta: Meta = {
  title: 'Navigation/StepList',
  component: 'ds-step-list',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  argTypes: {
    currentIndex: { control: { type: 'number', min: 0, max: 3, step: 1 } },
    label: { control: 'text' },
    compact: { control: 'boolean' },
  },
  args: {
    currentIndex: 1,
    label: 'Steps',
    compact: false,
  },
  render: function render(args) {
    return html`
      <ds-step-list
        .steps=${CHECKOUT_STEPS}
        .currentIndex=${args['currentIndex']}
        .label=${args['label']}
        ?compact=${args['compact']}
      ></ds-step-list>
    `;
  },
};

export const FirstStep: Story = {
  render: () => html` <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${0}></ds-step-list> `,
};

export const LastStep: Story = {
  render: () => html` <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${3}></ds-step-list> `,
};

export const WithoutDescriptions: Story = {
  render: () => html`
    <ds-step-list
      .steps=${[{ label: 'Details' }, { label: 'Vocabulary' }, { label: 'Summary' }]}
      .currentIndex=${1}
    ></ds-step-list>
  `,
};

export const WithAStepTheAnswersRuledOut: Story = {
  render: () => html`
    <ds-step-list
      .steps=${[
        { label: 'Name', description: 'Required' },
        { label: 'Vocabulary', description: 'Using every word' },
        {
          label: 'Extra words',
          description: 'Unavailable',
          disabled: true,
          reason: 'Narrow the vocabulary first - there is nothing for extra words to add to.',
        },
        { label: 'Summary' },
      ]}
      .currentIndex=${3}
    ></ds-step-list>
  `,
};

export const LabelsWrapWhenTheRowRunsOutOfRoom: Story = {
  render: () => html`
    <div style="inline-size: 50rem">
      <ds-step-list
        .steps=${[
          { label: 'Name and size', description: 'Required' },
          { label: 'Who can open this crossword', description: 'Optional' },
          { label: 'Words this crossword is built from', description: 'Optional' },
          { label: 'Check and finish', description: 'Almost there' },
        ]}
        .currentIndex=${1}
      ></ds-step-list>
    </div>
  `,
};

export const CompactWithAStepTheAnswersRuledOut: Story = {
  render: () => html`
    <ds-step-list
      .steps=${[
        { label: 'Name', description: 'Required' },
        { label: 'Vocabulary', description: 'Using every word' },
        {
          label: 'Extra words',
          description: 'Unavailable',
          disabled: true,
          reason: 'Narrow the vocabulary first - there is nothing for extra words to add to.',
        },
        { label: 'Summary' },
      ]}
      .currentIndex=${1}
      compact
    ></ds-step-list>
  `,
};

export const CompactInANarrowContainer: Story = {
  render: () => html`
    <div style="max-width: 22rem">
      <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${2}></ds-step-list>
    </div>
  `,
};

export const CompactForcedAtAnyWidth: Story = {
  render: () => html` <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${2} compact></ds-step-list> `,
};

export const StartingOverFromTheTrailingSlot: Story = {
  render: () => html`
    <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${2} @ds-step-select=${moveToTheSelectedStep}>
      <ds-button slot="trailing" variant="ghost" size="sm" @click=${startOverFromTheFirstStep}>
        <ds-icon slot="leading" name="arrow-path" size="lg"></ds-icon>
        Start over
      </ds-button>
    </ds-step-list>
  `,
};

export const MovingToAnyEnabledStep: Story = {
  render: () => html`
    <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${3} @ds-step-select=${moveToTheSelectedStep}></ds-step-list>
  `,
};
