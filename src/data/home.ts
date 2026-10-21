/**
 * Day 2 home content.
 *
 * The featured line is app-authored sample copy, not a quotation from a
 * scripture or saint. The prayer card stays empty until reviewed content with
 * an attributable source is available.
 */
export type SampleThought = {
  title: string;
  text: string;
  status: 'sample';
  attribution: string;
};

export type PendingPrayer = {
  title: string;
  status: 'pending';
  description: string;
};

export const HomeContent: {
  greetingFallback: string;
  thought: SampleThought;
  prayer: PendingPrayer;
} = {
  greetingFallback: 'नमस्कार',
  thought: {
    title: 'एक शांत कदम',
    text: 'भक्ति जल्दबाज़ी में नहीं, ठहरकर किए गए एक सच्चे कदम में दिखती है।',
    status: 'sample',
    attribution: 'ऐप नमूना पाठ — किसी ग्रंथ या संत का उद्धरण नहीं',
  },
  prayer: {
    title: 'आज की प्रार्थना',
    status: 'pending',
    description: 'समीक्षित और स्रोत सहित प्रार्थना जल्द यहाँ प्रकाशित होगी।',
  },
};
