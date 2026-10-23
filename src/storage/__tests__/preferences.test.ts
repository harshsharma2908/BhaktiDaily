import { describe, expect, it } from '@jest/globals';

import {
  DefaultPreferences,
  mergeRestoredPreferences,
  parseStoredPreferences,
  serializePreferences,
} from '@/storage/preferences';

describe('preferences storage mapping', () => {
  it('returns defaults for missing or unknown-version payloads', () => {
    expect(parseStoredPreferences(null)).toEqual(DefaultPreferences);
    expect(parseStoredPreferences({})).toEqual(DefaultPreferences);
    expect(parseStoredPreferences({ version: 2, appearance: 'dark' })).toEqual(DefaultPreferences);
  });

  it('reads valid preferences', () => {
    expect(
      parseStoredPreferences({
        version: 1,
        appearance: 'dark',
        reminder: { enabled: true, hour: 6, minute: 30 },
      })
    ).toEqual({
      appearance: 'dark',
      reminder: { enabled: true, hour: 6, minute: 30 },
    });
  });

  it('falls back per field instead of discarding the whole payload', () => {
    expect(
      parseStoredPreferences({
        version: 1,
        appearance: 'sepia',
        reminder: { enabled: true, hour: 6, minute: 30 },
      })
    ).toEqual({
      appearance: 'system',
      reminder: { enabled: true, hour: 6, minute: 30 },
    });

    expect(
      parseStoredPreferences({
        version: 1,
        appearance: 'light',
        reminder: { enabled: 'yes', hour: 99, minute: -1 },
      })
    ).toEqual({
      appearance: 'light',
      reminder: { enabled: false, hour: 8, minute: 0 },
    });
  });

  it('round-trips through serialization', () => {
    const preferences = {
      appearance: 'light',
      reminder: { enabled: true, hour: 21, minute: 45 },
    } as const;

    const stored = serializePreferences(preferences);

    expect(stored).toEqual({
      version: 1,
      appearance: 'light',
      reminder: { enabled: true, hour: 21, minute: 45 },
    });
    expect(parseStoredPreferences(stored)).toEqual(preferences);
  });

  it('merges a toggle during hydration without losing the saved time', () => {
    expect(
      mergeRestoredPreferences(
        { appearance: 'dark', reminder: { enabled: false, hour: 6, minute: 30 } },
        { appearance: 'system', reminder: { enabled: false, hour: 8, minute: 0 } },
        { appearance: false, reminderEnabled: true, reminderTime: false }
      )
    ).toEqual({
      appearance: 'dark',
      reminder: { enabled: false, hour: 6, minute: 30 },
    });
  });

  it('merges a time change during hydration without losing the saved enabled state', () => {
    expect(
      mergeRestoredPreferences(
        { appearance: 'light', reminder: { enabled: true, hour: 6, minute: 30 } },
        { appearance: 'system', reminder: { enabled: false, hour: 12, minute: 15 } },
        { appearance: false, reminderEnabled: false, reminderTime: true }
      )
    ).toEqual({
      appearance: 'light',
      reminder: { enabled: true, hour: 12, minute: 15 },
    });
  });

  it('keeps an appearance change made during hydration', () => {
    expect(
      mergeRestoredPreferences(
        { appearance: 'light', reminder: { enabled: false, hour: 6, minute: 30 } },
        { appearance: 'dark', reminder: { enabled: false, hour: 8, minute: 0 } },
        { appearance: true, reminderEnabled: false, reminderTime: false }
      )
    ).toEqual({
      appearance: 'dark',
      reminder: { enabled: false, hour: 6, minute: 30 },
    });
  });
});
