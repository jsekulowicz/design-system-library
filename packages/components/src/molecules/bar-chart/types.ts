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
