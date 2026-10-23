export type ReminderPermission = 'granted' | 'denied' | 'unsupported' | 'error';

export type ReminderScheduleResult =
  | { ok: true }
  | { ok: false; reason: Exclude<ReminderPermission, 'granted'> };

export const ReminderNotificationId = 'bhakti-daily.daily-reminder';
export const ReminderChannelId = 'daily-reminder';

/**
 * expo-notifications does not support the web build. The settings screen shows
 * an honest unavailable state instead of pretending a reminder was scheduled.
 */
export const isReminderSupported = false;

export async function getReminderPermission(): Promise<ReminderPermission> {
  return 'unsupported';
}

export async function requestReminderPermission(): Promise<ReminderPermission> {
  return 'unsupported';
}

export async function scheduleDailyReminder(): Promise<ReminderScheduleResult> {
  return { ok: false, reason: 'unsupported' };
}

/** Nothing is ever scheduled on web, so there is nothing to cancel. */
export async function cancelDailyReminder(): Promise<boolean> {
  return true;
}

export async function openReminderSettings(): Promise<boolean> {
  return false;
}

export function configureNotificationHandler(): void {
  // No-op on web.
}
