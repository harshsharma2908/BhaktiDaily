import {
  AndroidImportance,
  IosAuthorizationStatus,
  SchedulableTriggerInputTypes,
  cancelScheduledNotificationAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
  type NotificationPermissionsStatus,
} from '@/services/notifications';
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

  try {
    await setNotificationChannelAsync(ReminderChannelId, {
      name: 'दैनिक स्मरण',
      description: 'भक्ति दैनिक का वैकल्पिक दैनिक रिमाइंडर',
      // `expo-notifications` 58.1.6 cannot convert a null `sound` value to a
      // native Bundle; a low-importance channel is silent without one.
      importance: AndroidImportance.LOW,
      enableVibrate: false,
      showBadge: false,
    });
  } catch (error) {
    // Expo Go 58.0.5 rejects channel creation on Android 14. Scheduling still
    // works through Expo's silent fallback channel, so a channel failure must
    // not block an explicitly enabled reminder. A development/release build
    // can use the configured channel above when the native module supports it.
    console.warn('[reminders] could not create the reminder channel', error);
  }
}

function interpretPermission(
  permissions: NotificationPermissionsStatus
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
    return interpretPermission(await getPermissionsAsync());
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

    const current = await getPermissionsAsync();
    if (interpretPermission(current) === 'granted') {
      return 'granted';
    }

    if (current.status === 'denied' && !current.canAskAgain) {
      return 'denied';
    }

    return interpretPermission(await requestPermissionsAsync());
  } catch {
    return 'error';
  }
}

async function scheduleInternal(hour: number, minute: number): Promise<ReminderScheduleResult> {
  try {
    // A fixed identifier plus a cancel-first policy keeps exactly one intended
    // reminder in the system queue. Cancel before checking permission too, so a
    // revoked permission cannot leave an old reminder scheduled at a stale
    // time. A missing identifier is not an error.
    await cancelScheduledNotificationAsync(ReminderNotificationId).catch(() => undefined);

    const permission = await getReminderPermission();
    if (permission !== 'granted') {
      return { ok: false, reason: permission };
    }

    await ensureChannel();

    await scheduleNotificationAsync({
      identifier: ReminderNotificationId,
      content: { ...reminderContent },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
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
      await cancelScheduledNotificationAsync(ReminderNotificationId);
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
    setNotificationHandler({
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
