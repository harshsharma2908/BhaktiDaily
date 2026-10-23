import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadJaapState, saveJaapState } from '@/storage/jaap';
import { readStoredJson, removeStoredValue, writeStoredJson } from '@/storage/json-storage';
import { StorageKeys } from '@/storage/keys';
import { loadPreferences, savePreferences } from '@/storage/preferences';

describe('storage integration', () => {
  beforeEach(async () => {
    await removeStoredValue(StorageKeys.jaap);
    await removeStoredValue(StorageKeys.preferences);
    jest.clearAllMocks();
  });

  it('round-trips japa state through AsyncStorage', async () => {
    await expect(saveJaapState({ count: 7, target: 27 })).resolves.toBe(true);

    await expect(loadJaapState()).resolves.toEqual({
      state: { count: 7, target: 27 },
      status: 'ok',
    });
  });

  it('reports malformed JSON and unknown schemas as invalid', async () => {
    await AsyncStorage.setItem(StorageKeys.jaap, '{not json');
    await expect(loadJaapState()).resolves.toEqual({ state: null, status: 'invalid' });

    await AsyncStorage.setItem(
      StorageKeys.jaap,
      JSON.stringify({ version: 99, count: 7, target: 27 })
    );
    await expect(loadJaapState()).resolves.toEqual({ state: null, status: 'invalid' });
  });

  it('reports a read failure without throwing', async () => {
    jest
      .mocked(AsyncStorage.getItem)
      .mockRejectedValueOnce(new Error('storage unavailable'))
      .mockRejectedValueOnce(new Error('storage unavailable'));

    await expect(readStoredJson(StorageKeys.jaap)).resolves.toEqual({ status: 'error' });
    await expect(loadJaapState()).resolves.toEqual({
      state: null,
      status: 'error',
    });
  });

  it('reports a write failure without throwing', async () => {
    jest
      .mocked(AsyncStorage.setItem)
      .mockRejectedValueOnce(new Error('disk full'))
      .mockRejectedValueOnce(new Error('disk full'));

    await expect(saveJaapState({ count: 8, target: 54 })).resolves.toBe(false);
    await expect(writeStoredJson('test/write-failure', { value: 1 })).resolves.toBe(false);
  });

  it('round-trips preferences and recovers defaults from invalid JSON', async () => {
    const preferences = {
      appearance: 'dark',
      reminder: { enabled: true, hour: 6, minute: 30 },
    } as const;

    await expect(savePreferences(preferences)).resolves.toBe(true);
    await expect(loadPreferences()).resolves.toEqual({
      preferences,
      status: 'ok',
    });

    await AsyncStorage.setItem(StorageKeys.preferences, 'broken');
    await expect(loadPreferences()).resolves.toEqual({
      preferences: {
        appearance: 'system',
        reminder: { enabled: false, hour: 8, minute: 0 },
      },
      status: 'invalid',
    });
  });
});
