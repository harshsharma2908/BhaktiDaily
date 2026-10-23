import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredRead =
  | { status: 'ok'; value: unknown }
  | { status: 'missing' }
  | { status: 'invalid' }
  | { status: 'error' };

/**
 * Small, defensive wrapper around AsyncStorage.
 *
 * Storage is optional for the app: read and write failures are reported as a
 * status instead of rejecting, so a device with unavailable storage cannot
 * crash a screen.
 */
const lastWritten = new Map<string, string>();

export async function readStoredJson(key: string): Promise<StoredRead> {
  let raw: string | null;

  try {
    raw = await AsyncStorage.getItem(key);
  } catch {
    return { status: 'error' };
  }

  if (raw == null) {
    return { status: 'missing' };
  }

  try {
    const value = JSON.parse(raw) as unknown;
    // Cache the canonical form so a later identical save is skipped.
    lastWritten.set(key, JSON.stringify(value));
    return { status: 'ok', value };
  } catch {
    return { status: 'invalid' };
  }
}

export async function writeStoredJson(key: string, value: unknown): Promise<boolean> {
  let serialized: string;

  try {
    serialized = JSON.stringify(value);
  } catch {
    return false;
  }

  if (lastWritten.get(key) === serialized) {
    return true;
  }

  try {
    await AsyncStorage.setItem(key, serialized);
    lastWritten.set(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export async function removeStoredValue(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    lastWritten.delete(key);
    return true;
  } catch {
    return false;
  }
}
