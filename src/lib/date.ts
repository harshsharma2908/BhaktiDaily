const dateFormatter = new Intl.DateTimeFormat('hi-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const fullDateFormatter = new Intl.DateTimeFormat('hi-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const dayMonthFormatter = new Intl.DateTimeFormat('hi-IN', {
  day: 'numeric',
  month: 'short',
});

const monthFormatter = new Intl.DateTimeFormat('hi-IN', {
  month: 'long',
  year: 'numeric',
});

const shortMonthFormatter = new Intl.DateTimeFormat('hi-IN', {
  month: 'short',
});

export function formatHindiDate(date = new Date()) {
  return dateFormatter.format(date);
}

export function formatHindiFullDate(date = new Date()) {
  return fullDateFormatter.format(date);
}

export function formatHindiDayMonth(date = new Date()) {
  return dayMonthFormatter.format(date);
}

export function formatHindiMonth(date = new Date()) {
  return monthFormatter.format(date);
}

export function formatHindiMonthShort(date = new Date()) {
  return shortMonthFormatter.format(date);
}

/** A friendly, time-of-day greeting. It makes no religious claim. */
export function getHindiGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return 'सुप्रभात';
  }

  if (hour < 17) {
    return 'नमस्कार';
  }

  return 'शुभ संध्या';
}

/** Local calendar key (`YYYY-MM-DD`), avoiding UTC date shifts. */
export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
