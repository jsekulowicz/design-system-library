import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/step-list/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/arrow-path';

import {
  CHECKOUT_STEPS,
  LABEL_ONLY_STEPS,
  DISABLED_STEPS,
  LONG_LABEL_STEPS,
  moveToTheSelectedStep,
  startOverFromTheFirstStep,
} from './step-list.examples.js';
import { stepListSourceParameters } from './step-list.source.js';

const meta: Meta = {
  title: 'Navigation/StepList',
  component: 'ds-step-list',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: stepListSourceParameters({ currentIndex: 1, label: 'Steps', compact: false }),
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
  parameters: stepListSourceParameters({ currentIndex: 0 }),
  render: function render() {
    return html` <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${0}></ds-step-list> `;
  },
};

export const LastStep: Story = {
  parameters: stepListSourceParameters({ currentIndex: 3 }),
  render: function render() {
    return html` <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${3}></ds-step-list> `;
  },
};

export const WithoutDescriptions: Story = {
  parameters: stepListSourceParameters({ steps: LABEL_ONLY_STEPS, currentIndex: 1 }),
  render: function render() {
    return html` <ds-step-list .steps=${LABEL_ONLY_STEPS} .currentIndex=${1}></ds-step-list> `;
  },
};

export const WithAStepTheAnswersRuledOut: Story = {
  parameters: stepListSourceParameters({ steps: DISABLED_STEPS, currentIndex: 3 }),
  render: function render() {
    return html` <ds-step-list .steps=${DISABLED_STEPS} .currentIndex=${3}></ds-step-list> `;
  },
};

export const SwitchesToCompactWhenTheRowDoesNotFit: Story = {
  parameters: stepListSourceParameters({
    steps: LONG_LABEL_STEPS,
    currentIndex: 1,
    containerStyle: 'inline-size: 60rem; max-inline-size: 100%; resize: horizontal; overflow: auto',
  }),
  render: function render() {
    return html`
      <div style="inline-size: 60rem; max-inline-size: 100%; resize: horizontal; overflow: auto">
        <ds-step-list .steps=${LONG_LABEL_STEPS} .currentIndex=${1}></ds-step-list>
      </div>
    `;
  },
};

export const CompactWithAStepTheAnswersRuledOut: Story = {
  parameters: stepListSourceParameters({ steps: DISABLED_STEPS, currentIndex: 1, compact: true }),
  render: function render() {
    return html` <ds-step-list .steps=${DISABLED_STEPS} .currentIndex=${1} compact></ds-step-list> `;
  },
};

export const CompactInANarrowContainer: Story = {
  parameters: stepListSourceParameters({ currentIndex: 2, containerStyle: 'max-width: 22rem' }),
  render: function render() {
    return html`
      <div style="max-width: 22rem">
        <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${2}></ds-step-list>
      </div>
    `;
  },
};

export const CompactForcedAtAnyWidth: Story = {
  parameters: stepListSourceParameters({ currentIndex: 2, compact: true }),
  render: function render() {
    return html` <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${2} compact></ds-step-list> `;
  },
};

export const StartingOverFromTheTrailingSlot: Story = {
  parameters: stepListSourceParameters({ currentIndex: 2, interactive: true, trailing: true }),
  render: function render() {
    return html`
      <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${2} @ds-step-select=${moveToTheSelectedStep}>
        <ds-button slot="trailing" variant="ghost" size="sm" @click=${startOverFromTheFirstStep}>
          <ds-icon slot="leading" name="arrow-path" size="lg"></ds-icon>
          Start over
        </ds-button>
      </ds-step-list>
    `;
  },
};

export const MovingToAnyEnabledStep: Story = {
  parameters: stepListSourceParameters({ currentIndex: 3, interactive: true }),
  render: function render() {
    return html`
      <ds-step-list .steps=${CHECKOUT_STEPS} .currentIndex=${3} @ds-step-select=${moveToTheSelectedStep}></ds-step-list>
    `;
  },
};
