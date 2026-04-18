import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Atoms/Button',
  component: 'ds-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Primary, unambiguous action trigger. One per surface for the default path; everything else is secondary or ghost.

## Anatomy

A native \`<button>\` in shadow DOM, styled via \`::part(button)\`. Slots for \`leading\` / \`trailing\` adornments. \`type="submit"\` walks up to the closest \`<form>\` via \`requestSubmit()\` so it participates in native validation.

## Do

- Use one \`primary\` per surface — the clearest next step for the user.
- Use \`ghost\` for low-emphasis actions that live among other content.
- Pair \`loading\` with optimistic copy ("Saving…") so the label still communicates progress.

## Don't

- Don't stack two \`primary\` buttons in the same action row.
- Don't use \`danger\` for destructive-but-recoverable actions — reserve it for irreversible ones.
- Don't disable without explanation. Prefer keeping it enabled and surfacing the error.

## Accessibility

- \`aria-busy\` reflects \`loading\`.
- Disabled + loading prevent \`ds-click\` from firing.
- Focus ring uses \`:focus-visible\`; never suppressed.
- Keyboard: \`Enter\` and \`Space\` activate via native \`<button>\` semantics.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    type: {
      control: { type: 'inline-radio' },
      options: ['button', 'submit', 'reset'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    responsive: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
    responsive: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-button
      variant=${args.variant}
      size=${args.size}
      type=${args.type}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args.fullWidth}
      ?responsive=${args.responsive}
      >Ship it</ds-button
    >
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--ds-space-3);flex-wrap:wrap">
      <ds-button variant="primary">Primary</ds-button>
      <ds-button variant="secondary">Secondary</ds-button>
      <ds-button variant="ghost">Ghost</ds-button>
      <ds-button variant="danger">Danger</ds-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--ds-space-3);align-items:center">
      <ds-button size="sm">Small</ds-button>
      <ds-button size="md">Medium</ds-button>
      <ds-button size="lg">Large</ds-button>
    </div>
  `,
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => html`
    <ds-button ?loading=${args.loading}>Saving…</ds-button>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => html`
    <ds-button ?disabled=${args.disabled}>Unavailable</ds-button>
  `,
};
