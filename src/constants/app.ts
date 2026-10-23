export const AppInfo = {
  name: 'भक्ति दैनिक',
  nameEn: 'Bhakti Daily',
  tagline: 'शांति, स्मरण और निष्ठा का साथी',
} as const;

/**
 * Content policy shared across screens.
 * Religious dates, mantra text, quotations and muhurat timings must come from
 * reviewed, attributable sources before they are added to the app.
 */
export const ContentPolicy = {
  verifiedOnly: 'केवल सत्यापित स्रोतों से प्रामाणिक सामग्री जोड़ी जाएगी।',
} as const;
