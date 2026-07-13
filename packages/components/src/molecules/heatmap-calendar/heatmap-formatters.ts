import { parseDate } from './heatmap-layout.js';
import type { HeatmapWeekStart } from './types.js';

export function todayDate(): string {
  const date = new Date();
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function utcDate(value: string): Date {
  const date = parseDate(value)!;
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

export function defaultDateFormatter(locale?: string): (date: string) => string {
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
  return (date) => formatter.format(utcDate(date));
}

export function monthFormatter(locale?: string): (date: string) => string {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });
  return (date) => formatter.format(utcDate(date));
}

export function weekdayLabels(locale: string | undefined, weekStart: HeatmapWeekStart): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  const monday = Date.UTC(1970, 0, 5);
  const labels = Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(monday + index * 86400000)),
  );
  return weekStart === 'sunday' ? [labels[6]!, ...labels.slice(0, 6)] : labels;
}
