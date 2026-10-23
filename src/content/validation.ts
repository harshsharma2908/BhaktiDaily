import {
  ObservanceCategories,
  PujaGuideCategories,
  PujaGuideIcons,
  type CalendarObservance,
  type ContentLanguage,
  type ContentLibrary,
  type ContentProvenance,
  type ContentReproduction,
  type ContentReviewStatus,
  type ContentSource,
  type ContentSourceKind,
  type DevotionalReflection,
  type PendingDevotionalContent,
  type PujaGuide,
} from './types';

/**
 * Structural and provenance validation for the content library.
 *
 * This deliberately does not verify religious facts. A clean result only means
 * that IDs, required copy, dates, source references and review metadata are
 * internally consistent. Festival dates, tithi, muhurat, mantra text and ritual
 * instructions still require a qualified human to check the named source.
 *
 * Content currently uses date-only fields. Time-of-day fields are deliberately
 * absent until muhurat content is approved; if added, they need their own
 * explicit 24-hour validation.
 */

export type ContentValidationSeverity = 'error' | 'warning';

export type ContentValidationIssue = {
  code: string;
  path: string;
  message: string;
  severity: ContentValidationSeverity;
};

export type ContentValidationResult = {
  ok: boolean;
  errors: ContentValidationIssue[];
  warnings: ContentValidationIssue[];
};

const contentReviewStatuses: readonly ContentReviewStatus[] = [
  'sample',
  'pending-review',
  'reviewed',
];

const contentLanguages: readonly ContentLanguage[] = ['hi'];

const sourceKinds: readonly ContentSourceKind[] = ['primary', 'official', 'secondary'];

