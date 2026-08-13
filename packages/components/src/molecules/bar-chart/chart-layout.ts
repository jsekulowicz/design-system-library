import { groupData, niceMax, generateTicks, computeGroupBands, type GroupBand } from './layout.js';
import type { BarChartGroup, BarChartRow } from './types.js';

const MARGIN = { top: 16, right: 16, bottomBase: 36, leftBase: 44 } as const;
const AXIS_LABEL_SPACE = 24;
const Y_TICK_GAP = 12;
const Y_TICK_CHARACTER_WIDTH = 7;
const MIN_PLOT_WIDTH = 48;
const FALLBACK_WIDTH = 640;
const BAND_OUTER_GAP = 0.18;

export interface ChartLayoutOptions<T extends BarChartRow> {
  data: readonly T[];
  domain: keyof T & string;
  seriesKeys: readonly string[];
  stacked: boolean;
  measuredWidth: number;
  height: number;
  hasXAxisLabel: boolean;
  hasYAxisLabel: boolean;
  formatValue?: (value: number) => string;
}

export interface ChartLayout<T extends BarChartRow = BarChartRow> {
  groups: BarChartGroup<T>[];
  yMax: number;
  ticks: number[];
  margin: { top: number; right: number; bottom: number; left: number };
  width: number;
  innerWidth: number;
  innerHeight: number;
  bands: GroupBand[];
}

export function computeChartLayout<T extends BarChartRow>(options: ChartLayoutOptions<T>): ChartLayout<T> {
  const groups = groupData(options.data, options.domain, options.seriesKeys);
  const maxValue = groups.reduce((acc, g) => {
    const v = options.stacked ? g.total : Math.max(...Object.values(g.values), 0);
    return Math.max(acc, v);
  }, 0);
  const yMax = niceMax(maxValue);
  const ticks = generateTicks(yMax);
  const width = options.measuredWidth > 0 ? options.measuredWidth : FALLBACK_WIDTH;
  const tickLabelWidth = Math.max(
    MARGIN.leftBase - Y_TICK_GAP,
    ...ticks.map((tick) => Array.from(options.formatValue?.(tick) ?? String(tick)).length * Y_TICK_CHARACTER_WIDTH),
  );
  const preferredLeftMargin = tickLabelWidth + Y_TICK_GAP + (options.hasYAxisLabel ? AXIS_LABEL_SPACE : 0);
  const margin = {
    top: MARGIN.top,
    right: MARGIN.right,
    bottom: MARGIN.bottomBase + (options.hasXAxisLabel ? AXIS_LABEL_SPACE : 0),
    left: Math.min(preferredLeftMargin, Math.max(0, width - MARGIN.right - MIN_PLOT_WIDTH)),
  };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, options.height - margin.top - margin.bottom);
  const bands = computeGroupBands(innerWidth, groups.length, BAND_OUTER_GAP);
  return { groups, yMax, ticks, margin, width, innerWidth, innerHeight, bands };
}

export function activeGroupHeight(
  layout: ChartLayout<BarChartRow>,
  activeIndex: number | null,
  stacked: boolean,
): number {
  if (activeIndex == null || layout.yMax <= 0) {
    return 0;
  }
  const g = layout.groups[activeIndex];
  if (!g) {
    return 0;
  }
  const value = stacked ? g.total : Math.max(...Object.values(g.values), 0);
  return (value / layout.yMax) * layout.innerHeight;
}
