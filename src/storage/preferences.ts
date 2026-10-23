import { isIntegerInRange, isRecord } from '@/lib/validation';

import { readStoredJson, writeStoredJson } from './json-storage';
import { StorageKeys } from './keys';

export const PreferencesStorageVersion = 1;

export const DefaultReminderTime = {
  hour: 8,
  minute: 0,
} as const;

export type AppearancePreference = 'system' | 'light' | 'dark';

export type ReminderPreferences = {
  enabled: boolean;
  hour: number;
  minute: number;
};

export type AppPreferences = {
  appearance: AppearancePreference;
  reminder: ReminderPreferences;
};

export type PreferenceTouch = {
  appearance: boolean;
  reminderEnabled: boolean;
  reminderTime: boolean;
};

export const DefaultPreferences: AppPreferences = {
  appearance: 'system',
  reminder: {
    enabled: false,
    ...DefaultReminderTime,
  },
};

type StoredPreferences = AppPreferences & {
  version: typeof PreferencesStorageVersion;
};

export function isAppearancePreference(value: unknown): value is AppearancePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

/**
 * Restores each supported preference independently. Unknown or malformed
 * values fall back to the default for that field, so a partial write cannot
 * leave the app in an invalid state.
 */
export function parseStoredPreferences(raw: unknown): AppPreferences {
  if (!isRecord(raw) || raw.version !== PreferencesStorageVersion) {
    return {
      appearance: DefaultPreferences.appearance,
      reminder: { ...DefaultPreferences.reminder },
    };
  }

  const reminder = isRecord(raw.reminder) ? raw.reminder : {};

  return {
    appearance: isAppearancePreference(raw.appearance)
      ? raw.appearance
      : DefaultPreferences.appearance,
    reminder: {
      enabled: typeof reminder.enabled === 'boolean' ? reminder.enabled : false,
      hour: isIntegerInRange(reminder.hour, 0, 23)
        ? reminder.hour
        : DefaultReminderTime.hour,
      minute: isIntegerInRange(reminder.minute, 0, 59)
        ? reminder.minute
        : DefaultReminderTime.minute,
    },
  };
}

export function serializePreferences(preferences: AppPreferences): StoredPreferences {
  return {
    version: PreferencesStorageVersion,
    appearance: preferences.appearance,
    reminder: { ...preferences.reminder },
  };
}

/**
 * Keeps changes made while saved preferences were still loading. The reminder
 * fields are tracked separately so toggling the switch cannot discard a saved
 * time, and changing the time cannot discard a saved enabled state.
 */
export function mergeRestoredPreferences(
  restored: AppPreferences,
  current: AppPreferences,
  touched: PreferenceTouch
): AppPreferences {
  return {
    appearance: touched.appearance ? current.appearance : restored.appearance,
    reminder: {
      enabled: touched.reminderEnabled ? current.reminder.enabled : restored.reminder.enabled,
      hour: touched.reminderTime ? current.reminder.hour : restored.reminder.hour,
      minute: touched.reminderTime ? current.reminder.minute : restored.reminder.minute,
    },
  };
}

export type LoadedPreferences = {
  preferences: AppPreferences;
  status: 'ok' | 'missing' | 'invalid' | 'error';
};

export async function loadPreferences(): Promise<LoadedPreferences> {
  const result = await readStoredJson(StorageKeys.preferences);

  if (result.status !== 'ok') {
    return {
      preferences: {
        appearance: DefaultPreferences.appearance,
        reminder: { ...DefaultPreferences.reminder },
      },
      status: result.status,
    };
  }

  return {
    preferences: parseStoredPreferences(result.value),
    status: 'ok',
  };
}

export async function savePreferences(preferences: AppPreferences): Promise<boolean> {
  return writeStoredJson(StorageKeys.preferences, serializePreferences(preferences));
}
