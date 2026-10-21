export type PujaCategory = 'दैनिक' | 'पर्व' | 'विशेष';

export type PujaGuideIcon = 'morning' | 'evening' | 'festival' | 'silence';

export type PujaGuideStep = {
  title: string;
  description: string;
};

export type PujaGuide = {
  id: string;
  title: string;
  description: string;
  category: PujaCategory;
  duration: string;
  icon: PujaGuideIcon;
  materials: string[];
  steps: PujaGuideStep[];
  notes: string[];
  status: 'sample';
  sourceStatus: 'pending';
  sourceNote: string;
};

export const PujaCategories = ['सभी', 'दैनिक', 'पर्व', 'विशेष'] as const;

export type PujaCategoryFilter = (typeof PujaCategories)[number];

const materials = [
  'मुख्य सामग्री की सूची — सत्यापन के बाद जोड़ी जाएगी।',
  'वैकल्पिक सामग्री और विकल्प — सत्यापन के बाद।',
  'तैयारी और मात्रा — समीक्षित विवरण के साथ।',
];

const steps: PujaGuideStep[] = [
  {
    title: 'स्थान तैयार करें',
    description:
      'यहाँ सत्यापित विधि का पहला चरण आएगा — स्थान और तैयारी का स्पष्ट विवरण।',
  },
  {
    title: 'सामग्री रखें',
    description: 'सामग्री को क्रम से रखने का तरीका समीक्षित सामग्री के साथ यहाँ आएगा।',
  },
  {
    title: 'विधि का पहला भाग',
    description: 'यह नमूना पाठ केवल पृष्ठ की संरचना दिखाता है; यह पूजा निर्देश नहीं है।',
  },
  {
    title: 'समापन',
    description: 'समापन के चरण और उससे जुड़ा स्रोत सत्यापन के बाद जोड़ा जाएगा।',
  },
];

const notes = [
  'यह पृष्ठ केवल UI नमूना है; इसे पूजा विधि या निर्देश न मानें।',
  'वास्तविक सामग्री समीक्षा, स्रोत और समीक्षक के नाम के साथ ही प्रकाशित होगी।',
];

function buildGuide(
  seed: Pick<PujaGuide, 'id' | 'title' | 'description' | 'category' | 'duration' | 'icon'>
): PujaGuide {
  return {
    ...seed,
    materials,
    steps,
    notes,
    status: 'sample',
    sourceStatus: 'pending',
    sourceNote: 'स्रोत और समीक्षक का विवरण सामग्री प्रकाशन के साथ जोड़ा जाएगा।',
  };
}

export const PujaGuides: PujaGuide[] = [
  buildGuide({
    id: 'prabhat-puja',
    title: 'प्रातः पूजा',
    description: 'सुबह की पूजा के लिए नमूना रूपरेखा',
    category: 'दैनिक',
    duration: 'लगभग 10 मिनट',
    icon: 'morning',
  }),
  buildGuide({
    id: 'sandhya-deep',
    title: 'संध्या दीप',
    description: 'संध्या के समय दीपक और स्मरण की नमूना रूपरेखा',
    category: 'दैनिक',
    duration: 'लगभग 8 मिनट',
    icon: 'evening',
  }),
  buildGuide({
    id: 'parv-taiyari',
    title: 'पर्व की तैयारी',
    description: 'पर्व के दिन की तैयारी का नमूना ढाँचा',
    category: 'पर्व',
    duration: 'लगभग 15 मिनट',
    icon: 'festival',
  }),
  buildGuide({
    id: 'shanti-smaran',
    title: 'शांति स्मरण',
    description: 'शांत मन के लिए छोटा स्मरण सत्र — नमूना',
    category: 'विशेष',
    duration: 'लगभग 5 मिनट',
    icon: 'silence',
  }),
];

export function getPujaGuideById(id: string) {
  return PujaGuides.find((guide) => guide.id === id);
}
