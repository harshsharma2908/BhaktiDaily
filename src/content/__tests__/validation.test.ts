import { describe, expect, it } from '@jest/globals';

import { getContentLibrary } from '@/content/library';
import type {
  CalendarObservance,
  ContentLibrary,
  ContentSource,
  DevotionalReflection,
  PendingDevotionalContent,
  PujaGuide,
} from '@/content/types';
import {
  isValidDateKey,
  validateContentLibrary,
  type ContentValidationResult,
} from '@/content/validation';

const source: ContentSource = {
  id: 'test-source',
  title: 'Test source',
  kind: 'secondary',
  url: 'https://example.com/source',
  publisher: 'Test publisher',
  language: 'en',
  publishedOn: '2026-01-10',
  accessedOn: '2026-01-15',
  reproduction: 'link-only',
  scope: { region: 'Test region', tradition: 'Test tradition' },
};

const reflection: DevotionalReflection = {
  id: 'reflection-1',
  title: 'Test reflection',
  body: 'Test body',
  attribution: 'Test attribution',
  language: 'hi',
  reviewStatus: 'reviewed',
  sourceIds: [source.id],
  reviewedBy: 'Test reviewer',
  lastReviewedOn: '2026-01-20',
  scope: { region: 'Test region', tradition: 'Test tradition' },
};

const pending: PendingDevotionalContent = {
  id: 'pending-1',
  title: 'Pending content',
  description: 'Pending content description',
  language: 'hi',
  reviewStatus: 'pending-review',
  sourceIds: [],
};

const observance: CalendarObservance = {
  id: 'observance-1',
  date: '2026-10-05',
  title: 'Test observance',
  category: 'पर्व',
  description: 'Test observance description',
  language: 'hi',
  reviewStatus: 'reviewed',
  sourceIds: [source.id],
  reviewedBy: 'Test reviewer',
  lastReviewedOn: '2026-01-20',
  scope: { region: 'Test region', tradition: 'Test tradition' },
};

const guide: PujaGuide = {
  id: 'guide-1',
  title: 'Test guide',
  description: 'Test guide description',
  category: 'दैनिक',
  duration: '10 minutes',
  icon: 'morning',
  materials: ['Test material'],
  steps: [{ title: 'Step one', description: 'Test step description' }],
  notes: ['Test note'],
  language: 'hi',
  reviewStatus: 'reviewed',
  sourceIds: [source.id],
  reviewedBy: 'Test reviewer',
  lastReviewedOn: '2026-01-20',
  scope: { region: 'Test region', tradition: 'Test tradition' },
};

const validLibrary: ContentLibrary = {
  sources: [source],
  reflections: [reflection],
  pendingContent: [pending],
  calendarObservances: [observance],
  pujaGuides: [guide],
};

function makeLibrary(overrides: Partial<ContentLibrary>): ContentLibrary {
  return { ...validLibrary, ...overrides };
}

function codes(result: ContentValidationResult): string[] {
  return result.errors.map((issue) => issue.code);
}

