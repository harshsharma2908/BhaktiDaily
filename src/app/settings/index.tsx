import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { InfoRow } from '@/components/ui/info-row';
import { Notice } from '@/components/ui/notice';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { AppInfo } from '@/constants/app';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen
      eyebrow={AppInfo.name}
      title="सेटिंग्स"
      subtitle="ऐप को अपनी सुविधा के अनुसार रखें। कुछ विकल्प अभी तैयार हो रहे हैं।">
      <View style={styles.section}>
        <SectionHeader title="आपकी पसंद" hint="जल्द उपलब्ध" />

        <Card>
          <InfoRow
            icon={{ ios: 'translate', android: 'translate', web: 'translate' }}
            title="भाषा"
            description="अभी केवल हिन्दी · अधिक भाषाएँ जल्द"
            value="हिन्दी"
          />
          <InfoRow
            icon={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
            title="प्रार्थना रिमाइंडर"
            description="वैकल्पिक दैनिक स्मरण · सूचना अनुमति अभी नहीं"
            value="जल्द"
          />
          <InfoRow
            icon={{ ios: 'circle.lefthalf.filled', android: 'contrast', web: 'contrast' }}
            title="दिखावट"
            description="फ़ोन की लाइट या डार्क थीम के अनुसार"
            value="सिस्टम"
            last
          />
        </Card>

        <Notice
          title="ये विकल्प अभी सक्रिय नहीं हैं"
          description="भाषा बदलने और रिमाइंडर सेट करने की सुविधा अगले चरण में जोड़ी जाएगी। अभी कोई सूचना नहीं भेजी जाती।"
        />
      </View>

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
          सामग्री और सुविधाएँ अभी निर्माणाधीन हैं।
        </ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
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
