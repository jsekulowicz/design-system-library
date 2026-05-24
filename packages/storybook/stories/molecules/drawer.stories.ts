import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/drawer/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/select/define';
import '@jsekulowicz/ds-components/text-field/define';

const meta: Meta = {
  title: 'Molecules/Drawer',
  component: 'ds-drawer',
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    side: { control: { type: 'inline-radio' }, options: ['start', 'end'] },
    dismissible: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { size: 'sm', side: 'end', dismissible: true, label: '' },
};

export default meta;
type Story = StoryObj;

function openDrawer(event: Event): void {
  const button = event.currentTarget as HTMLElement;
  const drawer = button.parentElement?.querySelector('ds-drawer') as HTMLElement & {
    show: () => void;
  };
  drawer?.show();
}

function closeNearestDrawer(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  const drawer = target.closest('ds-drawer') as HTMLElement & {
    close: (returnValue?: string) => void;
  };
  drawer?.close();
}

export const Playground: Story = {
  render: (args) => html`
    <div>
      <ds-button @ds-click=${openDrawer}>Open drawer</ds-button>
      <ds-drawer
        size=${args['size']}
        side=${args['side']}
        ?dismissible=${args['dismissible']}
        label=${args['label']}
      >
        <span slot="title">Drawer title</span>
        <p>Body content goes here. Scrolls when it overflows.</p>
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDrawer}>
          Close
        </ds-button>
      </ds-drawer>
    </div>
  `,
};

const sizeOptions = [
  { value: 'any', label: 'Any size' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const difficultyOptions = [
  { value: 'any', label: 'Any difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const WithFormFields: Story = {
  name: 'With form fields (filter panel)',
  parameters: {
    docs: {
      description: {
        story:
          'A typical filter panel: title + close pinned at the top, scrollable form body, footer with Reset / Apply. Tab through the selects — focus rings paint fully on all sides, same as the dialog body.',
      },
    },
  },
  render: () => html`
    <div>
      <ds-button @ds-click=${openDrawer}>Open filters</ds-button>
      <ds-drawer side="end" size="sm" label="Filters">
        <span slot="title">Filters</span>
        <div class="form">
          <ds-select label="Size" .options=${sizeOptions} value="any"></ds-select>
          <ds-select label="Difficulty" .options=${difficultyOptions} value="any"></ds-select>
          <ds-text-field label="Theme" placeholder="e.g. food, travel"></ds-text-field>
        </div>
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDrawer}>
          Reset
        </ds-button>
        <ds-button slot="footer" variant="primary" @ds-click=${closeNearestDrawer}>
          Apply
        </ds-button>
      </ds-drawer>
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

export const ScrollingBody: Story = {
  render: () => html`
    <div>
      <ds-button @ds-click=${openDrawer}>Open scrolling drawer</ds-button>
      <ds-drawer side="end" size="sm">
        <span slot="title">Long content</span>
        ${Array.from(
          { length: 24 },
          (_, i) => html`<p>
            Section ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>`,
        )}
        <ds-button slot="footer" variant="ghost" @ds-click=${closeNearestDrawer}>
          Close
        </ds-button>
      </ds-drawer>
    </div>
  `,
};
