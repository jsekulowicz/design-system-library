export type PaginationRangeItem = number | 'ellipsis-start' | 'ellipsis-end';

export interface PaginationRangeInput {
  totalPages: number;
  currentPage: number;
  maxVisiblePages: number;
  siblingCount: number;
}

const MIN_VISIBLE_PAGES_COUNT = 3;

export function buildPaginationRange({
  totalPages,
  currentPage,
  maxVisiblePages,
  siblingCount,
}: PaginationRangeInput): PaginationRangeItem[] {
  const total = Math.max(1, Math.floor(totalPages));
  const current = clamp(Math.floor(currentPage), 1, total);
  const siblings = Math.max(0, Math.floor(siblingCount));
  const maxVisible = Math.max(MIN_VISIBLE_PAGES_COUNT, Math.floor(maxVisiblePages));

  if (total <= maxVisible) {
    return buildRange(1, total);
  }

  const leftSibling = Math.max(current - siblings, 2);
  const rightSibling = Math.min(current + siblings, total - 1);
  const showLeftEllipsis = leftSibling > 3;
  const showRightEllipsis = rightSibling < total - 2;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = Math.max(3 + 2 * siblings, maxVisible - 2);
    const end = Math.min(leftCount, total - 1);
    return [...buildRange(1, end), 'ellipsis-end', total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = Math.max(3 + 2 * siblings, maxVisible - 2);
    const start = Math.max(total - rightCount + 1, 2);
    return [1, 'ellipsis-start', ...buildRange(start, total)];
  }

  return [1, 'ellipsis-start', ...buildRange(leftSibling, rightSibling), 'ellipsis-end', total];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function buildRange(start: number, end: number): number[] {
  const length = Math.max(0, end - start + 1);
  return Array.from({ length }, (_, i) => start + i);
}
