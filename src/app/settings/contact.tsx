import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { InfoRow } from '@/components/ui/info-row';
import { Notice } from '@/components/ui/notice';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

export default function ContactScreen() {
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
      eyebrow="सहायता"
      title="संपर्क"
      subtitle="सुझाव, सुधार और सहायता के लिए संपर्क सूत्र प्रकाशन से पहले जोड़ा जाएगा।"
      onBack={goBack}
      backLabel="सेटिंग्स">
      <EmptyState
        icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
        title="संपर्क सूत्र जल्द आएगा"
        description="अभी कोई सहायता ईमेल या प्रतिक्रिया फ़ॉर्म उपलब्ध नहीं है। कोई नकली पता नहीं दिखाया जा रहा है।"
      />

      <Button
        label="ईमेल भेजें"
        icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
        variant="secondary"
        fullWidth
        disabled
        accessibilityHint="सहायता ईमेल प्रकाशन से पहले जोड़ा जाएगा"
      />

      <View style={styles.section}>
        <SectionHeader title="आप क्या साझा कर सकेंगे" />

        <Card>
          <InfoRow
            icon={{ ios: 'lightbulb', android: 'lightbulb', web: 'lightbulb' }}
            title="सामग्री सुझाव"
            description="किसी स्रोत या विषय का सुझाव"
          />
          <InfoRow
            icon={{ ios: 'exclamationmark.bubble', android: 'feedback', web: 'feedback' }}
            title="सुधार"
            description="गलत या अस्पष्ट दिखने वाली जानकारी"
          />
          <InfoRow
            icon={{ ios: 'ladybug', android: 'bug_report', web: 'bug_report' }}
            title="तकनीकी समस्या"
            description="ऐप, स्क्रीन या काउंटर से जुड़ी समस्या"
            last
          />
        </Card>
      </View>

      <Notice
        title="अभी कोई संदेश नहीं भेजा जा सकता"
        description="यह ऐप किसी सर्वर से नहीं जुड़ा है। संपर्क फ़ॉर्म जोड़ने पर गोपनीयता नीति भी अपडेट की जाएगी।"
      />

      <ThemedText type="caption" themeColor="textSecondary" style={styles.footer}>
        कोई सहायता पता प्रकाशित नहीं है — कृपया किसी अनुमानित ईमेल का उपयोग न करें।
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  footer: {
    textAlign: 'center',
  },
});
