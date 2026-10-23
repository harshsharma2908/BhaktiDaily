export type ReminderTime = {
  hour: number;
  minute: number;
};

export const MinutesPerDay = 24 * 60;
export const ReminderStepMinutes = 5;

export function padTimePart(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatReminderTime(time: ReminderTime): string {
  return `${padTimePart(time.hour)}:${padTimePart(time.minute)}`;
}

/**
 * Moves the reminder time by a number of minutes and wraps around midnight.
 * The settings UI only ever writes five-minute steps.
 */
export function adjustReminderTime(time: ReminderTime, deltaMinutes: number): ReminderTime {
  const current = time.hour * 60 + time.minute;
  const next = (((current + deltaMinutes) % MinutesPerDay) + MinutesPerDay) % MinutesPerDay;

  return {
    hour: Math.floor(next / 60),
    minute: next % 60,
  };
}

export function adjustReminderTimeByStep(time: ReminderTime, steps: number): ReminderTime {
  return adjustReminderTime(time, steps * ReminderStepMinutes);
}
