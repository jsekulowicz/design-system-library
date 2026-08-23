import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { BarChartSeries } from '@jsekulowicz/ds-components/bar-chart';
import '@jsekulowicz/ds-components/bar-chart/define';

interface ActivityPoint {
  week: number;
  Website: number;
  Mobile: number;
  Partners: number;
  Retail: number;
}

const WEEKLY_ACTIVITY: readonly ActivityPoint[] = [
  { week: 1, Website: 3, Mobile: 2, Partners: 4, Retail: 2 },
  { week: 2, Website: 2, Mobile: 4, Partners: 3, Retail: 5 },
  { week: 3, Website: 5, Mobile: 5, Partners: 4, Retail: 6 },
  { week: 4, Website: 4, Mobile: 5, Partners: 2, Retail: 3 },
  { week: 5, Website: 3, Mobile: 3, Partners: 6, Retail: 1 },
  { week: 6, Website: 1, Mobile: 2, Partners: 1, Retail: 3 },
  { week: 7, Website: 3, Mobile: 3, Partners: 3, Retail: 6 },
  { week: 8, Website: 1, Mobile: 2, Partners: 3, Retail: 0 },
  { week: 9, Website: 3, Mobile: 2, Partners: 2, Retail: 4 },
  { week: 10, Website: 4, Mobile: 2, Partners: 2, Retail: 2 },
  { week: 11, Website: 3, Mobile: 2, Partners: 6, Retail: 4 },
  { week: 12, Website: 3, Mobile: 9, Partners: 4, Retail: 4 },
  { week: 13, Website: 4, Mobile: 3, Partners: 3, Retail: 3 },
];

const THREE_CHANNELS: readonly BarChartSeries[] = [{ key: 'Website' }, { key: 'Mobile' }, { key: 'Partners' }];

const FOUR_CHANNELS: readonly BarChartSeries[] = [
  { key: 'Website' },
  { key: 'Mobile' },
  { key: 'Partners' },
  { key: 'Retail' },
];

const ACTIVITY_SOURCE = `// Each row is one week; the extra fields are per-channel totals.
const activity = [
  { week: 1,  Website: 3, Mobile: 2, Partners: 4, Retail: 2 },
  { week: 2,  Website: 2, Mobile: 4, Partners: 3, Retail: 5 },
  { week: 3,  Website: 5, Mobile: 5, Partners: 4, Retail: 6 },
  // ... 9 more rows
  { week: 13, Website: 4, Mobile: 3, Partners: 3, Retail: 3 },
];`;

const THREE_CHANNELS_SOURCE = `// One entry per series; \`key\` matches a field on each data row.
const series = [
  { key: 'Website' },
  { key: 'Mobile' },
  { key: 'Partners' },
];`;

const FOUR_CHANNELS_SOURCE = `const series = [
  { key: 'Website' },
  { key: 'Mobile' },
  { key: 'Partners' },
  { key: 'Retail' },
];`;

function chartSnippet({ lead, tag }: { lead: string[]; tag: string }): string {
  return `${lead.join('\n\n')}\n\nhtml\`\n${tag}\n\`;`;
}

const meta: Meta = {
  title: 'Molecules/BarChart',
  component: 'ds-bar-chart',
  parameters: { docs: { story: { inline: false, height: '420px' } } },
  argTypes: {
    data: { control: 'object' },
    domain: { control: 'text' },
    series: { control: 'object' },
    stacked: { control: 'boolean' },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    title: { control: 'text' },
    height: { control: { type: 'number', min: 160, step: 10 } },
    showLegend: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingLabel: { control: 'text' },
    formatValue: { control: false },
    formatDomain: { control: false },
  },
  args: {
    data: WEEKLY_ACTIVITY,
    domain: 'week',
    series: THREE_CHANNELS,
    stacked: false,
    xAxisLabel: 'Week',
    yAxisLabel: 'Events',
    title: 'Weekly activity',
    height: 320,
    showLegend: true,
    loading: false,
    loadingLabel: 'Loading...',
    formatDomain: (value: unknown) => `Week ${value}`,
  },
};

export default meta;
type Story = StoryObj;

