import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { PieChartDatum } from '@jsekulowicz/ds-components/pie-chart';
import '@jsekulowicz/ds-components/pie-chart/define';

const TRAFFIC: readonly PieChartDatum[] = [
  { label: 'Organic search', value: 4820 },
  { label: 'Direct', value: 2410 },
  { label: 'Referral', value: 1290 },
  { label: 'Social', value: 860 },
  { label: 'Email', value: 430 },
];

const LONG_TAIL: readonly PieChartDatum[] = [
  ...TRAFFIC,
  { label: 'Paid search', value: 210 },
  { label: 'Affiliates', value: 140 },
  { label: 'Display', value: 95 },
  { label: 'Podcast', value: 60 },
  { label: 'Print', value: 25 },
];

const TRAFFIC_SOURCE = `const traffic = [
  { label: 'Organic search', value: 4820 },
  { label: 'Direct',         value: 2410 },
  { label: 'Referral',       value: 1290 },
  { label: 'Social',         value: 860  },
  { label: 'Email',          value: 430  },
];`;

function chartSnippet({ lead, tag }: { lead: string[]; tag: string }): string {
  return `${lead.join('\n\n')}\n\nhtml\`\n${tag}\n\`;`;
}

const meta: Meta = {
  title: 'Molecules/PieChart',
  component: 'ds-pie-chart',
  argTypes: {
    data: { control: 'object' },
    title: { control: 'text' },
    donut: { control: 'boolean' },
    innerRadius: { control: { type: 'number', min: 0, max: 0.9, step: 0.05 } },
    size: { control: { type: 'number', min: 160, step: 10 } },
    showLegend: { control: 'boolean' },
    showPercentages: { control: 'boolean' },
    maxSlices: { control: { type: 'number', min: 0, step: 1 } },
    otherThreshold: { control: { type: 'number', min: 0, step: 1 } },
    otherLabel: { control: 'text' },
    loading: { control: 'boolean' },
    formatValue: { control: false },
    formatPercent: { control: false },
  },
  args: {
    data: TRAFFIC,
    title: 'Sessions by channel',
    donut: false,
    innerRadius: 0.6,
    size: 320,
    showLegend: true,
    showPercentages: true,
    maxSlices: 0,
    otherThreshold: 0,
    otherLabel: 'Other',
    loading: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: function render(args) {
    return html`
<ds-pie-chart
  .title=${args['title']}
  .data=${args['data']}
  ?donut=${args['donut']}
  .innerRadius=${args['innerRadius']}
  .size=${args['size']}
  .showLegend=${args['showLegend']}
  .showPercentages=${args['showPercentages']}
  .maxSlices=${args['maxSlices']}
  .otherThreshold=${args['otherThreshold']}
  .otherLabel=${args['otherLabel']}
  .loading=${args['loading']}
  .formatValue=${args['formatValue']}
  .formatPercent=${args['formatPercent']}
></ds-pie-chart>
  `;
  },
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [TRAFFIC_SOURCE],
          tag: `  <ds-pie-chart
    title="Sessions by channel"
    .data=\${traffic}
  ></ds-pie-chart>`,
        }),
      },
    },
  },
};

export const Donut: Story = {
  render: () => html`
<ds-pie-chart
  donut
  title="Sessions by channel"
  .data=${TRAFFIC}
  .formatValue=${(v: number) => v.toLocaleString('en-US')}
></ds-pie-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [TRAFFIC_SOURCE],
          tag: `  <ds-pie-chart
    donut
    title="Sessions by channel"
    .data=\${traffic}
    .formatValue=\${(v) => v.toLocaleString('en-US')}
  ></ds-pie-chart>`,
        }),
      },
    },
  },
};

export const DonutWithSlottedCenter: Story = {
  render: () => html`
<ds-pie-chart
  donut
  title="Storage used"
  .data=${[
    { label: 'Documents', value: 62 },
    { label: 'Media', value: 128 },
    { label: 'Backups', value: 46 },
  ] as PieChartDatum[]}
  .formatValue=${(v: number) => `${v} GB`}
>
  <div slot="center">
    <strong style="font-size: 1.5rem">236 GB</strong>
    <div style="color: var(--ds-color-fg-muted)">of 500 GB</div>
  </div>
</ds-pie-chart>
  `,
};

export const WithFormatters: Story = {
  render: () => {
    const money = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    return html`
<ds-pie-chart
  donut
  title="Revenue by product line"
  .data=${[
    { label: 'Widgets', value: 148200 },
    { label: 'Gadgets', value: 71400 },
    { label: 'Services', value: 96300 },
  ] as PieChartDatum[]}
  .formatValue=${(v: number) => money.format(v)}
  .formatPercent=${(p: number) => `${p.toFixed(1)}%`}
></ds-pie-chart>
    `;
  },
};

export const OtherGrouping: Story = {
  render: () => html`
<ds-pie-chart
  title="Sessions by channel"
  .data=${LONG_TAIL}
  .maxSlices=${6}
  .formatValue=${(v: number) => v.toLocaleString('en-US')}
></ds-pie-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            `// Ten channels; \`max-slices\` keeps the five largest and rolls the rest into "Other".`,
          ],
          tag: `  <ds-pie-chart
    title="Sessions by channel"
    .data=\${channels}
    max-slices="6"
  ></ds-pie-chart>`,
        }),
      },
    },
  },
};

export const CustomColors: Story = {
  render: () => html`
<ds-pie-chart
  title="Poll results"
  .data=${[
    { label: 'Yes', value: 62, color: '#2b8a3e' },
    { label: 'No', value: 28, color: '#e2341d' },
    { label: 'Abstained', value: 10, color: '#7b7f86' },
  ] as PieChartDatum[]}
></ds-pie-chart>
  `,
};

export const SingleSlice: Story = {
  render: () => html`
<ds-pie-chart
  title="Uptime"
  .data=${[{ label: 'Available', value: 100 }] as PieChartDatum[]}
  .formatValue=${(v: number) => `${v}%`}
></ds-pie-chart>
  `,
};

export const Loading: Story = {
  render: () => html`
<ds-pie-chart loading title="Sessions by channel"></ds-pie-chart>
  `,
};

export const Compact: Story = {
  render: () => html`
<div style="max-width: 240px;">
  <ds-pie-chart
    donut
    size="200"
    .showPercentages=${false}
    title="Sessions"
    .data=${TRAFFIC}
  ></ds-pie-chart>
</div>
  `,
};