describe('content structural validation', () => {
  it('accepts a structurally valid library', () => {
    const result = validateContentLibrary(validLibrary);

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('does not verify religious accuracy', () => {
    const result = validateContentLibrary(
      makeLibrary({
        calendarObservances: [
          {
            ...observance,
            id: 'fictional-observance',
            title: 'Clearly a fictional test fixture',
            description: 'This passes structure; it is not a factual claim.',
          },
        ],
      })
    );

    expect(result.ok).toBe(true);
  });

  it('reports duplicate source IDs', () => {
    const result = validateContentLibrary(
      makeLibrary({ sources: [source, { ...source, title: 'Duplicate source' }] })
    );

    expect(codes(result)).toContain('duplicate-source-id');
  });

  it('reports duplicate content IDs across collections', () => {
    const result = validateContentLibrary(
      makeLibrary({
        pujaGuides: [{ ...guide, id: reflection.id }],
      })
    );

    expect(codes(result)).toContain('duplicate-content-id');
  });

  it('reports missing titles and required fields', () => {
    const result = validateContentLibrary(
      makeLibrary({
        reflections: [{ ...reflection, title: '   ', body: '' }],
      })
    );

    expect(codes(result)).toContain('reflection-title-missing');
    expect(codes(result)).toContain('reflection-body-missing');
  });

  it('reports invalid source URLs when a URL is supplied', () => {
    const result = validateContentLibrary(
      makeLibrary({ sources: [{ ...source, url: 'not-a-url' }] })
    );

    expect(codes(result)).toContain('source-url-invalid');
  });

  it('reports source references that are not in the register', () => {
    const result = validateContentLibrary(
      makeLibrary({
        reflections: [{ ...reflection, sourceIds: ['missing-source'] }],
      })
    );

    expect(codes(result)).toContain('unknown-source');
  });

  it('requires a source, reviewer and review date for reviewed content', () => {
    const result = validateContentLibrary(
      makeLibrary({
        reflections: [
          {
            ...reflection,
            sourceIds: [],
            reviewedBy: undefined,
            lastReviewedOn: undefined,
          },
        ],
      })
    );

    expect(codes(result)).toContain('reviewed-without-source');
    expect(codes(result)).toContain('reviewed-without-reviewer');
    expect(codes(result)).toContain('reviewed-date-missing');
  });

  it('rejects review metadata on sample or pending content', () => {
    const result = validateContentLibrary(
      makeLibrary({
        reflections: [
          {
            ...reflection,
            reviewStatus: 'sample',
            reviewedBy: 'Test reviewer',
            lastReviewedOn: '2026-01-20',
          },
        ],
      })
    );

    expect(codes(result)).toContain('review-metadata-on-unreviewed');
  });

  it('requires region and calendar tradition for reviewed calendar entries', () => {
    const result = validateContentLibrary(
      makeLibrary({
        calendarObservances: [{ ...observance, scope: undefined }],
      })
    );

    expect(result.ok).toBe(false);
    expect(codes(result)).toContain('reviewed-calendar-without-scope');
  });

  it('rejects impossible or malformed calendar dates', () => {
    for (const date of ['2026-02-30', '2026-13-01', '05-10-2026']) {
      const result = validateContentLibrary(
        makeLibrary({
          calendarObservances: [{ ...observance, date }],
        })
      );

      expect(codes(result)).toContain('calendar-date-invalid');
    }
  });

  it('rejects empty guide steps and blank step fields', () => {
    const emptyResult = validateContentLibrary(
      makeLibrary({ pujaGuides: [{ ...guide, steps: [] }] })
    );
    const blankResult = validateContentLibrary(
      makeLibrary({
        pujaGuides: [{ ...guide, steps: [{ title: ' ', description: '' }] }],
      })
    );

    expect(codes(emptyResult)).toContain('guide-without-steps');
    expect(codes(blankResult)).toContain('guide-step-title-missing');
    expect(codes(blankResult)).toContain('guide-step-description-missing');
  });

  it('rejects malformed source dates', () => {
    const result = validateContentLibrary(
      makeLibrary({ sources: [{ ...source, publishedOn: '2026-13-01' }] })
    );

    expect(codes(result)).toContain('source-published-date-invalid');
  });

  it('rejects unresolved reproduction rights for reviewed content', () => {
    const result = validateContentLibrary(
      makeLibrary({ sources: [{ ...source, reproduction: 'unknown' }] })
    );

    expect(codes(result)).toContain('source-rights-unknown');
  });

  it('validates date keys strictly, including leap years', () => {
    expect(isValidDateKey('2024-02-29')).toBe(true);
    expect(isValidDateKey('2026-02-29')).toBe(false);
    expect(isValidDateKey('2026-2-9')).toBe(false);
    expect(isValidDateKey('2026-00-10')).toBe(false);
  });

  it('validates the shipped library and keeps every entry unreviewed', () => {
    const library = getContentLibrary(2026);
    const result = validateContentLibrary(library);
    const entries = [
      ...library.reflections,
      ...library.pendingContent,
      ...library.calendarObservances,
      ...library.pujaGuides,
    ];

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(library.sources).toHaveLength(0);
    expect(entries.every((entry) => entry.reviewStatus !== 'reviewed')).toBe(true);
  });
});
