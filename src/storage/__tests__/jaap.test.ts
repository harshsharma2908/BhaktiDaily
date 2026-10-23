import { describe, expect, it } from '@jest/globals';

import { DefaultJaapTarget } from '@/data/jaap';
import { parseStoredJaap, serializeJaapState } from '@/storage/jaap';

describe('jaap storage mapping', () => {
  it('reads a valid payload', () => {
    expect(parseStoredJaap({ version: 1, count: 27, target: 54 })).toEqual({
      count: 27,
      target: 54,
    });
  });

  it('ignores missing, malformed or unknown-version payloads', () => {
    expect(parseStoredJaap(null)).toBeNull();
    expect(parseStoredJaap('not-json')).toBeNull();
    expect(parseStoredJaap([])).toBeNull();
    expect(parseStoredJaap({})).toBeNull();
    expect(parseStoredJaap({ version: 2, count: 10, target: 27 })).toBeNull();
  });

  it('recovers a valid target when only the count is corrupt', () => {
    expect(parseStoredJaap({ version: 1, count: -1, target: 27 })).toEqual({
      count: 0,
      target: 27,
    });
    expect(parseStoredJaap({ version: 1, count: 1.5, target: 27 })).toEqual({
      count: 0,
      target: 27,
    });
    expect(parseStoredJaap({ version: 1, count: Number.NaN, target: 27 })).toEqual({
      count: 0,
      target: 27,
    });
  });

  it('falls back to the default target when the target is unsupported', () => {
    expect(parseStoredJaap({ version: 1, count: 12, target: 99 })).toEqual({
      count: 12,
      target: DefaultJaapTarget,
    });
  });

  it('round-trips through serialization', () => {
    const state = { count: 54, target: 108 } as const;
    const stored = serializeJaapState(state);

    expect(stored).toEqual({ version: 1, count: 54, target: 108 });
    expect(parseStoredJaap(stored)).toEqual(state);
  });
});
