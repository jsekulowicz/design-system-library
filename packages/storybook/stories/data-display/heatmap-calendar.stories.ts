import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { HeatmapDay } from '@jsekulowicz/ds-components/heatmap-calendar';
import '@jsekulowicz/ds-components/heatmap-calendar/define';

function sampleActivity(): HeatmapDay[] {
  const start = Date.UTC(2026, 0, 1);
  return Array.from({ length: 194 }, (_, index) => {
    const date = new Date(start + index * 86400000).toISOString().slice(0, 10);
    const value = index % 11 === 0 ? 0 : (index * 7) % 9;
    return { date, value };
  }).filter((day) => day.value > 0);
}

const DATA = sampleActivity();

function splitByTimeOfDay(days: HeatmapDay[]): HeatmapDay[] {
  return days.map((day) => {
    const morning = Math.ceil(day.value / 2);
    return {
      ...day,
      details: [
        { label: 'Morning', value: String(morning) },
        { label: 'Evening', value: String(day.value - morning) },
      ],
    };
  });
}

function formatEvents(value: number): string {
  return `${value} ${value === 1 ? 'event' : 'events'}`;
}

const FORMAT_EVENTS_SOURCE = `function formatEvents(value: number): string {
  return \`\${value} \${value === 1 ? 'event' : 'events'}\`;
}`;

const DAYS_SOURCE = `const days: HeatmapDay[] = [
  { date: '2026-07-11', value: 3 },
  { date: '2026-07-12', value: 5 },
  { date: '2026-07-13', value: 4 },
];`;

const DAYS_WITH_DETAILS_SOURCE = `const days: HeatmapDay[] = [
  {
    date: '2026-07-12',
    value: 5,
    details: [
      { label: 'Morning', value: '3' },
      { label: 'Evening', value: '2' },
    ],
  },
  {
    date: '2026-07-13',
    value: 4,
    details: [
      { label: 'Morning', value: '2' },
      { label: 'Evening', value: '2' },
    ],
  },
];`;

function buildHeatmapSource(declarations: string[], markup: string): Story['parameters'] {
  const code = [
    "import { html } from 'lit';",
    "import type { HeatmapDay } from '@jsekulowicz/ds-components/heatmap-calendar';",
    "import '@jsekulowicz/ds-components/heatmap-calendar/define';",
    ...declarations.map((declaration) => `\n${declaration}`),
    `\nhtml\`\n${markup}\n\`;`,
  ].join('\n');
  return { docs: { source: { code } } };
}

const meta: Meta = {
  title: 'Data Display/HeatmapCalendar',
  component: 'ds-heatmap-calendar',
  parameters: {
    docs: { collapsedObjectControls: ['data'], story: { inline: true } },
  },
  argTypes: {
    data: { control: 'object' },
    endDate: { control: 'text' },
    months: { control: { type: 'number', min: 1, max: 24 } },
    weekStart: { control: 'select', options: ['monday', 'sunday'] },
    title: { control: 'text' },
    cellSize: { control: { type: 'number', min: 6, max: 24 } },
    cellGap: { control: { type: 'number', min: 0, max: 8 } },
    showLegend: { control: 'boolean' },
    loading: { control: 'boolean' },
    color: { control: 'color' },
    locale: { control: 'text' },
    formatValue: { control: false },
    formatDate: { control: false },
  },
  args: {
    data: DATA,
    endDate: '2026-07-13',
    months: 6,
    weekStart: 'monday',
    title: 'Daily activity',
    cellSize: 12,
    cellGap: 3,
    showLegend: true,
    loading: false,
    color: 'var(--ds-color-chart-1)',
    locale: 'en',
    formatValue: formatEvents,
  },
};

export default meta;
type Story = StoryObj;

export const Activity: Story = {
  parameters: buildHeatmapSource(
    [DAYS_SOURCE, FORMAT_EVENTS_SOURCE],
    `  <ds-heatmap-calendar
    title="Daily activity"
    .data=\${days}
    .formatValue=\${formatEvents}
    end-date="2026-07-13"
    months="6"
    locale="en"
  ></ds-heatmap-calendar>`,
  ),
  render: function render(args) {
    return html`
      <ds-heatmap-calendar
        .data=${args['data']}
        .endDate=${args['endDate']}
        .months=${args['months']}
        .weekStart=${args['weekStart']}
        .title=${args['title']}
        .cellSize=${args['cellSize']}
        .cellGap=${args['cellGap']}
        .showLegend=${args['showLegend']}
        .loading=${args['loading']}
        .color=${args['color']}
        .locale=${args['locale']}
        .formatValue=${args['formatValue']}
        .formatDate=${args['formatDate']}
      ></ds-heatmap-calendar>
    `;
  },
};

export const Loading: Story = {
  render: () => html`
    <ds-heatmap-calendar loading end-date="2026-07-13" months="6" title="Daily activity"></ds-heatmap-calendar>
  `,
};

export const Empty: Story = {
  parameters: buildHeatmapSource(
    ['const days: HeatmapDay[] = [];'],
    `  <ds-heatmap-calendar title="Daily activity" .data=\${days} end-date="2026-07-13" months="6"></ds-heatmap-calendar>`,
  ),
  render: () => html`
    <ds-heatmap-calendar .data=${[]} end-date="2026-07-13" months="6" title="Daily activity"></ds-heatmap-calendar>
  `,
};

export const SundayFirst: Story = {
  parameters: buildHeatmapSource(
    [DAYS_SOURCE],
    `  <ds-heatmap-calendar
    title="Daily activity"
    .data=\${days}
    end-date="2026-07-13"
    months="6"
    week-start="sunday"
  ></ds-heatmap-calendar>`,
  ),
  render: () => html`
    <ds-heatmap-calendar
      .data=${DATA}
      end-date="2026-07-13"
      months="6"
      week-start="sunday"
      title="Daily activity"
    ></ds-heatmap-calendar>
  `,
};

export const DayDetails: Story = {
  parameters: buildHeatmapSource(
    [DAYS_WITH_DETAILS_SOURCE, FORMAT_EVENTS_SOURCE],
    `  <ds-heatmap-calendar
    title="Daily activity by time of day"
    .data=\${days}
    .formatValue=\${formatEvents}
    end-date="2026-07-13"
    months="6"
    locale="en"
  ></ds-heatmap-calendar>`,
  ),
  render: () => html`
    <ds-heatmap-calendar
      title="Daily activity by time of day"
      .data=${splitByTimeOfDay(DATA)}
      .formatValue=${formatEvents}
      end-date="2026-07-13"
      months="6"
      locale="en"
    ></ds-heatmap-calendar>
  `,
};
