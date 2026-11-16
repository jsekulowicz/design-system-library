export type HeatmapKeyAction = { index: number } | null;

export function actionForKey(key: string, focusedIndex: number | null, count: number): HeatmapKeyAction {
  if (count === 0) {
    return null;
  }
  if (key === 'Home' || key === 'End') {
    return { index: key === 'Home' ? 0 : count - 1 };
  }
  const moves: Record<string, number> = {
    ArrowUp: -1,
    ArrowDown: 1,
    ArrowLeft: -7,
    ArrowRight: 7,
  };
  const delta = moves[key];
  if (delta === undefined) {
    return null;
  }
  const current = focusedIndex ?? 0;
  return { index: Math.min(count - 1, Math.max(0, current + delta)) };
}
