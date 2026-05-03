import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/toast/define';
import '@ds/components/button/define';
import { toast, type ToastPlacement } from '@ds/components/toast';

const meta: Meta = {
  title: 'Molecules/Toast',
  component: 'ds-toast',
  tags: ['!dev'],
  argTypes: {
    tone: { control: { type: 'inline-radio' }, options: ['info', 'success', 'warning', 'danger'] },
    heading: { control: 'text' },
    duration: { control: { type: 'number', min: 0, step: 500 } },
    dismissible: { control: 'boolean' },
  },
  args: { tone: 'info', heading: 'Saved', duration: 5000, dismissible: true },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-toast
      tone=${args['tone']}
      heading=${args['heading']}
      duration=${args['duration']}
      ?dismissible=${args['dismissible']}
    >
      Your changes are live.
    </ds-toast>
  `,
};

export const Tones: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-3);max-width:420px">
      <ds-toast tone="info" heading="Heads up" duration=${0}>
        We've added a new collaborator role.
      </ds-toast>
      <ds-toast tone="success" heading="Saved" duration=${0}>
        Your changes are live.
      </ds-toast>
      <ds-toast tone="warning" heading="Heads up" duration=${0}>
        You have unsaved drafts in another tab.
      </ds-toast>
      <ds-toast tone="danger" heading="Couldn't save" duration=${0}>
        Network error. Please try again.
      </ds-toast>
    </div>
  `,
};

export const WithAction: Story = {
  render: () => html`
    <ds-toast tone="success" heading="Item moved to trash" duration=${0}>
      It will be deleted permanently in 30 days.
      <ds-button slot="actions" variant="ghost" size="sm">Undo</ds-button>
    </ds-toast>
  `,
};

export const StickyDanger: Story = {
  render: () => html`
    <ds-toast tone="danger" heading="Couldn't connect" duration=${0}>
      Check your connection and try again. Sticky until dismissed.
    </ds-toast>
  `,
};

export const Imperative: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--ds-space-2);flex-wrap:wrap">
      <ds-button @ds-click=${() => toast.info('Heads up', { body: 'A new comment was posted.' })}>
        Info
      </ds-button>
      <ds-button @ds-click=${() => toast.success('Saved', { body: 'Your changes are live.' })}>
        Success
      </ds-button>
      <ds-button @ds-click=${() => toast.warning('Heads up', { body: 'Unsaved drafts in another tab.' })}>
        Warning
      </ds-button>
      <ds-button
        @ds-click=${() =>
          toast.danger("Couldn't save", { body: 'Network error. Please try again.' })}
      >
        Danger
      </ds-button>
    </div>
  `,
};

export const Placements: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--ds-space-2);flex-wrap:wrap">
      ${(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as ToastPlacement[]).map(
        (placement) => html`
          <ds-button
            @ds-click=${() =>
              toast.success(`Hello from ${placement}`, {
                body: 'Imperative API can target any corner.',
                placement,
              })}
          >
            ${placement}
          </ds-button>
        `,
      )}
    </div>
  `,
};

export const WithUndoAction: Story = {
  render: () => html`
    <ds-button
      @ds-click=${() => {
        const ctl = toast({
          tone: 'success',
          heading: 'Item moved to trash',
          body: 'It will be deleted permanently in 30 days.',
          duration: 0,
          actions: (controller) => html`
            <ds-button
              variant="ghost"
              size="sm"
              @ds-click=${() => {
                console.log('undo →', controller.id);
                controller.dismiss();
              }}
            >
              Undo
            </ds-button>
          `,
        });
        console.log('shown →', ctl.id);
      }}
    >
      Move to trash
    </ds-button>
  `,
};

export const Stacking: Story = {
  render: () => html`
    <ds-button
      @ds-click=${() => {
        for (let i = 1; i <= 7; i += 1) {
          toast.info(`Notification ${i}`, { body: 'Stack caps at 5; oldest are dropped.' });
        }
      }}
    >
      Fire 7 toasts
    </ds-button>
  `,
};
