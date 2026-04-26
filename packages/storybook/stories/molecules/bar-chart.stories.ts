import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import type { BarChartSeries } from '@ds/components/bar-chart';
import '@ds/components/bar-chart/define';

type Turn = {
  turnOrdinalNumber: number;
  Jess: number;
  Marco: number;
  Andrew: number;
  Stacey: number;
};

const TURNS: readonly Turn[] = [
  { turnOrdinalNumber: 1, Jess: 3, Marco: 2, Andrew: 4, Stacey: 2 },
  { turnOrdinalNumber: 2, Jess: 2, Marco: 4, Andrew: 3, Stacey: 5 },
  { turnOrdinalNumber: 3, Jess: 5, Marco: 5, Andrew: 4, Stacey: 6 },
  { turnOrdinalNumber: 4, Jess: 4, Marco: 5, Andrew: 2, Stacey: 3 },
  { turnOrdinalNumber: 5, Jess: 3, Marco: 3, Andrew: 6, Stacey: 1 },
  { turnOrdinalNumber: 6, Jess: 1, Marco: 2, Andrew: 1, Stacey: 3 },
  { turnOrdinalNumber: 7, Jess: 3, Marco: 3, Andrew: 3, Stacey: 6 },
  { turnOrdinalNumber: 8, Jess: 1, Marco: 2, Andrew: 3, Stacey: 0 },
  { turnOrdinalNumber: 9, Jess: 3, Marco: 2, Andrew: 2, Stacey: 4 },
  { turnOrdinalNumber: 10, Jess: 4, Marco: 2, Andrew: 2, Stacey: 2 },
  { turnOrdinalNumber: 11, Jess: 3, Marco: 2, Andrew: 6, Stacey: 4 },
  { turnOrdinalNumber: 12, Jess: 3, Marco: 9, Andrew: 4, Stacey: 4 },
  { turnOrdinalNumber: 13, Jess: 4, Marco: 3, Andrew: 3, Stacey: 3 },
];

const THREE_PLAYERS: readonly BarChartSeries[] = [
  { key: 'Jess' },
  { key: 'Marco' },
  { key: 'Andrew' },
];

const FOUR_PLAYERS: readonly BarChartSeries[] = [
  { key: 'Jess' },
  { key: 'Marco' },
  { key: 'Andrew' },
  { key: 'Stacey' },
];

const TURNS_SOURCE = `// Each row is one turn; the extra fields are per-player scores.
const turns = [
  { turnOrdinalNumber: 1,  Jess: 3, Marco: 2, Andrew: 4, Stacey: 2 },
  { turnOrdinalNumber: 2,  Jess: 2, Marco: 4, Andrew: 3, Stacey: 5 },
  { turnOrdinalNumber: 3,  Jess: 5, Marco: 5, Andrew: 4, Stacey: 6 },
  // ... 9 more turns
  { turnOrdinalNumber: 13, Jess: 4, Marco: 3, Andrew: 3, Stacey: 3 },
];`;

const THREE_PLAYERS_SOURCE = `// One entry per series; \`key\` matches a field on each data row.
const series = [
  { key: 'Jess' },
  { key: 'Marco' },
  { key: 'Andrew' },
];`;

const FOUR_PLAYERS_SOURCE = `const series = [
  { key: 'Jess' },
  { key: 'Marco' },
  { key: 'Andrew' },
  { key: 'Stacey' },
];`;

function chartSnippet({ lead, tag }: { lead: string[]; tag: string }): string {
  return `${lead.join('\n\n')}\n\nhtml\`\n${tag}\n\`;`;
}

