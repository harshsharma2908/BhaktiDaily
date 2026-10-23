import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ReminderSettings } from '@/components/settings/reminder-settings';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { InfoRow } from '@/components/ui/info-row';
import { Notice } from '@/components/ui/notice';
import { Pill } from '@/components/ui/pill';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { AppInfo } from '@/constants/app';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { usePreferences } from '@/providers/preferences-provider';
import type { AppearancePreference } from '@/storage/preferences';

const appearanceOptions: { value: AppearancePreference; label: string }[] = [
  { value: 'system', label: 'सिस्टम' },
  { value: 'light', label: 'लाइट' },
  { value: 'dark', label: 'डार्क' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const { preferences, saveError, setAppearance } = usePreferences();

  return (
    <Screen
      eyebrow={AppInfo.name}
      title="सेटिंग्स"
      subtitle="रिमाइंडर और दिखावट इस डिवाइस पर सहेजे जाते हैं। भाषा अभी केवल हिन्दी में उपलब्ध है।">
      <View style={styles.section}>
        <SectionHeader title="दैनिक स्मरण" hint="वैकल्पिक" />

        <ReminderSettings />
      </View>

      <View style={styles.section}>
        <SectionHeader title="दिखावट" />

        <Card style={styles.appearanceCard}>
          <View style={styles.appearanceHeader}>
            <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
              <SymbolView
                name={{ ios: 'circle.lefthalf.filled', android: 'contrast', web: 'contrast' }}
                size={IconSize.md}
                tintColor={theme.accent}
              />
            </View>

            <View style={styles.copy}>
              <ThemedText type="bodyStrong">ऐप की थीम</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {preferences.appearance === 'system'
                  ? 'फ़ोन की लाइट या डार्क सेटिंग के अनुसार'
                  : 'आपकी चुनी हुई थीम इस डिवाइस पर लागू है'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.chipRow}>
            {appearanceOptions.map((option) => (
              <Chip
                key={option.value}
                accessibilityLabel={`दिखावट ${option.label}`}
                label={option.label}
                selected={preferences.appearance === option.value}
                onPress={() => {
                  void setAppearance(option.value);
                }}
              />
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="भाषा" hint="जल्द उपलब्ध" />

        <Card>
          <InfoRow
            icon={{ ios: 'translate', android: 'translate', web: 'translate' }}
            title="भाषा"
            description="फ़िलहाल सभी स्क्रीन हिन्दी में हैं"
            trailing={<Pill label="जल्द" tone="outline" />}
            disabled
          />
        </Card>

        <Notice
          title="अंग्रेज़ी चुनना अभी उपलब्ध नहीं"
          description="पूरा अनुवाद तैयार होने तक भाषा बदलने का विकल्प बंद है। अधूरा अनुवाद दिखाने के बजाय केवल हिन्दी रखी गई है।"
        />
      </View>

      {saveError ? (
        <Notice
          title="सेटिंग्स सहेजी नहीं जा सकीं"
          description="बदलाव इस सत्र में लागू हैं, लेकिन ऐप बंद होने पर वे नहीं रह सकते। कृपया डिवाइस की स्टोरेज जाँचें और ऐप दोबारा खोलें।"
        />
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="जानकारी और सहायता" />

        <Card>
          <InfoRow
            icon={{ ios: 'info.circle', android: 'info', web: 'info' }}
            title="ऐप के बारे में"
            description="संस्करण, उद्देश्य और सामग्री नीति"
            onPress={() => router.push('/settings/about')}
          />
          <InfoRow
            icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
            title="संपर्क"
            description="सुझाव और सहायता की जानकारी"
            onPress={() => router.push('/settings/contact')}
          />
          <InfoRow
            icon={{ ios: 'hand.raised', android: 'shield', web: 'shield' }}
            title="गोपनीयता नीति"
            description="इस संस्करण में डेटा कैसे संभाला जाता है"
            onPress={() => router.push('/settings/privacy')}
            last
          />
        </Card>
      </View>

      <Card tone="muted" style={styles.aboutCard}>
        <View style={styles.brandRow}>
          <View style={[styles.brandMark, { backgroundColor: theme.accent }]}>
            <ThemedText type="bodyStrong" themeColor="onAccent">
              भ
            </ThemedText>
          </View>
          <View style={styles.brandCopy}>
            <ThemedText type="bodyStrong">{AppInfo.name}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {AppInfo.nameEn} · संस्करण {version}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="caption" themeColor="textSecondary">
          जाप प्रगति, रिमाइंडर और दिखावट केवल इस डिवाइस पर सहेजे जाते हैं।
        </ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  appearanceCard: {
    gap: Spacing.lg,
  },
  appearanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  aboutCard: {
    gap: Spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  brandMark: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  brandCopy: {
    flex: 1,
    gap: Spacing.xxs,
  },
});
