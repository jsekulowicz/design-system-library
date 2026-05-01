export const DEFAULT_CHART_COLORS: readonly string[] = [
  'var(--ds-color-chart-1)',
  'var(--ds-color-chart-2)',
  'var(--ds-color-chart-3)',
  'var(--ds-color-chart-4)',
  'var(--ds-color-chart-5)',
  'var(--ds-color-chart-6)',
];

export function colorForIndex(index: number): string {
  const i = ((index % DEFAULT_CHART_COLORS.length) + DEFAULT_CHART_COLORS.length) % DEFAULT_CHART_COLORS.length;
  return DEFAULT_CHART_COLORS[i]!;
}
