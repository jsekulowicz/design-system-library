import { groupData, niceMax, generateTicks, computeGroupBands, type GroupBand } from './layout.js';
import type { BarChartGroup, BarChartRow } from './types.js';

const MARGIN = { top: 16, right: 16, bottomBase: 36, leftBase: 44 } as const;
const AXIS_LABEL_SPACE = 18;
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

export function computeChartLayout<T extends BarChartRow>(
  options: ChartLayoutOptions<T>,
): ChartLayout<T> {
  const groups = groupData(options.data, options.domain, options.seriesKeys);
  const maxValue = groups.reduce((acc, g) => {
    const v = options.stacked ? g.total : Math.max(...Object.values(g.values), 0);
    return Math.max(acc, v);
  }, 0);
  const yMax = niceMax(maxValue);
  const ticks = generateTicks(yMax);
  const margin = {
    top: MARGIN.top,
    right: MARGIN.right,
    bottom: MARGIN.bottomBase + (options.hasXAxisLabel ? AXIS_LABEL_SPACE : 0),
    left: MARGIN.leftBase + (options.hasYAxisLabel ? AXIS_LABEL_SPACE : 0),
  };
  const width = options.measuredWidth > 0 ? options.measuredWidth : FALLBACK_WIDTH;
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
