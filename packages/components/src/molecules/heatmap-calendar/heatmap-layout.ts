import type {
  HeatmapCell,
  HeatmapDay,
  HeatmapLayout,
  HeatmapMonthLabel,
  HeatmapWeekStart,
} from './types.js';

type CivilDate = { year: number; month: number; day: number };

export function parseDate(value: string): CivilDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  return date.month >= 1 &&
    date.month <= 12 &&
    date.day >= 1 &&
    date.day <= daysInMonth(date.year, date.month)
    ? date
    : null;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysFromCivil(date: CivilDate): number {
  let year = date.year;
  year -= date.month <= 2 ? 1 : 0;
  const era = Math.floor(year / 400);
  const yearOfEra = year - era * 400;
  const adjustedMonth = date.month + (date.month > 2 ? -3 : 9);
  const dayOfYear = Math.floor((153 * adjustedMonth + 2) / 5) + date.day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

export function civilFromDays(days: number): CivilDate {
  const shifted = days + 719468;
  const era = Math.floor(shifted / 146097);
  const dayOfEra = shifted - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36524) -
      Math.floor(dayOfEra / 146096)) /
      365,
  );
  let year = yearOfEra + era * 400;
  const dayOfYear =
    dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthPrime = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * monthPrime + 2) / 5) + 1;
  const month = monthPrime + (monthPrime < 10 ? 3 : -9);
  year += month <= 2 ? 1 : 0;
  return { year, month, day };
}

export function formatCivil(date: CivilDate): string {
  return `${String(date.year).padStart(4, '0')}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

export function levelForValue(value: number, max: number): number {
  if (value <= 0 || max <= 0) {
    return 0;
  }
  return Math.min(4, Math.max(1, Math.ceil((value / max) * 4)));
}

function startOrdinal(end: CivilDate, months: number): number {
  const totalMonths = end.year * 12 + end.month - 1 - Math.max(1, months);
  const year = Math.floor(totalMonths / 12);
  const month = totalMonths - year * 12 + 1;
  const day = Math.min(end.day, daysInMonth(year, month));
  return daysFromCivil({ year, month, day }) + 1;
}

function weekRow(ordinal: number, weekStart: HeatmapWeekStart): number {
  const sundayBased = (((ordinal + 4) % 7) + 7) % 7;
  return weekStart === 'monday' ? (sundayBased + 6) % 7 : sundayBased;
}

function monthLabels(cells: HeatmapCell[]): HeatmapMonthLabel[] {
  const labels: HeatmapMonthLabel[] = [];
  for (const cell of cells) {
    const previous = labels.at(-1);
    const month = cell.date.slice(0, 7);
    if (!previous || previous.date.slice(0, 7) !== month) {
      labels.push({ date: cell.date, column: cell.column });
    }
  }
  return labels.filter(
    (label, index) => index === 0 || label.column > labels[index - 1]!.column + 1,
  );
}

export function computeHeatmapLayout(
  data: readonly HeatmapDay[],
  endDate: string,
  months: number,
  weekStart: HeatmapWeekStart,
): HeatmapLayout {
  const end = parseDate(endDate);
  if (!end) {
    return { cells: [], monthLabels: [], maxValue: 0, weekCount: 0 };
  }
  const values = new Map(data.map((day) => [day.date, Math.max(0, day.value)]));
  const endOrdinal = daysFromCivil(end);
  const windowStart = startOrdinal(end, months);
  const gridStart = windowStart - weekRow(windowStart, weekStart);
  const maxValue = Math.max(0, ...data.map((day) => day.value));
  const cells: HeatmapCell[] = [];
  for (let ordinal = gridStart; ordinal <= endOrdinal; ordinal += 1) {
    const date = formatCivil(civilFromDays(ordinal));
    const value = values.get(date) ?? 0;
    cells.push({
      date,
      value,
      level: levelForValue(value, maxValue),
      column: Math.floor((ordinal - gridStart) / 7),
      row: weekRow(ordinal, weekStart),
    });
  }
  return {
    cells,
    monthLabels: monthLabels(cells),
    maxValue,
    weekCount: cells.at(-1)?.column != null ? cells.at(-1)!.column + 1 : 0,
  };
}
