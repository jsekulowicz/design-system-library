import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/breadcrumb/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/home';

const meta: Meta = {
  title: 'Atoms/Breadcrumb',
  component: 'ds-breadcrumb',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Breadcrumb',
  },
  render: function render(args) {
    return html`
    <ds-breadcrumb .label=${args['label']}>
      <ds-breadcrumb-item href="/">Home</ds-breadcrumb-item>
      <ds-breadcrumb-item href="/products">Products</ds-breadcrumb-item>
      <ds-breadcrumb-item>Widget</ds-breadcrumb-item>
    </ds-breadcrumb>
  `;
  },
};

export const ItemPlayground: Story = {
  argTypes: {
    label: { table: { disable: true } },
    href: { control: 'text', table: { type: { summary: 'string' } } },
    target: {
      control: 'select',
      options: [undefined, '_self', '_blank', '_parent', '_top'],
      table: { type: { summary: '_self | _blank | _parent | _top' } },
    },
    rel: { control: 'text', table: { type: { summary: 'string' } } },
    download: { control: 'text', table: { type: { summary: 'string' } } },
    hreflang: { control: 'text', table: { type: { summary: 'string' } } },
    type: { control: 'text', table: { type: { summary: 'string' } } },
    referrerpolicy: { control: 'text', table: { type: { summary: 'string' } } },
    current: {
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    last: {
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  args: {
    href: '/products',
    current: false,
    last: false,
  },
  render: function render(args) {
    return html`
      <ol role="list">
        <ds-breadcrumb-item
          .href=${args['href']}
          .target=${args['target']}
          .rel=${args['rel']}
          .download=${args['download']}
          .hreflang=${args['hreflang']}
          .type=${args['type']}
          .referrerpolicy=${args['referrerpolicy']}
          ?current=${args['current']}
          ?last=${args['last']}
        >
          Products
        </ds-breadcrumb-item>
      </ol>
    `;
  },
};

export const WithHomeIcon: Story = {
  render: () => html`
    <ds-breadcrumb>
      <ds-breadcrumb-item href="/">
        <ds-icon slot="leading" name="home" size="lg"></ds-icon>
        Home
      </ds-breadcrumb-item>
      <ds-breadcrumb-item href="/products">Products</ds-breadcrumb-item>
      <ds-breadcrumb-item href="/products/audio">Audio</ds-breadcrumb-item>
      <ds-breadcrumb-item>Headphones</ds-breadcrumb-item>
    </ds-breadcrumb>
  `,
};

export const DeepTrail: Story = {
  render: () => html`
    <ds-breadcrumb>
      <ds-breadcrumb-item href="/">Home</ds-breadcrumb-item>
      <ds-breadcrumb-item href="/org">Acme</ds-breadcrumb-item>
      <ds-breadcrumb-item href="/org/teams">Teams</ds-breadcrumb-item>
      <ds-breadcrumb-item href="/org/teams/platform">Platform</ds-breadcrumb-item>
      <ds-breadcrumb-item href="/org/teams/platform/projects">Projects</ds-breadcrumb-item>
      <ds-breadcrumb-item>Q2 Roadmap</ds-breadcrumb-item>
    </ds-breadcrumb>
  `,
};

export const SingleCurrent: Story = {
  render: () => html`
    <ds-breadcrumb>
      <ds-breadcrumb-item>Dashboard</ds-breadcrumb-item>
    </ds-breadcrumb>
  `,
};

export const OpensInNewTab: Story = {
  render: () => html`
    <ds-breadcrumb>
      <ds-breadcrumb-item href="https://example.com" target="_blank" rel="noopener">
        External docs
      </ds-breadcrumb-item>
      <ds-breadcrumb-item href="/guide">Guide</ds-breadcrumb-item>
      <ds-breadcrumb-item>Getting started</ds-breadcrumb-item>
    </ds-breadcrumb>
  `,
};
