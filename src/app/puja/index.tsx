import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { GuideCard } from '@/components/puja/guide-card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { SearchField } from '@/components/ui/search-field';
import { AppInfo, ContentPolicy } from '@/constants/app';
import { Spacing } from '@/constants/theme';
import {
  PujaCategories,
  PujaGuides,
  type PujaCategoryFilter,
} from '@/data/puja-guides';

const hasUnreviewedGuides = PujaGuides.some((guide) => guide.reviewStatus !== 'reviewed');

export default function PujaScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PujaCategoryFilter>('सभी');

  const filteredGuides = useMemo(() => {
    const normalizedQuery = query.trim();

    return PujaGuides.filter((guide) => {
      const matchesCategory = category === 'सभी' || guide.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        guide.title.includes(normalizedQuery) ||
        guide.description.includes(normalizedQuery) ||
        guide.category.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const hasFilters = query.trim().length > 0 || category !== 'सभी';

  function resetFilters() {
    setQuery('');
    setCategory('सभी');
  }

  return (
    <Screen
      eyebrow={AppInfo.name}
      title="पूजा मार्गदर्शिका"
      subtitle="सामग्री, चरण और ध्यान देने योग्य बातें — एक स्पष्ट रूपरेखा में।">
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="मार्गदर्शिका खोजें"
        accessibilityLabel="पूजा मार्गदर्शिका खोजें"
      />

      <ScrollView
        horizontal
        contentContainerStyle={styles.chipRow}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}>
        {PujaCategories.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={category === item}
            onPress={() => setCategory(item)}
            accessibilityLabel={`${item} श्रेणी`}
          />
        ))}
      </ScrollView>

      {hasUnreviewedGuides ? (
        <Notice
          tone="sample"
          title="नमूना और समीक्षा-लंबित मार्गदर्शिकाएँ"
          description="जिन पृष्ठों पर 'नमूना' या 'समीक्षा बाकी' लिखा है, वे केवल UI संरचना दिखाते हैं। सामग्री, चरण और स्रोत समीक्षा के बाद ही वास्तविक मार्गदर्शन बनेंगे।"
        />
      ) : (
        <Notice
          tone="success"
          title="समीक्षित मार्गदर्शिकाएँ"
          description="सभी सूचीबद्ध मार्गदर्शिकाओं के साथ स्रोत और समीक्षा विवरण दर्ज है।"
        />
      )}

      <View style={styles.section}>
        <SectionHeader title="मार्गदर्शिकाएँ" hint={`${filteredGuides.length} परिणाम`} />

        {filteredGuides.length > 0 ? (
          <View style={styles.list}>
            {filteredGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon={{ ios: 'magnifyingglass', android: 'search_off', web: 'search_off' }}
            title="कोई मार्गदर्शिका नहीं मिली"
            description="दूसरा शब्द आज़माएँ या श्रेणी बदलें।"
            actionLabel={hasFilters ? 'फ़िल्टर हटाएँ' : undefined}
            onAction={hasFilters ? resetFilters : undefined}
          />
        )}
      </View>

      <Notice title="प्रकाशन नियम" description={ContentPolicy.verifiedOnly} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  section: {
    gap: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
});
