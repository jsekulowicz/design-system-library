import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/menu-button/define';
import '@jsekulowicz/ds-components/button/define';

const meta: Meta = {
  title: 'Molecules/MenuButton',
  component: 'ds-menu-button',
  decorators: [(story) => html`<div style="padding: 4px 6px;">${story()}</div>`],
  parameters: {
    docs: {
      story: { height: '220px' },
    },
  },
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    placement: {
      control: { type: 'inline-radio' },
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Edit',
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

const PENCIL_ICON = html`<svg
  viewBox="0 0 16 16"
  width="16"
  height="16"
  fill="currentColor"
  aria-hidden="true"
>
  <path
    d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.756l8.61-8.61Z"
  />
</svg>`;

const CHEVRON_DOWN_ICON = html`<svg
  viewBox="0 0 16 16"
  width="16"
  height="16"
  fill="currentColor"
  aria-hidden="true"
>
  <path
    fill-rule="evenodd"
    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
    clip-rule="evenodd"
  />
</svg>`;

const PLAYGROUND_SOURCE = `<ds-menu-button placement="bottom-start">
  <ds-button slot="trigger" variant="secondary" size="md">
    <svg slot="leading" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">…</svg>
    Edit
    <svg slot="trailing" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">…</svg>
  </ds-button>
  <ds-menu-item value="duplicate">Duplicate</ds-menu-item>
  <ds-menu-item value="rename">Rename</ds-menu-item>
  <ds-menu-item value="archive">Archive</ds-menu-item>
  <ds-menu-item value="delete">Delete</ds-menu-item>
</ds-menu-button>`;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `slot="trigger"` to put a `ds-button` (or any element) inside the trigger. The component wires up `aria-haspopup`, `aria-expanded`, `aria-controls`, click, and keyboard handling automatically — so the slotted button is free to use its own `leading` / `trailing` slots for icons.',
      },
      source: { code: PLAYGROUND_SOURCE },
    },
  },
  render: (args) => html`
    <ds-menu-button
      placement=${args['placement']}
      ?disabled=${args['disabled']}
      @ds-select=${logSelect}
    >
      <ds-button
        slot="trigger"
        variant=${args['variant']}
        size=${args['size']}
        ?disabled=${args['disabled']}
      >
        <span slot="leading">${PENCIL_ICON}</span>
        ${args['label']}
        <span slot="trailing">${CHEVRON_DOWN_ICON}</span>
      </ds-button>
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
        <svg
          slot="leading"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
        </svg>
        Grid
      </ds-menu-item>
      <ds-menu-item value="list">
        <svg
          slot="leading"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 3h12v2H2zM2 7h12v2H2zM2 11h12v2H2z" />
        </svg>
        List
      </ds-menu-item>
      <ds-menu-item value="kanban">
        <svg
          slot="leading"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
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
        <span
          slot="trailing"
          style="font-size:var(--ds-font-size-2xs);color:var(--ds-color-fg-subtle)"
          >⌘N</span
        >
      </ds-menu-item>
      <ds-menu-item value="open">
        Open
        <span
          slot="trailing"
          style="font-size:var(--ds-font-size-2xs);color:var(--ds-color-fg-subtle)"
          >⌘O</span
        >
      </ds-menu-item>
      <ds-menu-item value="save">
        Save
        <span
          slot="trailing"
          style="font-size:var(--ds-font-size-2xs);color:var(--ds-color-fg-subtle)"
          >⌘S</span
        >
      </ds-menu-item>
    </ds-menu-button>
  `,
};

export const Placements: Story = {
  parameters: { docs: { story: { height: '260px' } } },
  render: () => html`
    <div
      style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:80px 32px;padding:60px 32px;"
    >
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
  parameters: { docs: { story: { height: '60px' } } },
  render: () => html`
    <ds-menu-button label="Actions" disabled>
      <ds-menu-item value="x">Won't open</ds-menu-item>
    </ds-menu-button>
  `,
};
