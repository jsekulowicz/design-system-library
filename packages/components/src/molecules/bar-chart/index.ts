export { DsBarChart } from './bar-chart.js';
export type {
  BarChartSeries,
  BarChartRow,
  BarChartGroup,
  BarChartFocusDetail,
} from './types.js';
export {
  niceMax,
  generateTicks,
  groupData,
  computeGroupBands,
  computeGroupedBars,
  computeStackSegments,
  type GroupBand,
  type GroupedBar,
  type StackSegment,
} from './layout.js';
