import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/menu-button/define';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Molecules/MenuButton',
  component: 'ds-menu-button',
  tags: ['!dev'],
  decorators: [
    (story) => html`<div style="padding: 4px 6px 240px;">${story()}</div>`,
  ],
  parameters: {
    docs: {
      story: { height: '320px' },
    },
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: { type: 'inline-radio' }, options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    placement: {
      control: { type: 'inline-radio' },
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Actions',
    variant: 'secondary',
    size: 'md',
    placement: 'bottom-start',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

function logSelect(event: Event): void {
  const detail = (event as CustomEvent<{ value: string }>).detail;
  console.log('ds-select →', detail.value);
}

export const Playground: Story = {
  render: (args) => html`
    <ds-menu-button
      label=${args['label']}
      variant=${args['variant']}
      size=${args['size']}
      placement=${args['placement']}
      ?disabled=${args['disabled']}
      @ds-select=${logSelect}
    >
      <ds-menu-item value="duplicate">Duplicate</ds-menu-item>
      <ds-menu-item value="rename">Rename</ds-menu-item>
      <ds-menu-item value="archive">Archive</ds-menu-item>
      <ds-menu-item value="delete">Delete</ds-menu-item>
    </ds-menu-button>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <ds-menu-button label="View" @ds-select=${logSelect}>
      <ds-menu-item value="grid">
        <svg slot="leading" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
        </svg>
        Grid
      </ds-menu-item>
      <ds-menu-item value="list">
        <svg slot="leading" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M2 3h12v2H2zM2 7h12v2H2zM2 11h12v2H2z" />
        </svg>
        List
      </ds-menu-item>
      <ds-menu-item value="kanban">
        <svg slot="leading" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M2 2h3v12H2zM6.5 2h3v8h-3zM11 2h3v6h-3z" />
        </svg>
        Board
      </ds-menu-item>
    </ds-menu-button>
  `,
};

export const SlottedIconTrigger: Story = {
  name: 'With slotted icon trigger',
  render: () => html`
    <ds-menu-button menu-label="Row actions" @ds-select=${logSelect}>
      <ds-button slot="trigger" variant="ghost" size="sm" aria-label="Row actions">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="13" cy="8" r="1.5" />
        </svg>
      </ds-button>
      <ds-menu-item value="edit">Edit</ds-menu-item>
      <ds-menu-item value="duplicate">Duplicate</ds-menu-item>
      <ds-menu-item value="delete">Delete</ds-menu-item>
    </ds-menu-button>
  `,
};

export const WithHeaderFooter: Story = {
  render: () => html`
    <ds-menu-button label="Workspace" @ds-select=${logSelect}>
      <span slot="header">Switch to</span>
      <ds-menu-item value="acme">Acme Corp</ds-menu-item>
      <ds-menu-item value="globex">Globex</ds-menu-item>
      <ds-menu-item value="initech">Initech</ds-menu-item>
      <span slot="footer">
        <ds-menu-item value="manage">Manage workspaces…</ds-menu-item>
      </span>
    </ds-menu-button>
  `,
};

export const WithShortcuts: Story = {
  render: () => html`
    <ds-menu-button label="File" @ds-select=${logSelect}>
      <ds-menu-item value="new">
        New
        <span slot="trailing" style="font-size:var(--ds-font-size-2xs);color:var(--ds-color-fg-subtle)">⌘N</span>
      </ds-menu-item>
      <ds-menu-item value="open">
        Open
        <span slot="trailing" style="font-size:var(--ds-font-size-2xs);color:var(--ds-color-fg-subtle)">⌘O</span>
      </ds-menu-item>
      <ds-menu-item value="save">
        Save
        <span slot="trailing" style="font-size:var(--ds-font-size-2xs);color:var(--ds-color-fg-subtle)">⌘S</span>
      </ds-menu-item>
    </ds-menu-button>
  `,
};

export const Placements: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:160px 32px;padding:160px 32px;">
      <ds-menu-button label="Bottom start" placement="bottom-start" @ds-select=${logSelect}>
        <ds-menu-item value="a">Option A</ds-menu-item>
        <ds-menu-item value="b">Option B</ds-menu-item>
      </ds-menu-button>
      <ds-menu-button label="Bottom end" placement="bottom-end" @ds-select=${logSelect}>
        <ds-menu-item value="a">Option A</ds-menu-item>
        <ds-menu-item value="b">Option B</ds-menu-item>
      </ds-menu-button>
      <ds-menu-button label="Top start" placement="top-start" @ds-select=${logSelect}>
        <ds-menu-item value="a">Option A</ds-menu-item>
        <ds-menu-item value="b">Option B</ds-menu-item>
      </ds-menu-button>
      <ds-menu-button label="Top end" placement="top-end" @ds-select=${logSelect}>
        <ds-menu-item value="a">Option A</ds-menu-item>
        <ds-menu-item value="b">Option B</ds-menu-item>
      </ds-menu-button>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-menu-button label="Actions" disabled>
      <ds-menu-item value="x">Won't open</ds-menu-item>
    </ds-menu-button>
  `,
};
