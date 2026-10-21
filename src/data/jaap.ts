/**
 * Jaap targets are non-religious numeric preferences. No mantra text is stored
 * here until a reviewed source is available.
 */
export const JaapTargets = [27, 54, 108] as const;

export type JaapTarget = (typeof JaapTargets)[number];

export const DefaultJaapTarget: JaapTarget = 108;

export const JaapMantraPlaceholder = {
  label: 'मंत्र चयन',
  value: 'सत्यापन जारी',
  description:
    'मंत्र पाठ और उसका स्रोत समीक्षा के बाद ही जोड़े जाएँगे। अभी काउंटर किसी विशेष मंत्र से जुड़ा नहीं है।',
} as const;
