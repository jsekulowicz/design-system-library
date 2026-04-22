import { describe, it, expect } from 'vitest';
import { buildPaginationRange } from './pagination-range.js';

describe('buildPaginationRange', () => {
  it('returns all pages when total fits within max visible', () => {
    expect(buildPaginationRange({ totalPages: 5, currentPage: 1, maxVisiblePages: 7, siblingCount: 1 }))
      .toEqual([1, 2, 3, 4, 5]);
  });

  it('renders leading pages with trailing ellipsis when current is near the start', () => {
    const range = buildPaginationRange({ totalPages: 20, currentPage: 2, maxVisiblePages: 7, siblingCount: 1 });
    expect(range[0]).toBe(1);
    expect(range[range.length - 1]).toBe(20);
    expect(range).toContain('ellipsis-end');
    expect(range).not.toContain('ellipsis-start');
    expect(range).toContain(2);
  });

  it('renders trailing pages with leading ellipsis when current is near the end', () => {
    const range = buildPaginationRange({ totalPages: 20, currentPage: 19, maxVisiblePages: 7, siblingCount: 1 });
    expect(range[0]).toBe(1);
    expect(range[range.length - 1]).toBe(20);
    expect(range).toContain('ellipsis-start');
    expect(range).not.toContain('ellipsis-end');
    expect(range).toContain(19);
  });

  it('renders both ellipses when current is in the middle', () => {
    const range = buildPaginationRange({ totalPages: 20, currentPage: 10, maxVisiblePages: 7, siblingCount: 1 });
    expect(range).toContain('ellipsis-start');
    expect(range).toContain('ellipsis-end');
    expect(range).toContain(10);
  });

  it('always includes the current page', () => {
    for (const page of [1, 5, 10, 15, 20]) {
      const range = buildPaginationRange({ totalPages: 20, currentPage: page, maxVisiblePages: 7, siblingCount: 1 });
      expect(range).toContain(page);
    }
  });

  it('honors sibling-count', () => {
    const range = buildPaginationRange({ totalPages: 30, currentPage: 15, maxVisiblePages: 9, siblingCount: 2 });
    expect(range).toContain(13);
    expect(range).toContain(14);
    expect(range).toContain(15);
    expect(range).toContain(16);
    expect(range).toContain(17);
  });

  it('never returns duplicate or non-positive page numbers', () => {
    const range = buildPaginationRange({ totalPages: 50, currentPage: 1, maxVisiblePages: 7, siblingCount: 1 });
    const numbers = range.filter((r): r is number => typeof r === 'number');
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(numbers.every(n => n >= 1)).toBe(true);
  });

  it('clamps currentPage to valid range', () => {
    const range = buildPaginationRange({ totalPages: 5, currentPage: 99, maxVisiblePages: 7, siblingCount: 1 });
    expect(range).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles totalPages=1', () => {
    expect(buildPaginationRange({ totalPages: 1, currentPage: 1, maxVisiblePages: 7, siblingCount: 1 }))
      .toEqual([1]);
  });
});
