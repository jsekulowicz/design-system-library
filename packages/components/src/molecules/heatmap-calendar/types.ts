export type HeatmapDay = {
  date: string;
  value: number;
};

export type HeatmapFocusDetail = HeatmapDay & {
  level: number;
};

export type HeatmapWeekStart = 'monday' | 'sunday';

export type HeatmapCell = HeatmapFocusDetail & {
  column: number;
  row: number;
};

export type HeatmapMonthLabel = {
  date: string;
  column: number;
};

export type HeatmapLayout = {
  cells: HeatmapCell[];
  monthLabels: HeatmapMonthLabel[];
  maxValue: number;
  weekCount: number;
};

export type HeatmapRenderContext = {
  uid: string;
  title: string;
  color: string;
  cellSize: number;
  cellGap: number;
  measuredWidth: number;
  activeIndex: number | null;
  focusMode: 'keyboard' | 'pointer' | null;
  formatValue(value: number): string;
  formatDate(date: string): string;
  formatMonth(date: string): string;
  weekdayLabels: readonly string[];
};
