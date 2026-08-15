import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { ShareBarDatum } from '@jsekulowicz/ds-components/share-bar';
import '@jsekulowicz/ds-components/share-bar/define';

const DIFFICULTY: readonly ShareBarDatum[] = [
  { label: 'Beginner', value: 412 },
  { label: 'Easy', value: 388 },
  { label: 'Medium', value: 264 },
  { label: 'Hard', value: 121 },
  { label: 'Expert', value: 44 },
];

const TWO_WAY: readonly ShareBarDatum[] = [
  { label: 'Enabled', value: 738 },
  { label: 'Disabled', value: 262 },
];

const LONG_TAIL: readonly ShareBarDatum[] = [
  ...DIFFICULTY,
  { label: 'Timed', value: 38 },
  { label: 'Themed', value: 31 },
  { label: 'Cryptic', value: 22 },
  { label: 'Mini', value: 14 },
  { label: 'Quick', value: 9 },
  { label: 'Weekly', value: 6 },
  { label: 'Archive', value: 3 },
];

const DIFFICULTY_SOURCE = `const difficulty = [
  { label: 'Beginner', value: 412 },
  { label: 'Easy',     value: 388 },
  { label: 'Medium',   value: 264 },
  { label: 'Hard',     value: 121 },
  { label: 'Expert',   value: 44  },
];`;

function shareSnippet({ lead, tag }: { lead: string[]; tag: string }): string {
  return `${lead.join('\n\n')}\n\nhtml\`\n${tag}\n\`;`;
}

const meta: Meta = {
  title: 'Molecules/ShareBar',
  component: 'ds-share-bar',
  argTypes: {
    data: { control: 'object' },
    title: { control: 'text' },
    showLegend: { control: 'boolean' },
    maxSegments: { control: { type: 'number', min: 0, step: 1 } },
    otherLabel: { control: 'text' },
    emptyLabel: { control: 'text' },
    formatPercent: { control: false },
  },
  args: {
    data: DIFFICULTY,
    title: 'Puzzles started by difficulty',
    showLegend: true,
    maxSegments: 8,
    otherLabel: 'Other',
    emptyLabel: 'No data',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: function render(args) {
    return html`
      <ds-share-bar
        .title=${args['title']}
        .data=${args['data']}
        .showLegend=${args['showLegend']}
        .maxSegments=${args['maxSegments']}
        .otherLabel=${args['otherLabel']}
        .emptyLabel=${args['emptyLabel']}
        .formatPercent=${args['formatPercent']}
      ></ds-share-bar>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: shareSnippet({
          lead: [DIFFICULTY_SOURCE],
          tag: `  <ds-share-bar
    title="Puzzles started by difficulty"
    .data=\${difficulty}
  ></ds-share-bar>`,
        }),
      },
    },
  },
};

export const TwoCategories: Story = {
  render: () => html`<ds-share-bar title="Hints enabled" .data=${TWO_WAY}></ds-share-bar>`,
};

export const EightCategories: Story = {
  render: () => html`
    <ds-share-bar title="Every palette entry" .data=${LONG_TAIL.slice(0, 8)} .maxSegments=${0}></ds-share-bar>
  `,
};

export const LongTailRolledIntoOther: Story = {
  render: () => html`
    <ds-share-bar title="Puzzles by type" .data=${LONG_TAIL} .maxSegments=${6} other-label="Other types"></ds-share-bar>
  `,
};

export const SmallSharesStayVisible: Story = {
  render: () => html`
    <ds-share-bar
      title="Reports by outcome"
      .data=${
        [
          { label: 'Accepted', value: 4820 },
          { label: 'Rejected', value: 60 },
          { label: 'Duplicate', value: 4 },
        ] as ShareBarDatum[]
      }
    ></ds-share-bar>
  `,
};

export const WithoutLegend: Story = {
  render: () => html`<ds-share-bar title="Sessions" .data=${DIFFICULTY} .showLegend=${false}></ds-share-bar>`,
};

export const Empty: Story = {
  render: () => html`
    <ds-share-bar
      title="Pronunciation reviews"
      .data=${[{ label: 'Approved', value: 0 }] as ShareBarDatum[]}
      empty-label="Nothing recorded yet"
    ></ds-share-bar>
  `,
};

export const WithFormattedPercent: Story = {
  render: () => html`
    <ds-share-bar
      title="Puzzles started by difficulty"
      .data=${DIFFICULTY}
      .formatPercent=${(percent: number) => `${percent.toFixed(1)}%`}
    ></ds-share-bar>
  `,
};
