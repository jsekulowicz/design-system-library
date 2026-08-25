import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/dialog/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/checkbox/define';
import '@jsekulowicz/ds-components/select/define';
import '@jsekulowicz/ds-components/text-field/define';

const meta: Meta = {
  title: 'Overlays/Dialog',
  component: 'ds-dialog',
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
      <ds-dialog size=${args['size']} ?dismissible=${args['dismissible']} label=${args['label']}>
        <span slot="title">Confirm action</span>
        <p>Are you sure you want to proceed? This action cannot be undone.</p>
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDialog}> Cancel </ds-button>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}> Confirm </ds-button>
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
          (_, i) =>
            html`<p>
              Section ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>`,
        )}
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDialog}> Decline </ds-button>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}> Accept </ds-button>
      </ds-dialog>
    </div>
  `,
};

const sampleOptions = [
  { value: 'any', label: 'Any format' },
  { value: 'brief', label: 'Brief' },
  { value: 'standard', label: 'Standard' },
  { value: 'detailed', label: 'Detailed' },
];

const sampleSizes = [
  { value: 'any', label: 'Any layout' },
  { value: 'compact', label: 'Compact' },
  { value: 'standard', label: 'Standard' },
  { value: 'spacious', label: 'Spacious' },
];

export const WithFormFields: Story = {
  name: 'With form fields (focus-ring sanity check)',
  parameters: {
    docs: {
      description: {
        story:
          'Selects and text fields fill the dialog body inline-wise, so their focus rings sit right at the body clip edge. Tab through the controls - the ring must paint fully on all sides. If the left/right sides are shaved off, the body clip-overflow fix has regressed.',
      },
    },
  },
  render: () => html`
    <div>
      <ds-button @ds-click=${openDialog}>Open form dialog</ds-button>
      <ds-dialog size="sm" label="Choose a report template">
        <span slot="title">Choose a template</span>
        <p>Set a few preferences and we'll suggest a suitable report template.</p>
        <div class="form">
          <ds-select label="Format" .options=${sampleOptions} value="any"></ds-select>
          <ds-select label="Layout" .options=${sampleSizes} value="any"></ds-select>
          <ds-text-field
            label="Topic"
            description="Optional - leave blank for any topic"
            placeholder="e.g. finance, operations"
          ></ds-text-field>
        </div>
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDialog}> Cancel </ds-button>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}> Choose template </ds-button>
      </ds-dialog>
      <style>
        .form {
          display: flex;
          flex-direction: column;
          gap: var(--ds-space-3);
        }
      </style>
    </div>
  `,
};

export const TrailingCheckbox: Story = {
  name: 'Trailing checkbox (phantom scroll-fade check)',
  parameters: {
    docs: {
      description: {
        story:
          'The body ends with a `ds-checkbox` and otherwise fits. The checkbox must not overflow its own box: if it does, the body counts as scrollable and the fade mask paints a full `--ds-scroll-fade-depth` over the checkbox row, which then looks cut off.',
      },
    },
  },
  render: () => html`
    <div>
      <ds-button @ds-click=${openDialog}>Open dialog</ds-button>
      <ds-dialog size="sm" label="Report a problem">
        <span slot="title">Report a problem</span>
        <p>Tell us what went wrong and we'll take a look.</p>
        <ds-checkbox>Include a copy of the diagnostic report</ds-checkbox>
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDialog}> Cancel </ds-button>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}> Send </ds-button>
      </ds-dialog>
    </div>
  `,
};

export const CustomMaxHeight: Story = {
  name: 'Custom max height',
  parameters: {
    docs: {
      description: {
        story:
          'Apps that need a tighter cap than the default `min(90vh, 720px)` - to stay clear of phone toolbars, say - set `--ds-dialog-max-height`. The dialog and its card share the property, so the card can never outgrow the dialog box.',
      },
    },
  },
  render: () => html`
    <div style="--ds-dialog-max-height: 320px">
      <ds-button @ds-click=${openDialog}>Open capped dialog</ds-button>
      <ds-dialog>
        <span slot="title">Terms of service</span>
        ${Array.from(
          { length: 12 },
          (_, i) => html`<p>Section ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
        )}
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}> Accept </ds-button>
      </ds-dialog>
    </div>
  `,
};

export const NotDismissible: Story = {
  render: () => html`
    <div>
      <ds-button @ds-click=${openDialog}>Open blocking dialog</ds-button>
      <ds-dialog ?dismissible=${false}>
        <span slot="title">Saving changes...</span>
        <p>The Escape key and backdrop are disabled. Choose an action to continue.</p>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDialog}> Got it </ds-button>
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
