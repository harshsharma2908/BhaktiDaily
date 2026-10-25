import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { PermissionStatus } from 'expo-modules-core';
import { Platform } from 'react-native';
import * as Notifications from '@/services/notifications';

import {
  ReminderNotificationId,
  cancelDailyReminder,
  requestReminderPermission,
  scheduleDailyReminder,
} from '@/services/reminders';

jest.mock('@/services/notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  AndroidImportance: { DEFAULT: 5, LOW: 4 },
  IosAuthorizationStatus: { PROVISIONAL: 3 },
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

const getPermissions = jest.mocked(Notifications.getPermissionsAsync);
const requestPermissions = jest.mocked(Notifications.requestPermissionsAsync);
const setChannel = jest.mocked(Notifications.setNotificationChannelAsync);
const cancelScheduled = jest.mocked(Notifications.cancelScheduledNotificationAsync);
const scheduleNotification = jest.mocked(Notifications.scheduleNotificationAsync);

function permissionStatus(
  overrides: Partial<Notifications.NotificationPermissionsStatus> = {}
): Notifications.NotificationPermissionsStatus {
  return {
    granted: false,
    canAskAgain: true,
    status: PermissionStatus.UNDETERMINED,
    expires: 'never',
    ...overrides,
  } as Notifications.NotificationPermissionsStatus;
}

describe('local reminders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPermissions.mockResolvedValue(permissionStatus());
    requestPermissions.mockResolvedValue(permissionStatus());
    setChannel.mockResolvedValue(null);
    cancelScheduled.mockResolvedValue(undefined);
    scheduleNotification.mockResolvedValue('scheduled-id');
  });

  it('schedules one identified daily notification when permission is granted', async () => {
    getPermissions.mockResolvedValue(
      permissionStatus({ granted: true, status: PermissionStatus.GRANTED })
    );

    const result = await scheduleDailyReminder(7, 30);

    expect(result).toEqual({ ok: true });
    expect(cancelScheduled).toHaveBeenCalledWith(ReminderNotificationId);
    expect(scheduleNotification).toHaveBeenCalledTimes(1);
    expect(scheduleNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: ReminderNotificationId,
        trigger: expect.objectContaining({
          type: 'daily',
          hour: 7,
          minute: 30,
        }),
      })
    );
  });

  it('creates a silent channel without a null sound value', async () => {
    getPermissions.mockResolvedValue(
      permissionStatus({ granted: true, status: PermissionStatus.GRANTED })
    );
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });

    try {
      await scheduleDailyReminder(7, 30);

      expect(setChannel).toHaveBeenCalledWith(
        'daily-reminder',
        expect.objectContaining({
          importance: 4,
          enableVibrate: false,
          showBadge: false,
        })
      );
      expect(setChannel.mock.calls[0][1]).not.toHaveProperty('sound');
    } finally {
      Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
    }
  });

  it('still schedules when channel creation is unavailable', async () => {
    getPermissions.mockResolvedValue(
      permissionStatus({ granted: true, status: PermissionStatus.GRANTED })
    );
    setChannel.mockRejectedValue(new Error('channel unavailable'));
    const originalOS = Platform.OS;
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });

    try {
      const result = await scheduleDailyReminder(7, 30);

      expect(result).toEqual({ ok: true });
      expect(scheduleNotification).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
      warn.mockRestore();
    }
  });

  it('cancels the old reminder and does not schedule when permission is missing', async () => {
    getPermissions.mockResolvedValue(
      permissionStatus({ granted: false, canAskAgain: false, status: PermissionStatus.DENIED })
    );

    const result = await scheduleDailyReminder(7, 30);

    expect(result).toEqual({ ok: false, reason: 'denied' });
    expect(cancelScheduled).toHaveBeenCalledWith(ReminderNotificationId);
    expect(scheduleNotification).not.toHaveBeenCalled();
  });

  it('returns denied when the user rejects the permission prompt', async () => {
    getPermissions.mockResolvedValue(
      permissionStatus({ status: PermissionStatus.UNDETERMINED })
    );
    requestPermissions.mockResolvedValue(
      permissionStatus({ canAskAgain: false, status: PermissionStatus.DENIED })
    );

    await expect(requestReminderPermission()).resolves.toBe('denied');
  });

  it('does not prompt again when the OS can no longer ask', async () => {
    getPermissions.mockResolvedValue(
      permissionStatus({ canAskAgain: false, status: PermissionStatus.DENIED })
    );

    await expect(requestReminderPermission()).resolves.toBe('denied');
    expect(requestPermissions).not.toHaveBeenCalled();
  });

  it('cancels the fixed reminder identifier', async () => {
    await expect(cancelDailyReminder()).resolves.toBe(true);
    expect(cancelScheduled).toHaveBeenCalledWith(ReminderNotificationId);
  });

  it('reports an error instead of throwing when the native API fails', async () => {
    getPermissions.mockRejectedValue(new Error('native failure'));

    await expect(scheduleDailyReminder(7, 30)).resolves.toEqual({
      ok: false,
      reason: 'error',
    });

    cancelScheduled.mockRejectedValue(new Error('native failure'));
    await expect(cancelDailyReminder()).resolves.toBe(false);
  });
});
