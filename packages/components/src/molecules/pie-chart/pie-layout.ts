import type { PieChartDatum, PieSlice } from './types.js';

export interface PieSliceOptions {
  maxSlices: number;
  otherThreshold: number;
  otherLabel: string;
}

type Weighted = { datum: PieChartDatum; value: number; index: number };

function toWeighted(data: readonly PieChartDatum[]): Weighted[] {
  return data
    .map((datum, index) => ({ datum, index, value: normalizeValue(datum.value) }))
    .filter(entry => entry.value > 0);
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

export function computeSliceAngles(
  slices: readonly Omit<PieSlice, 'startAngle' | 'endAngle'>[],
): PieSlice[] {
  let cursor = -Math.PI / 2;
  return slices.map(slice => {
    const startAngle = cursor;
    const endAngle = startAngle + (slice.percent / 100) * Math.PI * 2;
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
  return computeSliceAngles(slices);
}

export function sliceTotal(slices: readonly PieSlice[]): number {
  return slices.reduce((sum, slice) => sum + slice.value, 0);
}
