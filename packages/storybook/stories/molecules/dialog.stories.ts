import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/dialog/define';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Molecules/Dialog',
  component: 'ds-dialog',
  tags: ['!dev'],
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    dismissible: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { size: 'md', dismissible: true, label: '' },
};

export default meta;
type Story = StoryObj;

function openDialog(event: Event): void {
  const button = event.currentTarget as HTMLElement;
  const dialog = button.parentElement?.querySelector('ds-dialog') as HTMLElement & {
    show: () => void;
  };
  dialog?.show();
}

export const Playground: Story = {
  render: (args) => html`
    <div>
      <ds-button @ds-click=${openDialog}>Open dialog</ds-button>
      <ds-dialog
        size=${args['size']}
        ?dismissible=${args['dismissible']}
        label=${args['label']}
      >
        <span slot="title">Confirm action</span>
        <p>
          Are you sure you want to proceed? This action cannot be undone.
        </p>
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDialog}>
          Cancel
        </ds-button>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}>
          Confirm
        </ds-button>
      </ds-dialog>
    </div>
  `,
};

export const ScrollingBody: Story = {
  render: () => html`
    <div>
      <ds-button @ds-click=${openDialog}>Open scrolling dialog</ds-button>
      <ds-dialog>
        <span slot="title">Terms of service</span>
        ${Array.from(
          { length: 24 },
          (_, i) => html`<p>
            Section ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>`,
        )}
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDialog}>
          Decline
        </ds-button>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}>
          Accept
        </ds-button>
      </ds-dialog>
    </div>
  `,
};

export const NotDismissible: Story = {
  render: () => html`
    <div>
      <ds-button @ds-click=${openDialog}>Open blocking dialog</ds-button>
      <ds-dialog ?dismissible=${false}>
        <span slot="title">Saving changes…</span>
        <p>The Escape key and backdrop are disabled. Choose an action to continue.</p>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}>
          Got it
        </ds-button>
      </ds-dialog>
    </div>
  `,
};

function closeNearestDialog(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  const dialog = target.closest('ds-dialog') as HTMLElement & {
    close: (returnValue?: string) => void;
  };
  dialog?.close();
}
