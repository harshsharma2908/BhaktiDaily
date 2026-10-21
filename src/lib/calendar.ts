import { toDateKey } from '@/lib/date';

export const WEEKDAY_LABELS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'] as const;

export type MonthCell = {
  day: number;
  date: Date;
  key: string;
} | null;

/**
 * Builds a Sunday-first month grid. Empty leading/trailing cells keep the
 * seven-column layout aligned without rendering dates from other months.
 */
export function getMonthCells(year: number, month: number): MonthCell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: MonthCell[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({ day, date, key: toDateKey(date) });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
