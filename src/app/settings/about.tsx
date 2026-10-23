import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Pill } from '@/components/ui/pill';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { AppInfo } from '@/constants/app';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const policyPoints = [
  'धार्मिक सामग्री केवल नामित, समीक्षित स्रोत के साथ जोड़ी जाएगी।',
  'नमूना सामग्री को हर जगह स्पष्ट रूप से चिह्नित किया जाएगा।',
  'कोई अनुमानित पर्व तिथि, मुहूर्त या मंत्र पाठ प्रकाशित नहीं होगा।',
];

export default function AboutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/settings');
  }

  return (
    <Screen
      eyebrow="जानकारी"
      title="ऐप के बारे में"
      onBack={goBack}
      backLabel="सेटिंग्स">
      <Card style={styles.brandCard}>
        <View style={[styles.brandMark, { backgroundColor: theme.accent }]}>
          <ThemedText type="title" themeColor="onAccent">
            भ
          </ThemedText>
        </View>

        <View style={styles.brandCopy}>
          <ThemedText type="title">{AppInfo.name}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {AppInfo.nameEn}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary">
            {AppInfo.tagline}।
          </ThemedText>
        </View>

        <View style={styles.pills}>
          <Pill label={`संस्करण ${version}`} tone="muted" />
          <Pill label="निर्माणाधीन" tone="outline" />
        </View>
      </Card>

      <View style={styles.section}>
        <SectionHeader title="यह ऐप क्या है" />

        <Card>
          <ThemedText type="body" themeColor="textSecondary">
            भक्ति दैनिक एक Android-first, हिन्दी-first दैनिक साथी है। इसका उद्देश्य शांत पठन,
            स्पष्ट पूजा मार्गदर्शन और अपनी गति से जाप के लिए एक भरोसेमंद जगह बनाना है।
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.paragraph}>
            अभी ऐप निर्माणाधीन है। जाप प्रगति, दिखावट और वैकल्पिक रिमाइंडर इस डिवाइस पर स्थानीय
            रूप से सहेजे जाते हैं। धार्मिक सामग्री और कैलेंडर की जानकारी समीक्षा के बाद ही जोड़ी
            जाएगी।
          </ThemedText>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="सामग्री नीति" />

        <Card style={styles.pointList}>
          {policyPoints.map((point) => (
            <View key={point} style={styles.pointRow}>
              <SymbolView
                name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
                size={IconSize.md}
                tintColor={theme.success}
              />
              <ThemedText type="body" themeColor="textSecondary" style={styles.pointText}>
                {point}
              </ThemedText>
            </View>
          ))}
        </Card>
      </View>

      <Notice
        title="विकास चरण"
        description="यह पृष्ठ ऐप के उद्देश्य और नीति को स्पष्ट करता है, लेकिन यह किसी धार्मिक संस्था या प्रकाशक का आधिकारिक परिचय नहीं है।"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandCard: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
  },
  brandMark: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
  },
  brandCopy: {
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  section: {
    gap: Spacing.md,
  },
  paragraph: {
    marginTop: Spacing.md,
  },
  pointList: {
    gap: Spacing.md,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  pointText: {
    flex: 1,
  },
});
