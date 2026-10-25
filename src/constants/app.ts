export const AppInfo = {
  name: 'भक्ति दैनिक',
  nameEn: 'Bhakti Daily',
  tagline: 'रोज़ की भक्ति, सरल और विश्वसनीय',
} as const;

/**
 * Content policy shared across screens.
 * Religious dates, mantra text, quotations and muhurat timings must come from
 * reviewed, attributable sources before they are added to the app.
 */
export const ContentPolicy = {
  verifiedOnly: 'केवल सत्यापित स्रोतों से प्रामाणिक सामग्री जोड़ी जाएगी।',
} as const;

/**
 * Language stance for this release: the whole app ships in Hindi and there is
 * no language switching control. This is a factual note, not a promise — a
 * second language is only considered after a complete reviewed translation.
 */
export const LanguagePolicy = {
  hindiFirst:
    'इस संस्करण में पूरा ऐप हिन्दी में है। भाषा बदलने का विकल्प अभी नहीं है; दूसरी भाषाओँ पर विचार पूरे समीक्षित अनुवाद के बाद ही होगा।',
} as const;
