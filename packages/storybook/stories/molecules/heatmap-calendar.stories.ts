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

const meta: Meta = {
  title: 'Molecules/HeatmapCalendar',
  component: 'ds-heatmap-calendar',
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
    title: 'Crosswords played',
    cellSize: 12,
    cellGap: 3,
    showLegend: true,
    loading: false,
    color: 'var(--ds-color-chart-1)',
    locale: 'en',
    formatValue: (value: number) => `${value} ${value === 1 ? 'play' : 'plays'}`,
  },
};

export default meta;
type Story = StoryObj;

export const Activity: Story = {
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
    <ds-heatmap-calendar
      loading
      end-date="2026-07-13"
      months="6"
      title="Crosswords played"
    ></ds-heatmap-calendar>
  `,
};

export const Empty: Story = {
  render: () => html`
    <ds-heatmap-calendar
      .data=${[]}
      end-date="2026-07-13"
      months="6"
      title="Crosswords played"
    ></ds-heatmap-calendar>
  `,
};

export const SundayFirst: Story = {
  render: () => html`
    <ds-heatmap-calendar
      .data=${DATA}
      end-date="2026-07-13"
      months="6"
      week-start="sunday"
      title="Crosswords played"
    ></ds-heatmap-calendar>
  `,
};
