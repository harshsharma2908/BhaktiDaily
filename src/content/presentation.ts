import { getContentSourceTitles } from './sources';
import type { ContentProvenance, ContentReviewStatus } from './types';

const reviewStatusLabels: Record<ContentReviewStatus, string> = {
  sample: 'नमूना',
  'pending-review': 'समीक्षा बाकी',
  reviewed: 'समीक्षित',
};

export function getReviewStatusLabel(status: ContentReviewStatus): string {
  return reviewStatusLabels[status];
}

/** A compact, optional source line for list rows and cards. */
export function getSourceLine(sourceIds: readonly string[]): string | null {
  const titles = getContentSourceTitles(sourceIds);

  return titles.length > 0 ? `स्रोत: ${titles.join(' · ')}` : null;
}

/**
 * Describes the recorded provenance without implying that a sample or pending
 * entry has been approved. Factual review is still a separate editorial step.
 */
export function describeContentProvenance(entry: ContentProvenance): string {
  if (entry.reviewStatus === 'reviewed') {
    const parts: string[] = [];
    const sourceLine = getSourceLine(entry.sourceIds);

    if (sourceLine) {
      parts.push(sourceLine);
    }
    if (entry.reviewedBy) {
      parts.push(`समीक्षक: ${entry.reviewedBy}`);
    }
    if (entry.lastReviewedOn) {
      parts.push(`अंतिम समीक्षा: ${entry.lastReviewedOn}`);
    }
    if (entry.scope?.region) {
      parts.push(`क्षेत्र: ${entry.scope.region}`);
    }
    if (entry.scope?.tradition) {
      parts.push(`परंपरा: ${entry.scope.tradition}`);
    }
    if (entry.variationNote) {
      parts.push(`भिन्नता: ${entry.variationNote}`);
    }

    return parts.length > 0 ? `${parts.join(' · ')}।` : 'स्रोत और समीक्षा विवरण उपलब्ध नहीं है।';
  }

  if (entry.reviewStatus === 'pending-review') {
    return 'सामग्री समीक्षा के लिए लंबित है। स्रोत, समीक्षक और अंतिम समीक्षा तिथि प्रकाशन से पहले जोड़ी जाएगी।';
  }

  return 'यह नमूना सामग्री है। स्रोत, समीक्षक और अंतिम समीक्षा तिथि प्रकाशन से पहले जोड़ी जाएगी।';
}
