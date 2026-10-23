import { describe, expect, it } from '@jest/globals';

import {
  adjustReminderTime,
  adjustReminderTimeByStep,
  formatReminderTime,
} from '@/lib/reminder';

describe('reminder time', () => {
  it('formats hours and minutes with two digits', () => {
    expect(formatReminderTime({ hour: 8, minute: 5 })).toBe('08:05');
    expect(formatReminderTime({ hour: 23, minute: 55 })).toBe('23:55');
  });

  it('moves in five-minute steps without leaving the hour', () => {
    expect(adjustReminderTimeByStep({ hour: 7, minute: 30 }, 1)).toEqual({
      hour: 7,
      minute: 35,
    });
    expect(adjustReminderTimeByStep({ hour: 7, minute: 30 }, -1)).toEqual({
      hour: 7,
      minute: 25,
    });
  });

  it('wraps forward around midnight', () => {
    expect(adjustReminderTime({ hour: 23, minute: 55 }, 5)).toEqual({
      hour: 0,
      minute: 0,
    });
  });

  it('wraps backward around midnight', () => {
    expect(adjustReminderTime({ hour: 0, minute: 0 }, -5)).toEqual({
      hour: 23,
      minute: 55,
    });
  });

  it('supports moving by more than one day', () => {
    expect(adjustReminderTime({ hour: 12, minute: 0 }, 24 * 60)).toEqual({
      hour: 12,
      minute: 0,
    });
  });
});
