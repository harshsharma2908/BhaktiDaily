/**
 * Shared content and provenance types.
 *
 * These types describe structure, not religious accuracy. A `reviewed` status
 * only means an editor recorded a source, a reviewer and a review date; the
 * facts still have to be checked by a qualified human against that source.
 */

export type ContentLanguage = 'hi';

export type ContentReviewStatus = 'sample' | 'pending-review' | 'reviewed';

export type ContentSourceKind = 'primary' | 'official' | 'secondary';

export type ContentReproduction =
  | 'link-only'
  | 'permission-granted'
  | 'public-domain'
  | 'unknown';

export type ContentScope = {
  region?: string;
  tradition?: string;
};

export type ContentProvenance = {
  language: ContentLanguage;
  reviewStatus: ContentReviewStatus;
  sourceIds: readonly string[];
  reviewedBy?: string;
  /** ISO calendar date (`YYYY-MM-DD`). */
  lastReviewedOn?: string;
  scope?: ContentScope;
  variationNote?: string;
};

export type DevotionalReflection = ContentProvenance & {
  id: string;
  title: string;
  body: string;
  /** Human-readable attribution or sample-copy disclosure shown in the UI. */
  attribution: string;
};

/**
 * A deliberately empty slot for content that is waiting for review. It has no
 * body, so it cannot accidentally be rendered as approved devotional content.
 */
export type PendingDevotionalContent = ContentProvenance & {
  id: string;
  title: string;
  description: string;
};

export const ObservanceCategories = ['पर्व', 'व्रत', 'स्मरण'] as const;

export type ObservanceCategory = (typeof ObservanceCategories)[number];

export type CalendarObservance = ContentProvenance & {
  id: string;
  /** ISO calendar date (`YYYY-MM-DD`). */
  date: string;
  title: string;
  category: ObservanceCategory;
  description: string;
};

export const PujaGuideCategories = ['दैनिक', 'पर्व', 'विशेष'] as const;

export type PujaCategory = (typeof PujaGuideCategories)[number];

export const PujaGuideIcons = ['morning', 'evening', 'festival', 'silence'] as const;

export type PujaGuideIcon = (typeof PujaGuideIcons)[number];

export type PujaGuideStep = {
  title: string;
  description: string;
};

export type PujaGuide = ContentProvenance & {
  id: string;
  title: string;
  description: string;
  category: PujaCategory;
  duration: string;
  icon: PujaGuideIcon;
  materials: readonly string[];
  steps: readonly PujaGuideStep[];
  notes: readonly string[];
};

export type ContentSource = {
  id: string;
  title: string;
  kind: ContentSourceKind;
  url?: string;
  publisher?: string;
  /** Language of the source itself, not necessarily the app language. */
  language: string;
  /** ISO calendar date (`YYYY-MM-DD`). */
  publishedOn?: string;
  /** ISO calendar date (`YYYY-MM-DD`). */
  accessedOn?: string;
  reproduction: ContentReproduction;
  rightsNote?: string;
  scope?: ContentScope;
  notes?: string;
};

export type ContentLibrary = {
  sources: readonly ContentSource[];
  reflections: readonly DevotionalReflection[];
  pendingContent: readonly PendingDevotionalContent[];
  calendarObservances: readonly CalendarObservance[];
  pujaGuides: readonly PujaGuide[];
};
