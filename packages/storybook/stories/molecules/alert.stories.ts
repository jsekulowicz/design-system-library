import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/alert/define';

const meta: Meta = {
  title: 'Molecules/Alert',
  component: 'ds-alert',
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['info', 'success', 'warning', 'danger'],
    },
    dismissible: { control: 'boolean' },
  },
  args: {
    tone: 'info',
    heading: 'You are on the beta channel',
    dismissible: true,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-alert
      tone=${args.tone}
      heading=${args.heading}
      ?dismissible=${args.dismissible}
    >
      Expect brittle edges and forthright release notes. Production builds
      flow through the stable channel only.
    </ds-alert>
  `,
};

export const Tones: Story = {
  render: () => html`
    <div style="display:grid;gap:var(--ds-space-3)">
      <ds-alert tone="info" heading="Heads up">Your invoice is ready.</ds-alert>
      <ds-alert tone="success" heading="Shipped">Release 0.1 is live.</ds-alert>
      <ds-alert tone="warning" heading="Almost at limit"
        >You've used 90% of your quota.</ds-alert
      >
      <ds-alert tone="danger" heading="Build failed"
        >The last deploy exited with status 1.</ds-alert
      >
    </div>
  `,
};