const reproductionValues: readonly ContentReproduction[] = [
  'link-only',
  'permission-granted',
  'public-domain',
  'unknown',
];

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateKey(value: string): boolean {
  if (!dateKeyPattern.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.length > 0;
  } catch {
    return false;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isOneOf<T extends string>(value: string, values: readonly T[]): value is T {
  return (values as readonly string[]).includes(value);
}

function addIssue(
  issues: ContentValidationIssue[],
  severity: ContentValidationSeverity,
  code: string,
  path: string,
  message: string
) {
  issues.push({ code, path, message, severity });
}

function addError(
  issues: ContentValidationIssue[],
  code: string,
  path: string,
  message: string
) {
  addIssue(issues, 'error', code, path, message);
}

function addWarning(
  issues: ContentValidationIssue[],
  code: string,
  path: string,
  message: string
) {
  addIssue(issues, 'warning', code, path, message);
}

function requireString(
  issues: ContentValidationIssue[],
  value: unknown,
  path: string,
  code: string,
  label: string
) {
  if (!isNonEmptyString(value)) {
    addError(issues, code, path, `${label} is required.`);
  }
}

function validateScope(
  issues: ContentValidationIssue[],
  scope: ContentProvenance['scope'],
  path: string
) {
  if (!scope) {
    return;
  }

  if (scope.region !== undefined && !isNonEmptyString(scope.region)) {
    addError(issues, 'scope-region-empty', `${path}.region`, 'Region must not be blank.');
  }
  if (scope.tradition !== undefined && !isNonEmptyString(scope.tradition)) {
    addError(issues, 'scope-tradition-empty', `${path}.tradition`, 'Tradition must not be blank.');
  }
}

function validateContentSource(
  source: ContentSource,
  path: string,
  issues: ContentValidationIssue[]
) {
  requireString(issues, source.id, `${path}.id`, 'source-id-missing', 'Source ID');
  requireString(issues, source.title, `${path}.title`, 'source-title-missing', 'Source title');
  requireString(
    issues,
    source.language,
    `${path}.language`,
    'source-language-missing',
    'Source language'
  );

  if (!isOneOf(source.kind, sourceKinds)) {
    addError(issues, 'source-kind-invalid', `${path}.kind`, 'Source kind is not recognised.');
  }
  if (!isOneOf(source.reproduction, reproductionValues)) {
    addError(
      issues,
      'source-reproduction-invalid',
      `${path}.reproduction`,
      'Reproduction rights are not recognised.'
    );
  }

  if (source.publisher !== undefined && !isNonEmptyString(source.publisher)) {
    addError(issues, 'source-publisher-empty', `${path}.publisher`, 'Publisher must not be blank.');
  }

  if (source.url !== undefined) {
    if (!isNonEmptyString(source.url)) {
      addError(issues, 'source-url-empty', `${path}.url`, 'Source URL must not be blank.');
    } else if (!isValidHttpUrl(source.url)) {
      addError(
        issues,
        'source-url-invalid',
        `${path}.url`,
        'Source URL must be a valid http or https URL.'
      );
    }
  }

  if (source.publishedOn !== undefined && !isValidDateKey(source.publishedOn)) {
    addError(
      issues,
      'source-published-date-invalid',
      `${path}.publishedOn`,
      'Source publication date must be a real ISO date (YYYY-MM-DD).'
    );
  }
  if (source.accessedOn !== undefined && !isValidDateKey(source.accessedOn)) {
    addError(
      issues,
      'source-accessed-date-invalid',
      `${path}.accessedOn`,
      'Source access date must be a real ISO date (YYYY-MM-DD).'
    );
  }

  validateScope(issues, source.scope, `${path}.scope`);

  if (source.rightsNote !== undefined && !isNonEmptyString(source.rightsNote)) {
    addError(issues, 'source-rights-note-empty', `${path}.rightsNote`, 'Rights note must not be blank.');
  }
  if (source.notes !== undefined && !isNonEmptyString(source.notes)) {
    addError(issues, 'source-notes-empty', `${path}.notes`, 'Source notes must not be blank.');
  }
}

function validateProvenance(
  entry: ContentProvenance,
  path: string,
  issues: ContentValidationIssue[],
  sourceById: ReadonlyMap<string, ContentSource>
) {
  if (!isOneOf(entry.language, contentLanguages)) {
    addError(
      issues,
      'content-language-invalid',
      `${path}.language`,
      'App content must declare a supported language.'
    );
  }

  if (!isOneOf(entry.reviewStatus, contentReviewStatuses)) {
    addError(
      issues,
      'review-status-invalid',
      `${path}.reviewStatus`,
      'Review status is missing or not recognised.'
    );
    return;
  }

  if (!Array.isArray(entry.sourceIds)) {
    addError(issues, 'source-ids-missing', `${path}.sourceIds`, 'Source references must be an array.');
    return;
  }

  const seenSourceIds = new Set<string>();

  entry.sourceIds.forEach((sourceId, index) => {
    const sourcePath = `${path}.sourceIds[${index}]`;

    if (!isNonEmptyString(sourceId)) {
      addError(issues, 'source-id-blank', sourcePath, 'Source reference must not be blank.');
      return;
    }

    if (seenSourceIds.has(sourceId)) {
      addWarning(
        issues,
        'duplicate-source-reference',
        sourcePath,
        `Source "${sourceId}" is referenced more than once.`
      );
    }
    seenSourceIds.add(sourceId);

    if (!sourceById.has(sourceId)) {
      addError(
        issues,
        'unknown-source',
        sourcePath,
        `Source "${sourceId}" is not present in the source register.`
      );
    }
  });

  validateScope(issues, entry.scope, `${path}.scope`);

  if (entry.variationNote !== undefined && !isNonEmptyString(entry.variationNote)) {
    addError(issues, 'variation-note-empty', `${path}.variationNote`, 'Variation note must not be blank.');
  }

  if (entry.reviewStatus === 'reviewed') {
    if (entry.sourceIds.length === 0) {
      addError(
        issues,
        'reviewed-without-source',
        `${path}.sourceIds`,
        'Reviewed content must reference at least one source.'
      );
    }
    if (!isNonEmptyString(entry.reviewedBy)) {
      addError(
        issues,
        'reviewed-without-reviewer',
        `${path}.reviewedBy`,
        'Reviewed content must name the reviewer.'
      );
    }
    if (!entry.lastReviewedOn) {
      addError(
        issues,
        'reviewed-date-missing',
        `${path}.lastReviewedOn`,
        'Reviewed content must record the last review date.'
      );
    } else if (!isValidDateKey(entry.lastReviewedOn)) {
      addError(
        issues,
        'reviewed-date-invalid',
        `${path}.lastReviewedOn`,
        'Last review date must be a real ISO date (YYYY-MM-DD).'
      );
    }

    if (!entry.scope?.region && !entry.scope?.tradition) {
      addWarning(
        issues,
        'reviewed-without-scope',
        `${path}.scope`,
        'Reviewed content should state its region, tradition, or both.'
      );
    }

    entry.sourceIds.forEach((sourceId, index) => {
      const source = sourceById.get(sourceId);
      if (source?.reproduction === 'unknown') {
        addError(
          issues,
          'source-rights-unknown',
          `${path}.sourceIds[${index}]`,
          `Reproduction rights for source "${sourceId}" are unresolved.`
        );
      }
    });
  } else if (entry.reviewedBy !== undefined || entry.lastReviewedOn !== undefined) {
    addError(
      issues,
      'review-metadata-on-unreviewed',
      path,
      'Sample or pending content must not claim a reviewer or review date.'
    );
  }
}

function validateDevotionalReflection(
  reflection: DevotionalReflection,
  path: string,
  issues: ContentValidationIssue[],
  sourceById: ReadonlyMap<string, ContentSource>
) {
  validateProvenance(reflection, path, issues, sourceById);

  requireString(issues, reflection.id, `${path}.id`, 'reflection-id-missing', 'Reflection ID');
  requireString(
    issues,
    reflection.title,
    `${path}.title`,
    'reflection-title-missing',
    'Reflection title'
  );
  requireString(issues, reflection.body, `${path}.body`, 'reflection-body-missing', 'Reflection body');
  requireString(
    issues,
    reflection.attribution,
    `${path}.attribution`,
    'reflection-attribution-missing',
    'Reflection attribution'
  );
}

function validatePendingContent(
  content: PendingDevotionalContent,
  path: string,
  issues: ContentValidationIssue[],
  sourceById: ReadonlyMap<string, ContentSource>
) {
  validateProvenance(content, path, issues, sourceById);

  requireString(issues, content.id, `${path}.id`, 'pending-id-missing', 'Pending content ID');
  requireString(issues, content.title, `${path}.title`, 'pending-title-missing', 'Pending content title');
  requireString(
    issues,
    content.description,
    `${path}.description`,
    'pending-description-missing',
    'Pending content description'
  );

  if (content.reviewStatus !== 'pending-review') {
    addError(
      issues,
      'pending-status-invalid',
      `${path}.reviewStatus`,
      'A pending content slot must use the pending-review status.'
    );
  }
}

function validateCalendarObservance(
  observance: CalendarObservance,
  path: string,
  issues: ContentValidationIssue[],
  sourceById: ReadonlyMap<string, ContentSource>
) {
  validateProvenance(observance, path, issues, sourceById);

  requireString(issues, observance.id, `${path}.id`, 'calendar-id-missing', 'Observance ID');
  requireString(
    issues,
    observance.title,
    `${path}.title`,
    'calendar-title-missing',
    'Observance title'
  );
  requireString(
    issues,
    observance.description,
    `${path}.description`,
    'calendar-description-missing',
    'Observance description'
  );

  if (!isNonEmptyString(observance.date)) {
    addError(issues, 'calendar-date-missing', `${path}.date`, 'Observance date is required.');
  } else if (!isValidDateKey(observance.date)) {
    addError(
      issues,
      'calendar-date-invalid',
      `${path}.date`,
      'Observance date must be a real ISO date (YYYY-MM-DD).'
    );
  }

  if (!isOneOf(observance.category, ObservanceCategories)) {
    addError(
      issues,
      'calendar-category-invalid',
      `${path}.category`,
      'Observance category is not recognised.'
    );
  }

  if (
    observance.reviewStatus === 'reviewed' &&
    (!isNonEmptyString(observance.scope?.region) ||
      !isNonEmptyString(observance.scope?.tradition))
  ) {
    addError(
      issues,
      'reviewed-calendar-without-scope',
      `${path}.scope`,
      'Reviewed calendar entries must state both the applicable region and calendar tradition.'
    );
  }
}

function validatePujaGuide(
  guide: PujaGuide,
  path: string,
  issues: ContentValidationIssue[],
  sourceById: ReadonlyMap<string, ContentSource>
) {
  validateProvenance(guide, path, issues, sourceById);

  requireString(issues, guide.id, `${path}.id`, 'guide-id-missing', 'Guide ID');
  requireString(issues, guide.title, `${path}.title`, 'guide-title-missing', 'Guide title');
  requireString(
    issues,
    guide.description,
    `${path}.description`,
    'guide-description-missing',
    'Guide description'
  );
  requireString(issues, guide.duration, `${path}.duration`, 'guide-duration-missing', 'Guide duration');

  if (!isOneOf(guide.category, PujaGuideCategories)) {
    addError(issues, 'guide-category-invalid', `${path}.category`, 'Guide category is not recognised.');
  }
  if (!isOneOf(guide.icon, PujaGuideIcons)) {
    addError(issues, 'guide-icon-invalid', `${path}.icon`, 'Guide icon is not recognised.');
  }

  if (!Array.isArray(guide.materials)) {
    addError(issues, 'guide-materials-invalid', `${path}.materials`, 'Guide materials must be an array.');
  } else {
    guide.materials.forEach((material, index) => {
      if (!isNonEmptyString(material)) {
        addError(
          issues,
          'guide-material-empty',
          `${path}.materials[${index}]`,
          'Guide material must not be blank.'
        );
      }
    });

    if (guide.reviewStatus === 'reviewed' && guide.materials.length === 0) {
      addWarning(
        issues,
        'reviewed-guide-without-materials',
        `${path}.materials`,
        'A reviewed guide should list its materials, or explain why none are needed.'
      );
    }
  }

  if (!Array.isArray(guide.steps)) {
    addError(issues, 'guide-steps-invalid', `${path}.steps`, 'Guide steps must be an array.');
  } else if (guide.steps.length === 0) {
    addError(issues, 'guide-without-steps', `${path}.steps`, 'A guide must contain at least one step.');
  } else {
    guide.steps.forEach((step, index) => {
      const stepPath = `${path}.steps[${index}]`;

      if (typeof step !== 'object' || step === null) {
        addError(issues, 'guide-step-invalid', stepPath, 'Guide step must be an object.');
        return;
      }

      requireString(
        issues,
        step.title,
        `${stepPath}.title`,
        'guide-step-title-missing',
        'Step title'
      );
      requireString(
        issues,
        step.description,
        `${stepPath}.description`,
        'guide-step-description-missing',
        'Step description'
      );
    });
  }

  if (!Array.isArray(guide.notes)) {
    addError(issues, 'guide-notes-invalid', `${path}.notes`, 'Guide notes must be an array.');
  } else {
    guide.notes.forEach((note, index) => {
      if (!isNonEmptyString(note)) {
        addWarning(issues, 'guide-note-empty', `${path}.notes[${index}]`, 'Guide note is blank.');
      }
    });
  }
}

export function validateContentLibrary(library: ContentLibrary): ContentValidationResult {
  const issues: ContentValidationIssue[] = [];
  const sourceById = new Map<string, ContentSource>();

  library.sources.forEach((source, index) => {
    const path = `sources[${index}]`;
    validateContentSource(source, path, issues);

    if (!isNonEmptyString(source.id)) {
      return;
    }

    if (sourceById.has(source.id)) {
      addError(
        issues,
        'duplicate-source-id',
        `${path}.id`,
        `Source ID "${source.id}" is duplicated.`
      );
      return;
    }

    sourceById.set(source.id, source);
  });

  const contentPaths = new Map<string, string>();

  function registerContentId(entry: { id: string }, path: string) {
    if (!isNonEmptyString(entry.id)) {
      return;
    }

    const existingPath = contentPaths.get(entry.id);
    if (existingPath) {
      addError(
        issues,
        'duplicate-content-id',
        `${path}.id`,
        `Content ID "${entry.id}" is also used at ${existingPath}.`
      );
      return;
    }

    contentPaths.set(entry.id, path);
  }

  library.reflections.forEach((reflection, index) => {
    const path = `reflections[${index}]`;
    registerContentId(reflection, path);
    validateDevotionalReflection(reflection, path, issues, sourceById);
  });

  library.pendingContent.forEach((content, index) => {
    const path = `pendingContent[${index}]`;
    registerContentId(content, path);
    validatePendingContent(content, path, issues, sourceById);
  });

  library.calendarObservances.forEach((observance, index) => {
    const path = `calendarObservances[${index}]`;
    registerContentId(observance, path);
    validateCalendarObservance(observance, path, issues, sourceById);
  });

  library.pujaGuides.forEach((guide, index) => {
    const path = `pujaGuides[${index}]`;
    registerContentId(guide, path);
    validatePujaGuide(guide, path, issues, sourceById);
  });

  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
