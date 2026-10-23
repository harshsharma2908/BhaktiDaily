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

/** The nearest sample rows, used by the Home and Calendar upcoming lists. */
export function getUpcomingSampleObservances(
  from = new Date(),
  count = 3
): CalendarObservance[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  const rows = [0, 1, 2].flatMap((offset) => {
    const monthStart = new Date(start.getFullYear(), start.getMonth() + offset, 1);
    return getSampleObservancesForMonth(monthStart.getFullYear(), monthStart.getMonth());
  });

  return rows
    .filter((row) => parseDateKey(row.date).getTime() >= start.getTime())
    .sort((left, right) => parseDateKey(left.date).getTime() - parseDateKey(right.date).getTime())
    .slice(0, count);
}
