import { describe, expect, it } from '@jest/globals';

import { DefaultJaapTarget } from '@/data/jaap';
import {
  InitialJaapState,
  getJaapProgress,
  incrementJaap,
  isJaapComplete,
  mergeRestoredJaap,
  resetJaap,
  selectJaapTarget,
} from '@/lib/jaap-state';

describe('jaap state', () => {
  it('starts at zero with the default target', () => {
    expect(InitialJaapState).toEqual({ count: 0, target: DefaultJaapTarget });
  });

  it('increments without changing the target', () => {
    const next = incrementJaap({ count: 4, target: 27 });

    expect(next).toEqual({ count: 5, target: 27 });
  });

  it('does not increment past the safe integer limit', () => {
    const state = { count: Number.MAX_SAFE_INTEGER, target: 108 } as const;

    expect(incrementJaap(state)).toBe(state);
  });

  it('resets only the count', () => {
    expect(resetJaap({ count: 54, target: 27 })).toEqual({ count: 0, target: 27 });
  });

  it('changes the target without resetting progress', () => {
    expect(selectJaapTarget({ count: 54, target: 108 }, 27)).toEqual({
      count: 54,
      target: 27,
    });
  });

  it('clamps progress between zero and one', () => {
    expect(getJaapProgress({ count: -3, target: 108 })).toBe(0);
    expect(getJaapProgress({ count: 0, target: 108 })).toBe(0);
    expect(getJaapProgress({ count: 54, target: 108 })).toBe(0.5);
    expect(getJaapProgress({ count: 108, target: 108 })).toBe(1);
    expect(getJaapProgress({ count: 500, target: 108 })).toBe(1);
  });

  it('marks a target complete at the exact count or above', () => {
    expect(isJaapComplete({ count: 26, target: 27 })).toBe(false);
    expect(isJaapComplete({ count: 27, target: 27 })).toBe(true);
    expect(isJaapComplete({ count: 200, target: 108 })).toBe(true);
  });

  it('uses the restored count when there was no interaction during hydration', () => {
    expect(
      mergeRestoredJaap({ count: 40, target: 54 }, { count: 0, target: 108 }, 'none', false)
    ).toEqual({ count: 40, target: 54 });
  });

  it('adds taps made during hydration to the restored count', () => {
    expect(
      mergeRestoredJaap({ count: 40, target: 54 }, { count: 2, target: 54 }, 'add', false)
    ).toEqual({ count: 42, target: 54 });
  });

  it('keeps a reset made during hydration instead of restoring the count', () => {
    expect(
      mergeRestoredJaap({ count: 40, target: 54 }, { count: 0, target: 54 }, 'reset', false)
    ).toEqual({ count: 0, target: 54 });
  });

  it('keeps a target changed during hydration', () => {
    expect(
      mergeRestoredJaap({ count: 40, target: 54 }, { count: 0, target: 27 }, 'none', true)
    ).toEqual({ count: 40, target: 27 });
  });
});
