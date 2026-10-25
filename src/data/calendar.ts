import type { CalendarObservance, ObservanceCategory } from '@/content/types';
import { parseDateKey } from '@/lib/date';

/**
 * These are deliberately neutral UI samples. They are not festival names,
 * tithi, muhurat timings or verified panchang dates. They carry no source
 * because there is no real observance to attribute.
 */
const sampleDays = [5, 12, 21, 27] as const;

const sampleTemplates: { title: string; category: ObservanceCategory }[] = [
  { title: 'नमूना अवसर — स्रोत लंबित', category: 'पर्व' },
  { title: 'नमूना व्रत — सत्यापन बाकी', category: 'व्रत' },
  { title: 'नमूना स्मरण दिवस', category: 'स्मरण' },
  { title: 'नमूना अवसर — स्रोत लंबित', category: 'पर्व' },
];

const sampleProvenance = {
  language: 'hi',
  reviewStatus: 'sample',
  sourceIds: [],
} as const;

function toSampleDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getSampleObservancesForMonth(
  year: number,
  month: number
): CalendarObservance[] {
  return sampleDays.map((day, index) => {
    const template = sampleTemplates[index];
    const date = toSampleDateKey(year, month, day);

    return {
      id: `sample-${date}`,
      date,
      title: template.title,
      category: template.category,
      description:
        'यह केवल UI परीक्षण के लिए बनाई गई नमूना प्रविष्टि है — किसी वास्तविक पर्व या व्रत की तिथि नहीं।',
      ...sampleProvenance,
    };
  });
}

function dayStart(from: Date) {
  return new Date(from.getFullYear(), from.getMonth(), from.getDate());
}

/**
 * Nearest upcoming observances from the generated UI samples, scanned over a
 * three-month window. The optional filter lets callers restrict the feed —
 * for example to reviewed entries only — without touching the generation code.
 */
export function getUpcomingObservances(
  from: Date = new Date(),
  count = 3,
  filter: (entry: CalendarObservance) => boolean = () => true
): CalendarObservance[] {
  const start = dayStart(from);

  const rows = [0, 1, 2].flatMap((offset) => {
    const monthStart = new Date(start.getFullYear(), start.getMonth() + offset, 1);
    return getSampleObservancesForMonth(monthStart.getFullYear(), monthStart.getMonth());
  });

  return rows
    .filter(
      (row) =>
        filter(row) && parseDateKey(row.date).getTime() >= start.getTime()
    )
    .sort((left, right) => parseDateKey(left.date).getTime() - parseDateKey(right.date).getTime())
    .slice(0, count);
}

/** The nearest sample rows, used by the Calendar upcoming list. */
export function getUpcomingSampleObservances(
  from: Date = new Date(),
  count = 3
): CalendarObservance[] {
  return getUpcomingObservances(from, count);
}

/**
 * Verified entries only. Sample rows are never promoted into this feed, so a
 * surface that asks for verified data (such as Home) never shows a generated
 * UI date as if it were a real observance.
 */
export function getUpcomingVerifiedObservances(
  from: Date = new Date(),
  count = 3
): CalendarObservance[] {
  return getUpcomingObservances(from, count, (entry) => entry.reviewStatus === 'reviewed');
}
