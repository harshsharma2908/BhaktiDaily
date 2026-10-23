import { useCallback, useEffect, useRef, useState } from 'react';

import type { JaapTarget } from '@/data/jaap';
import {
  InitialJaapState,
  incrementJaap,
  mergeRestoredJaap,
  resetJaap,
  selectJaapTarget,
  type JaapCountInteraction,
  type JaapState,
} from '@/lib/jaap-state';
import { loadJaapState, saveJaapState } from '@/storage/jaap';

export type JaapLoadStatus = 'loading' | 'ready' | 'error';

const SaveDelayMs = 250;

/**
 * Owns the saved japa count and target. The hook hydrates before it writes,
 * merges any taps that happened during hydration, and debounces writes so a
 * burst of taps only persists the latest value.
 */
export function useJaap() {
  const [state, setState] = useState<JaapState>(InitialJaapState);
  const [loadStatus, setLoadStatus] = useState<JaapLoadStatus>('loading');
  const [saveError, setSaveError] = useState(false);

  const stateRef = useRef(state);
  const loadStatusRef = useRef<JaapLoadStatus>('loading');
  const touchedRef = useRef<{
    countMode: JaapCountInteraction;
    target: boolean;
  }>({ countMode: 'none', target: false });
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const applyState = useCallback((next: JaapState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const saveNow = useCallback(async (snapshot: JaapState) => {
    const saved = await saveJaapState(snapshot);

    if (mountedRef.current) {
      setSaveError(!saved);
    }

    return saved;
  }, []);

  const scheduleSave = useCallback(
    (snapshot: JaapState) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        void saveNow(snapshot);
      }, SaveDelayMs);
    },
    [saveNow]
  );

  const commit = useCallback(
    (updater: (current: JaapState) => JaapState) => {
      const next = updater(stateRef.current);
      applyState(next);

      // Never write before hydration finishes: the restored value may still
      // be on its way. Once loading has failed, a real interaction may write.
      if (loadStatusRef.current !== 'loading') {
        scheduleSave(next);
      }
    },
    [applyState, scheduleSave]
  );

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const loaded = await loadJaapState();
      const touched = touchedRef.current;
      const current = stateRef.current;

      // Taps that happened while storage was loading are merged instead of
      // being overwritten.
      const next: JaapState = loaded.state
        ? mergeRestoredJaap(loaded.state, current, touched.countMode, touched.target)
        : current;

      const hasInteraction = touched.countMode !== 'none' || touched.target;

      if (cancelled) {
        if (hasInteraction) {
          void saveJaapState(next);
        }
        return;
      }

      applyState(next);

      const nextStatus: JaapLoadStatus = loaded.status === 'error' ? 'error' : 'ready';
      loadStatusRef.current = nextStatus;
      setLoadStatus(nextStatus);

      if (hasInteraction) {
        scheduleSave(next);
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [applyState, scheduleSave]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      // Flush a pending debounced write when leaving the screen.
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;

        if (loadStatusRef.current !== 'loading') {
          void saveJaapState(stateRef.current);
        }
      }
    };
  }, []);

  const increment = useCallback(() => {
    if (touchedRef.current.countMode !== 'reset') {
      touchedRef.current.countMode = 'add';
    }
    commit(incrementJaap);
  }, [commit]);

  const reset = useCallback(() => {
    touchedRef.current.countMode = 'reset';
    commit(resetJaap);
  }, [commit]);

  const selectTarget = useCallback(
    (target: JaapTarget) => {
      touchedRef.current.target = true;
      commit((current) => selectJaapTarget(current, target));
    },
    [commit]
  );

  return {
    state,
    increment,
    reset,
    selectTarget,
    loadStatus,
    saveError,
  };
}
