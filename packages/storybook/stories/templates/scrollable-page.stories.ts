import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/scrollable-page/define';

const meta: Meta = {
  title: 'Templates/ScrollablePage',
  component: 'ds-scrollable-page',
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, height: '440px' } },
  },
};

export default meta;
type Story = StoryObj;

function activitySections() {
  return Array.from(
    { length: 18 },
    (_, index) => html`
      <section>
        <h2 style="margin:0;font-size:var(--ds-font-size-heading-sm)">
          Activity group ${index + 1}
        </h2>
        <p style="margin:var(--ds-space-1) 0 0;color:var(--ds-color-fg-muted)">
          Recent project and account events appear in this scrolling region.
        </p>
      </section>
    `,
  );
}

export const WithNonScrollingHeader: Story = {
  render: () => html`
    <div style="height:400px">
      <ds-scrollable-page style="height:100%">
        <header slot="header" style="display:grid;gap:var(--ds-space-1)">
          <h1 style="margin:0;font-size:var(--ds-font-size-heading-xl)">Activity</h1>
          <p style="margin:0;color:var(--ds-color-fg-muted)">
            The header remains still while the content can overscroll.
          </p>
        </header>
        ${activitySections()}
      </ds-scrollable-page>
    </div>
  `,
};

export const WithoutHeader: Story = {
  render: () => html`
    <div style="height:400px">
      <ds-scrollable-page style="height:100%">${activitySections()}</ds-scrollable-page>
    </div>
  `,
};
