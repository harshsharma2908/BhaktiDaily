import { DefaultJaapTarget } from '@/data/jaap';
import { isJaapTarget, type JaapState } from '@/lib/jaap-state';
import { isRecord, isSafeCount } from '@/lib/validation';

import { readStoredJson, writeStoredJson, type StoredRead } from './json-storage';
import { StorageKeys } from './keys';

export const JaapStorageVersion = 1;

type StoredJaapState = {
  version: typeof JaapStorageVersion;
  count: number;
  target: JaapState['target'];
};

/**
 * Reads persisted state field by field. A corrupt count or target falls back to
 * a safe value instead of discarding the rest of the payload. A payload from an
 * unknown schema version is ignored entirely.
 */
export function parseStoredJaap(raw: unknown): JaapState | null {
  if (!isRecord(raw) || raw.version !== JaapStorageVersion) {
    return null;
  }

  return {
    count: isSafeCount(raw.count) ? raw.count : 0,
    target: isJaapTarget(raw.target) ? raw.target : DefaultJaapTarget,
  };
}

export function serializeJaapState(state: JaapState): StoredJaapState {
  return {
    version: JaapStorageVersion,
    count: state.count,
    target: state.target,
  };
}

export type LoadedJaapState = {
  state: JaapState | null;
  status: StoredRead['status'];
};

export async function loadJaapState(): Promise<LoadedJaapState> {
  const result = await readStoredJson(StorageKeys.jaap);

  if (result.status !== 'ok') {
    return { state: null, status: result.status };
  }

  const state = parseStoredJaap(result.value);
  return {
    state,
    status: state ? 'ok' : 'invalid',
  };
}

export async function saveJaapState(state: JaapState): Promise<boolean> {
  return writeStoredJson(StorageKeys.jaap, serializeJaapState(state));
}
