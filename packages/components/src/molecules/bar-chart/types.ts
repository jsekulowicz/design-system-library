export type BarChartSeries = {
  key: string;
  label?: string;
  color?: string;
};

export type BarChartRow = Record<string, unknown>;

export type BarChartGroup<T extends BarChartRow = BarChartRow> = {
  domain: unknown;
  row: T;
  values: Record<string, number>;
  total: number;
};

export type BarChartFocusDetail = {
  groupIndex: number;
  domainValue: unknown;
  values: Array<{ key: string; label: string; value: number }>;
};

/* Everything the stateless render helpers need from the component instance. */
export type ChartRenderContext = {
  uid: string;
  title: string;
  domainKey: string;
  stacked: boolean;
  series: readonly BarChartSeries[];
  activeIndex: number | null;
  focusMode: 'keyboard' | 'pointer' | null;
  xAxisLabel?: string;
  yAxisLabel?: string;
  seriesLabel(series: BarChartSeries): string;
  seriesColor(series: BarChartSeries, index: number): string;
  formatValue(value: number): string;
  formatDomain(value: unknown): string;
  formatTooltipTitle(value: unknown): string;
  barColor?(domain: unknown, seriesKey: string): string | undefined;
};
