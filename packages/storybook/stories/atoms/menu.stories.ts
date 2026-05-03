import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/menu/define';

const meta: Meta = {
  title: 'Atoms/Menu',
  component: 'ds-menu',
  tags: ['!dev'],
  argTypes: {
    label: { control: 'text' },
  },
  args: { label: 'Actions' },
};

export default meta;
type Story = StoryObj;

function logSelect(event: Event): void {
  const detail = (event as CustomEvent<{ value: string }>).detail;
  console.log('ds-select →', detail.value);
}

export const Playground: Story = {
  render: (args) => html`
    <ds-menu label=${args['label']} @ds-select=${logSelect}>
      <ds-menu-item value="duplicate">Duplicate</ds-menu-item>
      <ds-menu-item value="rename">Rename</ds-menu-item>
      <ds-menu-item value="archive">Archive</ds-menu-item>
      <ds-menu-item value="delete">Delete</ds-menu-item>
    </ds-menu>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <ds-menu label="View" @ds-select=${logSelect}>
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
    </ds-menu>
  `,
};

export const RichItems: Story = {
  render: () => html`
    <ds-menu label="People" @ds-select=${logSelect}>
      <ds-menu-item value="jane">
        <span
          slot="leading"
          style="display:inline-flex;width:32px;height:32px;border-radius:50%;background:var(--ds-color-accent-subtle);align-items:center;justify-content:center;color:var(--ds-color-accent);font-weight:600"
        >JS</span>
        Jane Smith
        <span slot="description">jane@example.com</span>
      </ds-menu-item>
      <ds-menu-item value="alex">
        <span
          slot="leading"
          style="display:inline-flex;width:32px;height:32px;border-radius:50%;background:var(--ds-color-accent-subtle);align-items:center;justify-content:center;color:var(--ds-color-accent);font-weight:600"
        >AC</span>
        Alex Chen
        <span slot="description">alex@example.com</span>
      </ds-menu-item>
    </ds-menu>
  `,
};

export const WithHeaderFooter: Story = {
  render: () => html`
    <ds-menu label="Workspace" @ds-select=${logSelect}>
      <span slot="header">Switch to</span>
      <ds-menu-item value="acme">Acme Corp</ds-menu-item>
      <ds-menu-item value="globex">Globex</ds-menu-item>
      <ds-menu-item value="initech">Initech</ds-menu-item>
      <span slot="footer">
        <ds-menu-item value="manage">Manage workspaces…</ds-menu-item>
      </span>
    </ds-menu>
  `,
};

export const WithDisabled: Story = {
  render: () => html`
    <ds-menu label="Edit" @ds-select=${logSelect}>
      <ds-menu-item value="undo">Undo</ds-menu-item>
      <ds-menu-item value="redo" disabled>Redo</ds-menu-item>
      <ds-menu-item value="cut">Cut</ds-menu-item>
      <ds-menu-item value="copy">Copy</ds-menu-item>
      <ds-menu-item value="paste">Paste</ds-menu-item>
    </ds-menu>
  `,
};

export const WithSelected: Story = {
  render: () => html`
    <ds-menu label="View density" @ds-select=${logSelect}>
      <ds-menu-item value="compact">Compact</ds-menu-item>
      <ds-menu-item value="comfortable" selected>Comfortable</ds-menu-item>
      <ds-menu-item value="spacious">Spacious</ds-menu-item>
    </ds-menu>
  `,
};

export const WithTrailingShortcut: Story = {
  render: () => html`
    <ds-menu label="File" @ds-select=${logSelect}>
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
      <ds-menu-item value="save-as">
        Save As
        <span slot="trailing" style="font-size:var(--ds-font-size-2xs);color:var(--ds-color-fg-subtle)">⇧⌘S</span>
      </ds-menu-item>
    </ds-menu>
  `,
};
