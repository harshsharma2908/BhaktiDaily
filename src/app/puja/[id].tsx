import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { Pill } from '@/components/ui/pill';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { getPujaGuideById } from '@/data/puja-guides';
import { useTheme } from '@/hooks/use-theme';

export default function PujaGuideDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = getPujaGuideById(id);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/puja');
  }

  if (!guide) {
    return (
      <Screen
        eyebrow="पूजा मार्गदर्शिका"
        title="मार्गदर्शिका नहीं मिली"
        onBack={goBack}
        backLabel="मार्गदर्शिकाएँ">
        <EmptyState
          icon={{ ios: 'questionmark.circle', android: 'help', web: 'help' }}
          title="यह पृष्ठ उपलब्ध नहीं है"
          description="हो सकता है मार्गदर्शिका हटाई गई हो या लिंक पुराना हो।"
          actionLabel="सभी मार्गदर्शिकाएँ"
          onAction={goBack}
        />
      </Screen>
    );
  }

  return (
    <Screen
      eyebrow={`नमूना · ${guide.category}`}
      title={guide.title}
      subtitle={guide.description}
      onBack={goBack}
      backLabel="मार्गदर्शिकाएँ">
      <Notice
        tone="sample"
        title="यह पूजा विधि नहीं है"
        description="नीचे दी गई सामग्री और चरण केवल पृष्ठ की संरचना दिखाने के लिए हैं। इन्हें निर्देश या सलाह न मानें।"
      />

      <Card tone="muted" style={styles.metaCard}>
        <View style={styles.metaItem}>
          <ThemedText type="caption" themeColor="textSecondary">
            अनुमानित समय
          </ThemedText>
          <ThemedText type="bodyStrong">{guide.duration}</ThemedText>
        </View>
        <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />
        <View style={styles.metaItem}>
          <ThemedText type="caption" themeColor="textSecondary">
            स्रोत की स्थिति
          </ThemedText>
          <Pill label="सत्यापन बाकी" tone="outline" />
        </View>
      </Card>

      <View style={styles.section}>
        <SectionHeader title="सामग्री" hint="नमूना सूची" />

        <Card>
          {guide.materials.map((material, index) => (
            <View
              key={material}
              style={[
                styles.materialRow,
                index > 0 && { borderTopColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth },
              ]}>
              <View style={[styles.materialDot, { backgroundColor: theme.accentSoft }]}>
                <ThemedText type="caption" themeColor="accent">
                  {index + 1}
                </ThemedText>
              </View>
              <ThemedText type="body" themeColor="textSecondary" style={styles.flexText}>
                {material}
              </ThemedText>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="चरण" hint="नमूना क्रम" />

        <View style={styles.stepList}>
          {guide.steps.map((step, index) => (
            <Card key={step.title} style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: theme.accentSoft }]}>
                <ThemedText type="label" themeColor="accent">
                  {index + 1}
                </ThemedText>
              </View>

              <View style={styles.stepCopy}>
                <ThemedText type="bodyStrong">{step.title}</ThemedText>
                <ThemedText type="body" themeColor="textSecondary">
                  {step.description}
                </ThemedText>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="ध्यान दें" />

        <Card style={styles.noteCard}>
          {guide.notes.map((note) => (
            <View key={note} style={styles.noteRow}>
              <SymbolView
                name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                size={IconSize.sm}
                tintColor={theme.accent}
              />
              <ThemedText type="body" themeColor="textSecondary" style={styles.flexText}>
                {note}
              </ThemedText>
            </View>
          ))}
        </Card>
      </View>

      <Notice
        title="स्रोत और समीक्षा"
        description={`${guide.sourceNote} वास्तविक मार्गदर्शिका के साथ स्रोत, समीक्षक और प्रकाशन की तारीख भी दिखाई जाएगी।`}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  metaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  metaItem: {
    flex: 1,
    gap: Spacing.xxs,
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  section: {
    gap: Spacing.md,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  materialDot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  stepList: {
    gap: Spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stepNumber: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  stepCopy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  noteCard: {
    gap: Spacing.md,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  flexText: {
    flex: 1,
  },
});
