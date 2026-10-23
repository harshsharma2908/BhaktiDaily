import { getSampleObservancesForMonth } from '@/data/calendar';
import { HomeContent } from '@/data/home';
import { PujaGuides } from '@/data/puja-guides';

import { ContentSources } from './sources';
import type { ContentLibrary } from './types';

/**
 * Assembles the content that is currently shipped with the app for structural
 * validation. Calendar rows are generated for a supplied year so tests can
 * cover every month without depending on the wall clock.
 *
 * This function does not perform religious fact verification.
 */
export function getContentLibrary(year: number): ContentLibrary {
  const calendarObservances = Array.from({ length: 12 }, (_, month) =>
    getSampleObservancesForMonth(year, month)
  ).flat();

  return {
    sources: ContentSources,
    reflections: [HomeContent.thought],
    pendingContent: [HomeContent.prayer],
    calendarObservances,
    pujaGuides: PujaGuides,
  };
}
