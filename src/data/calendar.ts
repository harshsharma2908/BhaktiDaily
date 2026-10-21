import { parseDateKey } from '@/lib/date';

export type ObservanceCategory = 'पर्व' | 'व्रत' | 'स्मरण';

/**
 * These are deliberately neutral UI samples. They are not festival names,
 * tithi, muhurat timings or verified panchang dates.
 */
export type SampleObservance = {
  id: string;
  date: string;
  title: string;
  category: ObservanceCategory;
  description: string;
  status: 'sample';
  sourceStatus: 'pending';
};

const sampleDays = [5, 12, 21, 27] as const;

const sampleTemplates: { title: string; category: ObservanceCategory }[] = [
  { title: 'नमूना अवसर — स्रोत लंबित', category: 'पर्व' },
  { title: 'नमूना व्रत — सत्यापन बाकी', category: 'व्रत' },
  { title: 'नमूना स्मरण दिवस', category: 'स्मरण' },
  { title: 'नमूना अवसर — स्रोत लंबित', category: 'पर्व' },
];

export function getSampleObservancesForMonth(year: number, month: number): SampleObservance[] {
  return sampleDays.map((day, index) => {
    const template = sampleTemplates[index];

    return {
      id: `${year}-${String(month + 1).padStart(2, '0')}-${day}`,
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      title: template.title,
      category: template.category,
      description:
        'यह केवल UI परीक्षण के लिए बनाई गई नमूना प्रविष्टि है — किसी वास्तविक पर्व या व्रत की तिथि नहीं।',
      status: 'sample',
      sourceStatus: 'pending',
    };
  });
}

/** The nearest sample rows, used by the Home and Calendar upcoming lists. */
export function getUpcomingSampleObservances(from = new Date(), count = 3): SampleObservance[] {
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