export const Grouped: Story = {
  render: function render(args) {
    return html`
      <ds-bar-chart
        .title=${args['title']}
        .data=${args['data']}
        .domain=${args['domain']}
        .series=${args['series']}
        ?stacked=${args['stacked']}
        .xAxisLabel=${args['xAxisLabel']}
        .yAxisLabel=${args['yAxisLabel']}
        .height=${args['height']}
        .showLegend=${args['showLegend']}
        .loading=${args['loading']}
        .loadingLabel=${args['loadingLabel']}
        .formatValue=${args['formatValue']}
        .formatDomain=${args['formatDomain']}
      ></ds-bar-chart>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [ACTIVITY_SOURCE, THREE_CHANNELS_SOURCE],
          tag: `  <ds-bar-chart
    title="Weekly activity"
    .data=\${activity}
    domain="week"
    .series=\${series}
    x-axis-label="Week"
    y-axis-label="Events"
    .formatDomain=\${(v) => \`Week \${v}\`}
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const Loading: Story = {
  render: () => html`
    <ds-bar-chart
      loading
      title="Weekly activity"
      height="320"
      .data=${WEEKLY_ACTIVITY}
      domain="week"
      .series=${THREE_CHANNELS}
      x-axis-label="Week"
      y-axis-label="Events"
      .formatDomain=${(v: unknown) => `Week ${v}`}
    ></ds-bar-chart>
  `,
};

export const InitialLoading: Story = {
  render: () => html`
    <ds-bar-chart loading title="Weekly activity" height="320" .series=${THREE_CHANNELS}></ds-bar-chart>
  `,
};

export const Stacked: Story = {
  render: () => html`
    <ds-bar-chart
      stacked
      title="Weekly activity - stacked"
      .data=${WEEKLY_ACTIVITY}
      domain="week"
      .series=${THREE_CHANNELS}
      x-axis-label="Week"
      y-axis-label="Total events"
      .formatDomain=${(v: unknown) => `Week ${v}`}
    ></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [ACTIVITY_SOURCE, THREE_CHANNELS_SOURCE],
          tag: `  <ds-bar-chart
    stacked
    title="Weekly activity - stacked"
    .data=\${activity}
    domain="week"
    .series=\${series}
    x-axis-label="Week"
    y-axis-label="Total events"
    .formatDomain=\${(v) => \`Week \${v}\`}
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const FourSeriesStacked: Story = {
  render: () => html`
    <ds-bar-chart
      stacked
      title="Weekly activity - all four channels"
      .data=${WEEKLY_ACTIVITY}
      domain="week"
      .series=${FOUR_CHANNELS}
      x-axis-label="Week"
      y-axis-label="Total events"
      .formatDomain=${(v: unknown) => `Week ${v}`}
    ></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [ACTIVITY_SOURCE, FOUR_CHANNELS_SOURCE],
          tag: `  <ds-bar-chart
    stacked
    title="Weekly activity - all four channels"
    .data=\${activity}
    domain="week"
    .series=\${series}
    x-axis-label="Week"
    y-axis-label="Total events"
    .formatDomain=\${(v) => \`Week \${v}\`}
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const FewGroups: Story = {
  render: () => html`
    <ds-bar-chart
      .data=${WEEKLY_ACTIVITY.slice(0, 3)}
      domain="week"
      .series=${THREE_CHANNELS}
      x-axis-label="Week"
      y-axis-label="Events"
    ></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            `const activity = [
  { week: 1, Website: 3, Mobile: 2, Partners: 4, Retail: 2 },
  { week: 2, Website: 2, Mobile: 4, Partners: 3, Retail: 5 },
  { week: 3, Website: 5, Mobile: 5, Partners: 4, Retail: 6 },
];`,
            THREE_CHANNELS_SOURCE,
          ],
          tag: `  <ds-bar-chart
    .data=\${activity}
    domain="week"
    .series=\${series}
    x-axis-label="Week"
    y-axis-label="Events"
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const ManyGroups: Story = {
  render: () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      week: i + 1,
      Website: 3 + ((i * 7) % 6),
      Mobile: 2 + ((i * 3) % 7),
      Partners: 1 + ((i * 5) % 6),
      Retail: 2 + ((i * 2) % 5),
    }));
    return html`
      <ds-bar-chart
        .data=${many}
        domain="week"
        .series=${FOUR_CHANNELS}
        x-axis-label="Week"
        y-axis-label="Events"
      ></ds-bar-chart>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            `// 30 generated activity to exercise tick decimation and label rotation.
const activity = Array.from({ length: 30 }, (_, i) => ({
  week: i + 1,
  Website:   3 + ((i * 7) % 6),
  Mobile:  2 + ((i * 3) % 7),
  Partners: 1 + ((i * 5) % 6),
  Retail: 2 + ((i * 2) % 5),
}));`,
            FOUR_CHANNELS_SOURCE,
          ],
          tag: `  <ds-bar-chart
    .data=\${activity}
    domain="week"
    .series=\${series}
    x-axis-label="Week"
    y-axis-label="Events"
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const WithFormatters: Story = {
  render: () => {
    const revenue = [
      { month: '2026-01', Widgets: 12000, Gadgets: 5000, Services: 8000 },
      { month: '2026-02', Widgets: 13500, Gadgets: 5200, Services: 9100 },
      { month: '2026-03', Widgets: 15000, Gadgets: 6100, Services: 10400 },
      { month: '2026-04', Widgets: 14200, Gadgets: 7000, Services: 11200 },
    ];
    const series: BarChartSeries[] = [{ key: 'Widgets' }, { key: 'Gadgets' }, { key: 'Services' }];
    const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
    return html`
      <ds-bar-chart
        stacked
        title="Quarterly revenue"
        .data=${revenue}
        domain="month"
        .series=${series}
        x-axis-label="Month"
        y-axis-label="Revenue"
        .formatValue=${(v: number) => money.format(v)}
        .formatDomain=${(v: unknown) => monthFmt.format(new Date(String(v)))}
      ></ds-bar-chart>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            `// \`domain\` is an ISO month string; \`.series\` plots three revenue sources.
const revenue = [
  { month: '2026-01', Widgets: 12000, Gadgets: 5000, Services: 8000  },
  { month: '2026-02', Widgets: 13500, Gadgets: 5200, Services: 9100  },
  { month: '2026-03', Widgets: 15000, Gadgets: 6100, Services: 10400 },
  { month: '2026-04', Widgets: 14200, Gadgets: 7000, Services: 11200 },
];

const series = [
  { key: 'Widgets' },
  { key: 'Gadgets' },
  { key: 'Services' },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });`,
          ],
          tag: `  <ds-bar-chart
    stacked
    title="Quarterly revenue"
    .data=\${revenue}
    domain="month"
    .series=\${series}
    x-axis-label="Month"
    y-axis-label="Revenue"
    .formatValue=\${(v) => money.format(v)}
    .formatDomain=\${(v) => monthFmt.format(new Date(String(v)))}
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const CustomColors: Story = {
  render: () => html`
    <ds-bar-chart
      .data=${WEEKLY_ACTIVITY}
      domain="week"
      .series=${
        [
          { key: 'Website', color: '#e2341d' },
          { key: 'Mobile', color: '#4a72cc' },
          { key: 'Partners', color: '#1f7a48' },
        ] as BarChartSeries[]
      }
      x-axis-label="Week"
      y-axis-label="Events"
    ></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            ACTIVITY_SOURCE,
            `// Each series may provide its own \`color\` to override the default palette.
const series = [
  { key: 'Website',   color: '#e2341d' },
  { key: 'Mobile',  color: '#4a72cc' },
  { key: 'Partners', color: '#1f7a48' },
];`,
          ],
          tag: `  <ds-bar-chart
    .data=\${activity}
    domain="week"
    .series=\${series}
    x-axis-label="Week"
    y-axis-label="Events"
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const CompactHeight: Story = {
  render: () => html`
    <div style="max-width: 420px;">
      <ds-bar-chart
        height="180"
        .data=${WEEKLY_ACTIVITY.slice(0, 7)}
        domain="week"
        .series=${THREE_CHANNELS}
      ></ds-bar-chart>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [`const activity = [/* first 7 activity */];`, THREE_CHANNELS_SOURCE],
          tag: `  <div style="max-width: 420px;">
    <ds-bar-chart
      height="180"
      .data=\${activity}
      domain="week"
      .series=\${series}
    ></ds-bar-chart>
  </div>`,
        }),
      },
    },
  },
};
