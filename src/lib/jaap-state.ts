import { DefaultJaapTarget, JaapTargets, type JaapTarget } from '@/data/jaap';

export type JaapState = {
  count: number;
  target: JaapTarget;
};

export const InitialJaapState: JaapState = {
  count: 0,
  target: DefaultJaapTarget,
};

export function incrementJaap(state: JaapState): JaapState {
  if (state.count >= Number.MAX_SAFE_INTEGER) {
    return state;
  }

  return { ...state, count: state.count + 1 };
}

export function resetJaap(state: JaapState): JaapState {
  return { ...state, count: 0 };
}

export function selectJaapTarget(state: JaapState, target: JaapTarget): JaapState {
  return { ...state, target };
}

/** Progress is always safe to render, even if a stored count was unusual. */
export function getJaapProgress(state: JaapState): number {
  if (!Number.isFinite(state.count) || state.count <= 0) {
    return 0;
  }

  return Math.min(state.count / state.target, 1);
}

export function isJaapComplete(state: JaapState): boolean {
  return state.count >= state.target;
}

export function isJaapTarget(value: unknown): value is JaapTarget {
  return typeof value === 'number' && (JaapTargets as readonly number[]).includes(value);
}

export type JaapCountInteraction = 'none' | 'add' | 'reset';

/**
 * Merges a restored value with taps that happened during hydration.
 * A reset wins over the stored count; ordinary taps are added to it.
 */
export function mergeRestoredJaap(
  restored: JaapState,
  current: JaapState,
  countMode: JaapCountInteraction,
  targetTouched: boolean
): JaapState {
  const count =
    countMode === 'reset'
      ? current.count
      : countMode === 'add'
        ? Math.min(restored.count + current.count, Number.MAX_SAFE_INTEGER)
        : restored.count;

  return {
    count,
    target: targetTouched ? current.target : restored.target,
  };
}
