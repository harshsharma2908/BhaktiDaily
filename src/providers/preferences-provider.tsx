import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import type { ReminderTime } from '@/lib/reminder';
import {
  cancelDailyReminder,
  configureNotificationHandler,
  getReminderPermission,
  isReminderSupported,
  requestReminderPermission,
  scheduleDailyReminder,
  type ReminderPermission,
} from '@/services/reminders';
import {
  DefaultPreferences,
  loadPreferences,
  mergeRestoredPreferences,
  savePreferences,
  type AppPreferences,
  type AppearancePreference,
  type PreferenceTouch,
} from '@/storage/preferences';

export type ReminderStatus =
  | 'loading'
  | 'off'
  | 'scheduled'
  | 'permission-denied'
  | 'unsupported'
  | 'error';

type PreferencesContextValue = {
  preferences: AppPreferences;
  hydrated: boolean;
  saveError: boolean;
  reminderStatus: ReminderStatus;
  reminderSupported: boolean;
  setAppearance: (appearance: AppearancePreference) => Promise<void>;
  setReminderEnabled: (enabled: boolean) => Promise<void>;
  setReminderTime: (time: ReminderTime) => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function statusForPermission(permission: ReminderPermission): ReminderStatus {
  if (permission === 'denied') {
    return 'permission-denied';
  }

  if (permission === 'unsupported') {
    return 'unsupported';
  }

  return 'error';
}

function cloneDefaults(): AppPreferences {
  return {
    appearance: DefaultPreferences.appearance,
    reminder: { ...DefaultPreferences.reminder },
  };
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<AppPreferences>(cloneDefaults);
  const [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<ReminderStatus>('loading');

  const preferencesRef = useRef(preferences);
  const hydratedRef = useRef(false);
  const touchedRef = useRef<PreferenceTouch>({
    appearance: false,
    reminderEnabled: false,
    reminderTime: false,
  });
  const toggleRef = useRef(0);
  const saveQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  const applyPreferences = useCallback((next: AppPreferences) => {
    preferencesRef.current = next;
    setPreferences(next);
  }, []);

  /**
   * Saves are queued in order. If a write fails, the in-memory preference is
   * still applied for the current session and the UI shows a storage notice.
   */
  const persist = useCallback((next: AppPreferences): Promise<boolean> => {
    const run = saveQueueRef.current.then(async () => {
      const saved = await savePreferences(next);
      setSaveError(!saved);
      return saved;
    });

    saveQueueRef.current = run.then(
      () => undefined,
      () => undefined
    );

    return run;
  }, []);

  useEffect(() => {
    configureNotificationHandler();

    let cancelled = false;

    async function hydrate() {
      const loaded = await loadPreferences();
      if (cancelled) {
        return;
      }

      const touched = touchedRef.current;
      const merged = mergeRestoredPreferences(
        loaded.preferences,
        preferencesRef.current,
        touched
      );

      applyPreferences(merged);
      hydratedRef.current = true;
      setHydrated(true);

      if (loaded.status === 'error') {
        setSaveError(true);
      }

      if (
        loaded.status === 'invalid' ||
        touched.appearance ||
        touched.reminderEnabled ||
        touched.reminderTime
      ) {
        void persist(merged);
      }

      // A toggle that started before hydration owns the reminder state and
      // will reconcile the schedule itself.
      if (toggleRef.current !== 0) {
        return;
      }

      if (!isReminderSupported) {
        setReminderStatus('unsupported');
        return;
      }

      if (!merged.reminder.enabled) {
        void cancelDailyReminder();
        setReminderStatus('off');
        return;
      }

      const token = toggleRef.current;
      const permission = await getReminderPermission();
      if (cancelled || token !== toggleRef.current) {
        return;
      }

      if (permission !== 'granted') {
        await cancelDailyReminder();
        if (!cancelled && token === toggleRef.current) {
          setReminderStatus(statusForPermission(permission));
        }
        return;
      }

      const result = await scheduleDailyReminder(
        merged.reminder.hour,
        merged.reminder.minute
      );
      if (!cancelled && token === toggleRef.current) {
        setReminderStatus(result.ok ? 'scheduled' : 'error');
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [applyPreferences, persist]);

  const setAppearance = useCallback(
    async (appearance: AppearancePreference) => {
      touchedRef.current.appearance = true;
      const next: AppPreferences = { ...preferencesRef.current, appearance };
      applyPreferences(next);

      // Hydration reads the merged value and writes it. Writing before the
      // read finishes could replace still-unread reminder settings.
      if (hydratedRef.current) {
        await persist(next);
      }
    },
    [applyPreferences, persist]
  );

  const setReminderEnabled = useCallback(
    async (enabled: boolean) => {
      // The switch is disabled while loading, but keep this guard so a fast
      // call cannot persist defaults over unread state.
      if (!hydratedRef.current) {
        return;
      }

      touchedRef.current.reminderEnabled = true;
      const token = ++toggleRef.current;

      if (!isReminderSupported) {
        setReminderStatus('unsupported');
        return;
      }

      if (!enabled) {
        setReminderStatus('loading');
        const cancelled = await cancelDailyReminder();
        if (token !== toggleRef.current) {
          return;
        }

        const next: AppPreferences = {
          ...preferencesRef.current,
          reminder: { ...preferencesRef.current.reminder, enabled: false },
        };
        applyPreferences(next);
        const saved = await persist(next);
        if (token !== toggleRef.current) {
          return;
        }

        setReminderStatus(cancelled && saved ? 'off' : 'error');
        return;
      }

      setReminderStatus('loading');
      const permission = await requestReminderPermission();
      if (token !== toggleRef.current) {
        return;
      }

      if (permission !== 'granted') {
        setReminderStatus(statusForPermission(permission));
        return;
      }

      const { hour, minute } = preferencesRef.current.reminder;
      const result = await scheduleDailyReminder(hour, minute);
      if (token !== toggleRef.current) {
        return;
      }

      if (!result.ok) {
        setReminderStatus(
          result.reason === 'denied' ? 'permission-denied' : statusForPermission(result.reason)
        );
        return;
      }

      const next: AppPreferences = {
        ...preferencesRef.current,
        reminder: { ...preferencesRef.current.reminder, enabled: true },
      };
      applyPreferences(next);
      const saved = await persist(next);
      if (token !== toggleRef.current) {
        return;
      }

      if (!saved) {
        await cancelDailyReminder();
        applyPreferences({
          ...preferencesRef.current,
          reminder: { ...preferencesRef.current.reminder, enabled: false },
        });
        setReminderStatus('error');
        return;
      }

      setReminderStatus('scheduled');
    },
    [applyPreferences, persist]
  );

  const setReminderTime = useCallback(
    async (time: ReminderTime) => {
      touchedRef.current.reminderTime = true;
      const next: AppPreferences = {
        ...preferencesRef.current,
        reminder: { ...preferencesRef.current.reminder, ...time },
      };
      applyPreferences(next);

      // Hydration will merge this time with the saved enabled state and
      // reconcile the schedule. Scheduling here would use defaults.
      if (!hydratedRef.current) {
        return;
      }

      const shouldReschedule = next.reminder.enabled && isReminderSupported;

      // Disable the controls before the asynchronous write so a simultaneous
      // toggle cannot race the reschedule.
      if (shouldReschedule) {
        setReminderStatus('loading');
      }

      const saved = await persist(next);
      if (!saved) {
        setSaveError(true);
      }

      if (!shouldReschedule) {
        return;
      }

      const token = toggleRef.current;
      const result = await scheduleDailyReminder(time.hour, time.minute);
      if (token !== toggleRef.current) {
        return;
      }

      setReminderStatus(
        result.ok
          ? 'scheduled'
          : result.reason === 'denied'
            ? 'permission-denied'
            : statusForPermission(result.reason)
      );
    },
    [applyPreferences, persist]
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      hydrated,
      saveError,
      reminderStatus,
      reminderSupported: isReminderSupported,
      setAppearance,
      setReminderEnabled,
      setReminderTime,
    }),
    [
      preferences,
      hydrated,
      saveError,
      reminderStatus,
      setAppearance,
      setReminderEnabled,
      setReminderTime,
    ]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }

  return context;
}
