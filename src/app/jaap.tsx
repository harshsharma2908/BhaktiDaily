import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { InfoRow } from '@/components/ui/info-row';
import { Notice } from '@/components/ui/notice';
import { Pill } from '@/components/ui/pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { AppInfo } from '@/constants/app';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import {
  DefaultJaapTarget,
  JaapMantraPlaceholder,
  JaapTargets,
  type JaapTarget,
} from '@/data/jaap';
import { useTheme } from '@/hooks/use-theme';

export default function JaapScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<JaapTarget>(DefaultJaapTarget);
  const [showMantraNote, setShowMantraNote] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const progress = Math.min(count / target, 1);
  const isComplete = count >= target;
  const circleSize = Math.min(260, Math.max(196, width - 128));

  function increment() {
    setConfirmReset(false);
    setCount((current) => current + 1);
  }

  function resetCounter() {
    setCount(0);
    setConfirmReset(false);
  }

  function selectTarget(nextTarget: JaapTarget) {
    setTarget(nextTarget);
    setConfirmReset(false);
  }

  return (
    <Screen
      eyebrow={AppInfo.name}
      title="जाप"
      subtitle="अपनी गति से स्मरण, बिना जल्दबाज़ी। काउंटर केवल इस सत्र के लिए है।">
      <Card style={styles.counterCard}>
        <View style={styles.cardHeader}>
          <Pill label="जाप काउंटर" />
          <Pill label="अस्थायी" tone="muted" />
        </View>

        <View
          accessible
          accessibilityLabel={`जाप गिनती ${count}, लक्ष्य ${target}`}
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              borderColor: isComplete ? theme.success : theme.accentSoft,
              backgroundColor: theme.surface,
            },
          ]}>
          <ThemedText
            type="counter"
            themeColor={isComplete ? 'success' : 'accent'}
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.counterText}>
            {count}
          </ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            लक्ष्य {target}
          </ThemedText>
          <View
            style={[
              styles.progressBadge,
              { backgroundColor: isComplete ? theme.successSoft : theme.accentSoft },
            ]}>
            <ThemedText type="caption" themeColor={isComplete ? 'success' : 'accent'}>
              {isComplete ? 'लक्ष्य पूरा' : `${Math.round(progress * 100)}%`}
            </ThemedText>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressLabels}>
            <ThemedText type="caption" themeColor="textSecondary">
              प्रगति
            </ThemedText>
            <ThemedText type="label">
              {count} / {target}
            </ThemedText>
          </View>
          <ProgressBar
            value={progress}
            tone={isComplete ? 'success' : 'accent'}
            accessibilityLabel="जाप प्रगति"
          />
        </View>

        <View style={styles.targetBlock}>
          <ThemedText type="caption" themeColor="textSecondary">
            लक्ष्य चुनें
          </ThemedText>
          <View style={styles.targetRow}>
            {JaapTargets.map((option) => (
              <Chip
                key={option}
                label={String(option)}
                selected={target === option}
                onPress={() => selectTarget(option)}
                accessibilityLabel={`लक्ष्य ${option} जाप`}
              />
            ))}
          </View>
        </View>

        <Button
          label={count === 0 ? 'पहला जाप जोड़ें' : 'एक जाप जोड़ें'}
          icon={{ ios: 'plus', android: 'add', web: 'add' }}
          size="lg"
          fullWidth
          onPress={increment}
          accessibilityHint="जाप की गिनती एक बढ़ाएँ"
        />

        {count === 0 ? (
          <ThemedText type="caption" themeColor="textSecondary" style={styles.centerText}>
            शुरू करने के लिए ऊपर का बटन दबाएँ। यह काउंटर सहेजा नहीं जाएगा।
          </ThemedText>
        ) : confirmReset ? (
          <View
            style={[
              styles.confirmBox,
              { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}>
            <ThemedText type="bodyStrong">काउंटर रीसेट करें?</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              इस सत्र की गिनती 0 हो जाएगी। इसे वापस नहीं लाया जा सकेगा।
            </ThemedText>
            <View style={styles.confirmRow}>
              <Button
                label="रीसेट करें"
                variant="primary"
                fullWidth
                onPress={resetCounter}
                style={styles.confirmButton}
              />
              <Button
                label="रद्द"
                variant="secondary"
                fullWidth
                onPress={() => setConfirmReset(false)}
                style={styles.confirmButton}
              />
            </View>
          </View>
        ) : (
          <Button
            label="रीसेट"
            variant="secondary"
            icon={{ ios: 'arrow.clockwise', android: 'restart_alt', web: 'restart_alt' }}
            fullWidth
            onPress={() => setConfirmReset(true)}
            accessibilityHint="काउंटर को शून्य करने से पहले पुष्टि करें"
          />
        )}

        {isComplete ? (
          <Notice
            tone="success"
            title="लक्ष्य पूरा"
            description={`${target} जाप पूरे हो गए। आप स्मरण जारी रख सकते हैं या काउंटर रीसेट कर सकते हैं।`}
          />
        ) : null}
      </Card>

      <View style={styles.section}>
        <SectionHeader title="मंत्र" hint="सत्यापन के बाद" />

        <Card>
          <InfoRow
            icon={{ ios: 'book.closed', android: 'menu_book', web: 'menu_book' }}
            title={JaapMantraPlaceholder.label}
            description="मंत्र पाठ और स्रोत अभी उपलब्ध नहीं"
            trailing={<Pill label="जल्द" tone="outline" />}
            onPress={() => setShowMantraNote((current) => !current)}
          />

          {showMantraNote ? (
            <Notice description={JaapMantraPlaceholder.description} style={styles.mantraNotice} />
          ) : null}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="काउंटर कैसे काम करता है" />

        <Card>
          <InfoRow
            icon={{ ios: 'hand.tap', android: 'touch_app', web: 'touch_app' }}
            title="बटन से गिनें"
            description="हर बटन दबाने पर गिनती एक बढ़ती है"
          />
          <InfoRow
            icon={{ ios: 'target', android: 'track_changes', web: 'track_changes' }}
            title="लक्ष्य बदलें"
            description="27, 54 या 108 जाप में से चुनें"
          />
          <InfoRow
            icon={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
            title="सत्र समाप्त होते ही हट जाता है"
            description="प्रगति सहेजना और लक्ष्य याद रखना अगले चरण में जोड़े जाएँगे"
            last
          />
        </Card>
      </View>

      <Notice
        title="यह केवल एक अस्थायी काउंटर है"
        description="ऐप बंद होने पर गिनती नहीं रहेगी। स्थायी प्रगति, मंत्र चयन और सहेजे गए लक्ष्य अगले चरण में जोड़े जाएँगे।"
      />

      <SymbolView
        name={{ ios: 'hands.sparkles', android: 'self_improvement', web: 'self_improvement' }}
        size={IconSize.lg}
        tintColor={theme.accentBorder}
        style={styles.footerIcon}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  counterCard: {
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  cardHeader: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    gap: Spacing.xs,
  },
  counterText: {
    paddingHorizontal: Spacing.sm,
  },
  progressBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  progressBlock: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  targetBlock: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
  },
  targetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  centerText: {
    textAlign: 'center',
  },
  confirmBox: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  confirmButton: {
    flex: 1,
  },
  section: {
    gap: Spacing.md,
  },
  mantraNotice: {
    marginTop: Spacing.md,
  },
  footerIcon: {
    alignSelf: 'center',
  },
});
