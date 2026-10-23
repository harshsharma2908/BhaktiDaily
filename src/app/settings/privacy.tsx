import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { IconSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const currentPractices = [
  'कोई खाता, लॉगिन या उपयोगकर्ता प्रोफ़ाइल नहीं है।',
  'ऐप की ओर से कोई विज्ञापन, एनालिटिक्स या ट्रैकिंग नहीं जोड़ी गई है।',
  'जाप गिनती, लक्ष्य, दिखावट और रिमाइंडर समय केवल इस डिवाइस की स्थानीय स्टोरेज में रखे जाते हैं।',
  'ये सेटिंग्स किसी सर्वर या क्लाउड से सिंक नहीं होतीं; ऐप हटाने पर स्थानीय डेटा भी हट सकता है।',
  'रिमाइंडर केवल तब सेट होता है जब आप उसे चालू करें और सूचना अनुमति दें।',
];

const futurePractices = [
  'भविष्य में खाता, सिंक या ऑनलाइन सेवा जोड़ने से पहले यह नीति अपडेट की जाएगी।',
  'संपर्क सुविधा जोड़ने पर साझा किया गया डेटा और उसका उद्देश्य स्पष्ट किया जाएगा।',
  'कोई विश्लेषण या विज्ञापन जोड़ा जाए तो उससे पहले उपयोगकर्ता को नियंत्रण दिया जाएगा।',
];

export default function PrivacyScreen() {
  const theme = useTheme();
  const router = useRouter();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/settings');
  }

  return (
    <Screen
      eyebrow="नीति"
      title="गोपनीयता नीति"
      subtitle="इस संस्करण में डेटा कैसे संभाला जाता है, इसका स्पष्ट प्रारूप।"
      onBack={goBack}
      backLabel="सेटिंग्स">
      <Notice
        title="यह अंतिम कानूनी नीति नहीं है"
        description="यह इस संस्करण के लिए तैयार किया गया स्पष्ट प्रारूप है। कानूनी समीक्षा और प्रकाशन से पहले इसे अद्यतन किया जाएगा।"
      />

      <View style={styles.section}>
        <SectionHeader title="इस संस्करण में" hint="अभी लागू" />

        <Card style={styles.list}>
          {currentPractices.map((item) => (
            <View key={item} style={styles.row}>
              <SymbolView
                name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
                size={IconSize.md}
                tintColor={theme.success}
              />
              <ThemedText type="body" themeColor="textSecondary" style={styles.text}>
                {item}
              </ThemedText>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="भविष्य की सुविधाएँ" hint="जोड़ी जाएँगी तो नीति बदलेगी" />

        <Card style={styles.list}>
          {futurePractices.map((item) => (
            <View key={item} style={styles.row}>
              <SymbolView
                name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                size={IconSize.md}
                tintColor={theme.accent}
              />
              <ThemedText type="body" themeColor="textSecondary" style={styles.text}>
                {item}
              </ThemedText>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="आपकी ज़िम्मेदारी" />

        <Card>
          <ThemedText type="body" themeColor="textSecondary">
            कृपया इस ऐप में किसी और की निजी जानकारी, संपर्क विवरण या संवेदनशील सामग्री दर्ज न करें।
            जाप गिनती रीसेट करने से केवल गिनती हटती है; सभी स्थानीय डेटा हटाने के लिए ऐप का डेटा
            हटाएँ। सभी स्थानीय डेटा हटाने का अलग विकल्प अभी उपलब्ध नहीं है।
          </ThemedText>
        </Card>
      </View>

      <Notice
        title="कानूनी समीक्षा बाकी"
        description="यह प्रारूप किसी वकील या कानूनी सलाहकार द्वारा समीक्षित नहीं है और इसे अंतिम गोपनीयता नीति न मानें।"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  text: {
    flex: 1,
  },
});
