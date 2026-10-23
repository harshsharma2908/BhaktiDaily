import type { DevotionalReflection, PendingDevotionalContent } from '@/content/types';

/**
 * Home content.
 *
 * The featured line is app-authored sample copy, not a quotation from a
 * scripture or saint. The prayer card stays a pending slot until reviewed
 * content with an attributable source is available.
 */
const sampleProvenance = {
  language: 'hi',
  reviewStatus: 'sample',
  sourceIds: [],
} as const;

export type HomeContentData = {
  greetingFallback: string;
  thought: DevotionalReflection;
  prayer: PendingDevotionalContent;
};

export const HomeContent: HomeContentData = {
  greetingFallback: 'नमस्कार',
  thought: {
    id: 'home-reflection-sample-1',
    title: 'एक शांत कदम',
    body: 'भक्ति जल्दबाज़ी में नहीं, ठहरकर किए गए एक सच्चे कदम में दिखती है।',
    attribution: 'ऐप नमूना पाठ — किसी ग्रंथ या संत का उद्धरण नहीं',
    ...sampleProvenance,
  },
  prayer: {
    id: 'home-prayer-pending-1',
    title: 'आज की प्रार्थना',
    description: 'समीक्षित और स्रोत सहित प्रार्थना जल्द यहाँ प्रकाशित होगी।',
    language: 'hi',
    reviewStatus: 'pending-review',
    sourceIds: [],
  },
};
