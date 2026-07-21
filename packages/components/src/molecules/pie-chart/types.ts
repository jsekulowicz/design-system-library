export type PieChartDatum = {
  label: string;
  value: number;
  color?: string;
};

export type PieSlice = {
  label: string;
  value: number;
  percent: number;
  startAngle: number;
  endAngle: number;
  color?: string;
  isOther: boolean;
  sourceIndices: number[];
};

export type PieChartSliceDetail = {
  index: number;
  label: string;
  value: number;
  percent: number;
  isOther: boolean;
};

/* Everything the stateless render helpers need from the component instance. */
export type PieRenderContext = {
  uid: string;
  title: string;
  donut: boolean;
  innerRadius: number;
  showPercentages: boolean;
  total: number;
  activeIndex: number | null;
  focusMode: 'keyboard' | 'pointer' | null;
  sliceColor(slice: PieSlice, index: number): string;
  formatValue(value: number): string;
  formatPercent(percent: number): string;
};
