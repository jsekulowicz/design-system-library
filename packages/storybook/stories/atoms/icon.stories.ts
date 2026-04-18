import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/icon/define';
import { registerIcon, getIcon } from '@ds/components/icon';

const HEROICONS_CDN = 'https://cdn.jsdelivr.net/npm/heroicons@2/16/solid';

async function fetchHeroicon(name: string): Promise<void> {
  if (!name || getIcon(name)) return;
  try {
    const res = await fetch(`${HEROICONS_CDN}/${name}.svg`);
    if (res.ok) registerIcon(name, await res.text());
  } catch {
    // name may be incomplete while the user is still typing
  }
}

fetchHeroicon('check');
fetchHeroicon('arrow-right');

const meta: Meta = {
  title: 'Atoms/Icon',
  component: 'ds-icon',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Icon** renders SVGs registered via \`registerIcon(name, svgMarkup)\`.
Icons are sourced from **[Heroicons](https://heroicons.com)** by Tailwind Labs (MIT licence).

### Finding icon names

1. Go to **[heroicons.com](https://heroicons.com)**
2. Search or browse to the icon you want
3. Hover over it — the **kebab-case name** appears below (e.g. \`arrow-right\`, \`magnifying-glass\`, \`x-mark\`)
4. Use that name in the playground or your code

The playground fetches from the **16 px · Solid** variant.

### Using icons in your project

Import only the icons you need — each module self-registers on import, so only imported icons end up in your bundle:

\`\`\`ts
import '@ds/components/icon/check';
import '@ds/components/icon/minus';
\`\`\`

\`\`\`html
<ds-icon name="check"></ds-icon>
\`\`\`

To register a custom icon or use a different Heroicons variant, call \`registerIcon\` directly:

\`\`\`ts
import { registerIcon } from '@ds/components/icon';
registerIcon('my-icon', '<svg viewBox="0 0 16 16" fill="currentColor">...</svg>');
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Heroicon name in kebab-case. Browse all icons at [heroicons.com](https://heroicons.com).',
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  args: { name: 'check', size: 'md', label: '' },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  loaders: [
    async ({ args }) => {
      await fetchHeroicon(args.name as string);
      return {};
    },
  ],
  render: (args) => html`
    <ds-icon name=${args.name} size=${args.size} label=${args.label}></ds-icon>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--ds-space-3);align-items:center">
      <ds-icon name="arrow-right" size="sm"></ds-icon>
      <ds-icon name="arrow-right" size="md"></ds-icon>
      <ds-icon name="arrow-right" size="lg"></ds-icon>
    </div>
  `,
};
