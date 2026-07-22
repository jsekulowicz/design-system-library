import type { PieChartDatum, PieSlice } from './types.js';

export interface PieSliceOptions {
  maxSlices: number;
  otherThreshold: number;
  otherLabel: string;
  includeZeroSlices?: boolean;
  minSlicePercent?: number;
}

type Weighted = { datum: PieChartDatum; value: number; index: number };

function toWeighted(data: readonly PieChartDatum[]): Weighted[] {
  return data
    .map((datum, index) => ({ datum, index, value: normalizeValue(datum.value) }))
    .filter(entry => entry.value > 0);
}

/* Zero-value entries never join the pie math (no arc, no "Other" grouping),
   but consumers can opt in to keeping them visible in the legend and the
   screen-reader table so every possible category stays discoverable. */
function toZeroSlices(
  data: readonly PieChartDatum[],
): Omit<PieSlice, 'startAngle' | 'endAngle'>[] {
  return data
    .map((datum, index) => ({ datum, index, value: normalizeValue(datum.value) }))
    .filter(entry => entry.value === 0)
    .map(entry => ({
      label: entry.datum.label,
      value: 0,
      percent: 0,
      ...(entry.datum.color === undefined ? {} : { color: entry.datum.color }),
      isOther: false,
      sourceIndices: [entry.index],
    }));
}

function normalizeValue(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return value;
}

function splitTail(entries: Weighted[], total: number, options: PieSliceOptions): [Weighted[], Weighted[]] {
  const sorted = [...entries].sort((a, b) => b.value - a.value);
  const belowThreshold = (entry: Weighted): boolean => {
    return options.otherThreshold > 0 && (entry.value / total) * 100 < options.otherThreshold;
  };
  const kept: Weighted[] = [];
  const tail: Weighted[] = [];
  for (const entry of sorted) {
    const overflows = options.maxSlices > 0 && kept.length >= options.maxSlices - 1;
    if (overflows || belowThreshold(entry)) {
      tail.push(entry);
      continue;
    }
    kept.push(entry);
  }
  if (tail.length === 1) {
    kept.push(tail.pop()!);
  }
  return [kept, tail];
}

function toSlice(entry: Weighted, total: number): Omit<PieSlice, 'startAngle' | 'endAngle'> {
  return {
    label: entry.datum.label,
    value: entry.value,
    percent: (entry.value / total) * 100,
    ...(entry.datum.color === undefined ? {} : { color: entry.datum.color }),
    isOther: false,
    sourceIndices: [entry.index],
  };
}

function toOtherSlice(tail: Weighted[], total: number, label: string): Omit<PieSlice, 'startAngle' | 'endAngle'> {
  const value = tail.reduce((sum, entry) => sum + entry.value, 0);
  return {
    label,
    value,
    percent: (value / total) * 100,
    isOther: true,
    sourceIndices: tail.map(entry => entry.index),
  };
}

/* Sweeps used for drawing only: slivers below minPercent are widened to stay
   visible and the remaining slices shrink proportionally to compensate. The
   true `percent` is untouched, so labels and tooltips keep the real share. */
function displayShares(
  slices: readonly Omit<PieSlice, 'startAngle' | 'endAngle'>[],
  minPercent: number,
): number[] {
  const shares = slices.map(slice => slice.percent);
  const boosted = shares.filter(percent => percent > 0 && percent < minPercent);
  const restSum = shares.filter(percent => percent >= minPercent).reduce((sum, p) => sum + p, 0);
  if (minPercent <= 0 || boosted.length === 0 || restSum <= 0) {
    return shares;
  }
  const boostedSum = boosted.length * minPercent;
  if (boostedSum >= 100) {
    return shares;
  }
  const scale = (100 - boostedSum) / restSum;
  return shares.map(percent => {
    if (percent > 0 && percent < minPercent) {
      return minPercent;
    }
    return percent * scale;
  });
}

export function computeSliceAngles(
  slices: readonly Omit<PieSlice, 'startAngle' | 'endAngle'>[],
  minSlicePercent = 0,
): PieSlice[] {
  const shares = displayShares(slices, minSlicePercent);
  let cursor = -Math.PI / 2;
  return slices.map((slice, index) => {
    const startAngle = cursor;
    const endAngle = startAngle + ((shares[index] ?? 0) / 100) * Math.PI * 2;
    cursor = endAngle;
    return { ...slice, startAngle, endAngle };
  });
}

export function preparePieSlices(
  data: readonly PieChartDatum[],
  options: PieSliceOptions,
): PieSlice[] {
  const entries = toWeighted(data);
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  if (total <= 0) {
    return [];
  }
  const [kept, tail] = splitTail(entries, total, options);
  const slices = kept.map(entry => toSlice(entry, total));
  if (tail.length > 0) {
    slices.push(toOtherSlice(tail, total, options.otherLabel));
  }
  if (options.includeZeroSlices) {
    slices.push(...toZeroSlices(data));
  }
  return computeSliceAngles(slices, options.minSlicePercent ?? 0);
}

export function sliceTotal(slices: readonly PieSlice[]): number {
  return slices.reduce((sum, slice) => sum + slice.value, 0);
}