const meta: Meta = {
  title: 'Molecules/BarChart',
  component: 'ds-bar-chart',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

export const Grouped: Story = {
  render: () => html`
<ds-bar-chart
  title="Game turns — scores"
  .data=${TURNS}
  domain="turnOrdinalNumber"
  .series=${THREE_PLAYERS}
  x-axis-label="Turn"
  y-axis-label="Score"
  .formatDomain=${(v: unknown) => `Turn ${v}`}
></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [TURNS_SOURCE, THREE_PLAYERS_SOURCE],
          tag: `  <ds-bar-chart
    title="Game turns — scores"
    .data=\${turns}
    domain="turnOrdinalNumber"
    .series=\${series}
    x-axis-label="Turn"
    y-axis-label="Score"
    .formatDomain=\${(v) => \`Turn \${v}\`}
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const Stacked: Story = {
  render: () => html`
<ds-bar-chart
  stacked
  title="Game turns — stacked scores"
  .data=${TURNS}
  domain="turnOrdinalNumber"
  .series=${THREE_PLAYERS}
  x-axis-label="Turn"
  y-axis-label="Total score"
  .formatDomain=${(v: unknown) => `Turn ${v}`}
></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [TURNS_SOURCE, THREE_PLAYERS_SOURCE],
          tag: `  <ds-bar-chart
    stacked
    title="Game turns — stacked scores"
    .data=\${turns}
    domain="turnOrdinalNumber"
    .series=\${series}
    x-axis-label="Turn"
    y-axis-label="Total score"
    .formatDomain=\${(v) => \`Turn \${v}\`}
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
  title="Game turns — all four players"
  .data=${TURNS}
  domain="turnOrdinalNumber"
  .series=${FOUR_PLAYERS}
  x-axis-label="Turn"
  y-axis-label="Total score"
  .formatDomain=${(v: unknown) => `Turn ${v}`}
></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [TURNS_SOURCE, FOUR_PLAYERS_SOURCE],
          tag: `  <ds-bar-chart
    stacked
    title="Game turns — all four players"
    .data=\${turns}
    domain="turnOrdinalNumber"
    .series=\${series}
    x-axis-label="Turn"
    y-axis-label="Total score"
    .formatDomain=\${(v) => \`Turn \${v}\`}
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const FewGroups: Story = {
  render: () => html`
<ds-bar-chart
  .data=${TURNS.slice(0, 3)}
  domain="turnOrdinalNumber"
  .series=${THREE_PLAYERS}
  x-axis-label="Turn"
  y-axis-label="Score"
></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            `const turns = [
  { turnOrdinalNumber: 1, Jess: 3, Marco: 2, Andrew: 4, Stacey: 2 },
  { turnOrdinalNumber: 2, Jess: 2, Marco: 4, Andrew: 3, Stacey: 5 },
  { turnOrdinalNumber: 3, Jess: 5, Marco: 5, Andrew: 4, Stacey: 6 },
];`,
            THREE_PLAYERS_SOURCE,
          ],
          tag: `  <ds-bar-chart
    .data=\${turns}
    domain="turnOrdinalNumber"
    .series=\${series}
    x-axis-label="Turn"
    y-axis-label="Score"
  ></ds-bar-chart>`,
        }),
      },
    },
  },
};

export const ManyGroups: Story = {
  render: () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      turnOrdinalNumber: i + 1,
      Jess: 3 + ((i * 7) % 6),
      Marco: 2 + ((i * 3) % 7),
      Andrew: 1 + ((i * 5) % 6),
      Stacey: 2 + ((i * 2) % 5),
    }));
    return html`
  <ds-bar-chart
    .data=${many}
    domain="turnOrdinalNumber"
    .series=${FOUR_PLAYERS}
    x-axis-label="Turn"
    y-axis-label="Score"
  ></ds-bar-chart>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            `// 30 generated turns to exercise tick decimation and label rotation.
const turns = Array.from({ length: 30 }, (_, i) => ({
  turnOrdinalNumber: i + 1,
  Jess:   3 + ((i * 7) % 6),
  Marco:  2 + ((i * 3) % 7),
  Andrew: 1 + ((i * 5) % 6),
  Stacey: 2 + ((i * 2) % 5),
}));`,
            FOUR_PLAYERS_SOURCE,
          ],
          tag: `  <ds-bar-chart
    .data=\${turns}
    domain="turnOrdinalNumber"
    .series=\${series}
    x-axis-label="Turn"
    y-axis-label="Score"
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
  .data=${TURNS}
  domain="turnOrdinalNumber"
  .series=${[
    { key: 'Jess', color: '#e2341d' },
    { key: 'Marco', color: '#4a72cc' },
    { key: 'Andrew', color: '#1f7a48' },
  ] as BarChartSeries[]}
  x-axis-label="Turn"
  y-axis-label="Score"
></ds-bar-chart>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            TURNS_SOURCE,
            `// Each series may provide its own \`color\` to override the default palette.
const series = [
  { key: 'Jess',   color: '#e2341d' },
  { key: 'Marco',  color: '#4a72cc' },
  { key: 'Andrew', color: '#1f7a48' },
];`,
          ],
          tag: `  <ds-bar-chart
    .data=\${turns}
    domain="turnOrdinalNumber"
    .series=\${series}
    x-axis-label="Turn"
    y-axis-label="Score"
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
    .data=${TURNS.slice(0, 7)}
    domain="turnOrdinalNumber"
    .series=${THREE_PLAYERS}
  ></ds-bar-chart>
</div>
  `,
  parameters: {
    docs: {
      source: {
        code: chartSnippet({
          lead: [
            `const turns = [/* first 7 turns */];`,
            THREE_PLAYERS_SOURCE,
          ],
          tag: `  <div style="max-width: 420px;">
    <ds-bar-chart
      height="180"
      .data=\${turns}
      domain="turnOrdinalNumber"
      .series=\${series}
    ></ds-bar-chart>
  </div>`,
        }),
      },
    },
  },
};
