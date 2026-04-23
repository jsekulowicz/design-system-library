import type { BarChartGroup, BarChartRow } from './types.js';

export function niceMax(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const d = value / pow;
  if (d <= 1) return 1 * pow;
  if (d <= 2) return 2 * pow;
  if (d <= 2.5) return 2.5 * pow;
  if (d <= 5) return 5 * pow;
  return 10 * pow;
}

export function generateTicks(maxValue: number, approxCount = 5): number[] {
  if (maxValue <= 0 || approxCount <= 0) {
    return [0];
  }
  const ideal = maxValue / approxCount;
  const pow = Math.pow(10, Math.floor(Math.log10(ideal)));
  const d = ideal / pow;
  let stepMultiplier = 10;
  if (d <= 1) stepMultiplier = 1;
  else if (d <= 2) stepMultiplier = 2;
  else if (d <= 5) stepMultiplier = 5;
  const step = stepMultiplier * pow;
  const ticks: number[] = [];
  for (let v = 0; v <= maxValue + 1e-9; v += step) {
    ticks.push(Number(v.toFixed(10)));
  }
  return ticks;
}

export function groupData<T extends BarChartRow>(
  rows: readonly T[],
  domainKey: keyof T & string,
  seriesKeys: readonly string[],
): BarChartGroup<T>[] {
  return rows.map(row => {
    const values: Record<string, number> = {};
    let total = 0;
    for (const key of seriesKeys) {
      const raw = row[key];
      const v = typeof raw === 'number' ? raw : Number(raw) || 0;
      values[key] = v;
      total += v;
    }
    return { domain: row[domainKey], row, values, total };
  });
}

export type GroupBand = {
  x: number;
  bandWidth: number;
  innerX: number;
  innerWidth: number;
};

export function computeGroupBands(
  innerWidth: number,
  groupCount: number,
  outerGapRatio: number,
): GroupBand[] {
  const count = Math.max(1, groupCount);
  const bandWidth = Math.max(0, innerWidth / count);
  const pad = bandWidth * Math.max(0, Math.min(0.45, outerGapRatio));
  const bands: GroupBand[] = [];
  for (let i = 0; i < count; i++) {
    const x = i * bandWidth;
    bands.push({ x, bandWidth, innerX: x + pad, innerWidth: Math.max(0, bandWidth - 2 * pad) });
  }
  return bands;
}

export type GroupedBar = { x: number; width: number };

export function computeGroupedBars(
  innerX: number,
  innerWidth: number,
  seriesCount: number,
  innerGap: number,
): GroupedBar[] {
  const n = Math.max(1, seriesCount);
  const totalGap = Math.max(0, n - 1) * innerGap;
  const barWidth = Math.max(1, (innerWidth - totalGap) / n);
  return Array.from({ length: n }, (_, i) => ({
    x: innerX + i * (barWidth + innerGap),
    width: barWidth,
  }));
}

export type StackSegment = { key: string; value: number; y: number; height: number };

export function computeStackSegments(
  values: Record<string, number>,
  seriesKeys: readonly string[],
  innerHeight: number,
  yMax: number,
): StackSegment[] {
  const segments: StackSegment[] = [];
  if (yMax <= 0 || innerHeight <= 0) {
    return seriesKeys.map(key => ({ key, value: values[key] ?? 0, y: innerHeight, height: 0 }));
  }
  let cumulative = 0;
  for (const key of seriesKeys) {
    const value = values[key] ?? 0;
    const height = (value / yMax) * innerHeight;
    cumulative += height;
    segments.push({ key, value, y: innerHeight - cumulative, height });
  }
  return segments;
}
