import { describe, expect, it } from '@jest/globals';

import {
  getSampleObservancesForMonth,
  getUpcomingObservances,
  getUpcomingSampleObservances,
  getUpcomingVerifiedObservances,
} from '@/data/calendar';

describe('upcoming observance feeds', () => {
  // A fixed date keeps the expected rows (12, 21, 27 of this month) stable.
  const from = new Date(2026, 0, 10);

  it('generated rows stay labelled as samples', () => {
    for (const row of getSampleObservancesForMonth(2026, 0)) {
      expect(row.reviewStatus).toBe('sample');
    }
  });

  it('sample feed returns upcoming rows in date order and respects the count', () => {
    const rows = getUpcomingSampleObservances(from, 2);

    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.date >= '2026-01-10')).toBe(true);

    const keys = rows.map((row) => row.date);
    expect([...keys].sort()).toEqual(keys);
  });

  it('the verified feed never contains sample rows, so Home cannot show a generated date', () => {
    expect(getUpcomingVerifiedObservances(from, 5)).toEqual([]);
  });

  it('the feed collector honours caller-supplied filters', () => {
    expect(getUpcomingObservances(from, 3, () => false)).toEqual([]);
  });
});
