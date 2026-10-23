import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { Linking, Platform } from 'react-native';

export type ReminderPermission = 'granted' | 'denied' | 'unsupported' | 'error';

export type ReminderScheduleResult =
  | { ok: true }
  | { ok: false; reason: Exclude<ReminderPermission, 'granted'> };

export const ReminderNotificationId = 'bhakti-daily.daily-reminder';
export const ReminderChannelId = 'daily-reminder';

export const isReminderSupported = true;

const reminderContent = {
  title: 'भक्ति दैनिक',
  body: 'अपने दिन में एक शांत क्षण, स्मरण के लिए।',
  sound: false,
  data: { source: 'daily-reminder' },
} as const;

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ReminderChannelId, {
    name: 'दैनिक स्मरण',
    description: 'भक्ति दैनिक का वैकल्पिक दैनिक रिमाइंडर',
    importance: AndroidImportance.DEFAULT,
    sound: null,
    enableVibrate: false,
    showBadge: false,
  });
}

function interpretPermission(
  permissions: Notifications.NotificationPermissionsStatus
): ReminderPermission {
  if (permissions.granted) {
    return 'granted';
  }

  if (permissions.ios?.status === IosAuthorizationStatus.PROVISIONAL) {
    return 'granted';
  }

  return 'denied';
}

/**
 * Reads permission without prompting. Safe to call during startup.
 */
export async function getReminderPermission(): Promise<ReminderPermission> {
  try {
    return interpretPermission(await Notifications.getPermissionsAsync());
  } catch {
    return 'error';
  }
}

/**
 * Prompts only when the caller has explicitly enabled reminders.
 */
export async function requestReminderPermission(): Promise<ReminderPermission> {
  try {
    await ensureChannel();

    const current = await Notifications.getPermissionsAsync();
    if (interpretPermission(current) === 'granted') {
      return 'granted';
    }

    if (current.status === 'denied' && !current.canAskAgain) {
      return 'denied';
    }

    return interpretPermission(await Notifications.requestPermissionsAsync());
  } catch {
    return 'error';
  }
}

async function scheduleInternal(hour: number, minute: number): Promise<ReminderScheduleResult> {
  try {
    const permission = await getReminderPermission();
    if (permission !== 'granted') {
      return { ok: false, reason: permission };
    }

    await ensureChannel();

    // A fixed identifier plus a cancel-first policy keeps exactly one intended
    // reminder in the system queue. A missing identifier is not an error.
    await Notifications.cancelScheduledNotificationAsync(ReminderNotificationId).catch(
      () => undefined
    );
    await Notifications.scheduleNotificationAsync({
      identifier: ReminderNotificationId,
      content: { ...reminderContent },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: ReminderChannelId,
      },
    });

    return { ok: true };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

/**
 * Schedules one daily reminder. Calls are serialized so rapid time changes
 * cannot leave duplicate notifications behind.
 */
export function scheduleDailyReminder(
  hour: number,
  minute: number
): Promise<ReminderScheduleResult> {
  return enqueue(() => scheduleInternal(hour, minute));
}

export function cancelDailyReminder(): Promise<boolean> {
  return enqueue(async () => {
    try {
      await Notifications.cancelScheduledNotificationAsync(ReminderNotificationId);
      return true;
    } catch {
      return false;
    }
  });
}

export async function openReminderSettings(): Promise<boolean> {
  try {
    await Linking.openSettings();
    return true;
  } catch {
    return false;
  }
}

/**
 * Foreground presentation is intentionally quiet: no sound and no badge.
 * Background delivery still uses the Android channel configuration.
 */
export function configureNotificationHandler(): void {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // A handler failure must not stop the app from running.
  }
}
