/**
 * Local-notification subset of `expo-notifications`.
 *
 * Importing the package root on Android evaluates its push-topic module, which
 * calls `requireNativeModule('ExpoTopicSubscriptionModule')`. Expo Go does not
 * ship that native module, so the app crashes before the first screen renders.
 *
 * These deep imports load only the local-notification modules that Expo Go
 * supports. Re-check them whenever `expo-notifications` is upgraded.
 */
export {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
export type { NotificationPermissionsStatus } from 'expo-notifications/build/NotificationPermissions.types';
export { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
export { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
export { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
export { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
export { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
export { IosAuthorizationStatus } from 'expo-notifications/build/NotificationPermissions.types';
export { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
