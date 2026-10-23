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
  JaapMantraPlaceholder,
  JaapTargets,
  type JaapTarget,
} from '@/data/jaap';
import { useJaap } from '@/hooks/use-jaap';
import { getJaapProgress, isJaapComplete } from '@/lib/jaap-state';
import { useTheme } from '@/hooks/use-theme';

export default function JaapScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { state, increment: incrementCount, reset, selectTarget: selectSavedTarget, loadStatus, saveError } =
    useJaap();
  const [showMantraNote, setShowMantraNote] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const { count, target } = state;
  const progress = getJaapProgress(state);
  const isComplete = isJaapComplete(state);
  const circleSize = Math.min(260, Math.max(196, width - 128));
  const storageUnavailable = loadStatus === 'error' || saveError;

  function increment() {
    setConfirmReset(false);
    incrementCount();
  }

  function resetCounter() {
    reset();
    setConfirmReset(false);
  }

  function selectTarget(nextTarget: JaapTarget) {
    selectSavedTarget(nextTarget);
    setConfirmReset(false);
  }

  return (
    <Screen
      eyebrow={AppInfo.name}
      title="जाप"
      subtitle="अपनी गति से स्मरण, बिना जल्दबाज़ी। आपकी गिनती इस डिवाइस पर सहेजी जाती है।">
      <Card style={styles.counterCard}>
        <View style={styles.cardHeader}>
          <Pill label="जाप काउंटर" />
          <Pill label="स्थानीय" tone="muted" />
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
            शुरू करने के लिए ऊपर का बटन दबाएँ। गिनती और लक्ष्य इस डिवाइस पर सहेजे जाएँगे।
          </ThemedText>
        ) : confirmReset ? (
          <View
            style={[
              styles.confirmBox,
              { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}>
            <ThemedText type="bodyStrong">काउंटर रीसेट करें?</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              सहेजी गई गिनती 0 हो जाएगी। इसे वापस नहीं लाया जा सकेगा।
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

        {storageUnavailable ? (
          <Notice
            title="प्रगति सहेजी नहीं जा सकी"
            description="इस समय इस डिवाइस की स्थानीय स्टोरेज उपलब्ध नहीं है। गिनती अभी चलेगी, लेकिन ऐप बंद होने पर वह नहीं रहेगी।"
            style={styles.storageNotice}
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
            description="27, 54 या 108 में से चुनें। लक्ष्य बदलने पर गिनती नहीं बदलती।"
          />
          <InfoRow
            icon={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
            title="रीसेट करने पर"
            description="केवल गिनती शून्य होती है; चुना हुआ लक्ष्य बना रहता है।"
            last
          />
        </Card>
      </View>

      <Notice
        title="गिनती और लक्ष्य सहेजे जाते हैं"
        description="यह एक स्थानीय, जारी रहने वाला काउंटर है — कोई दैनिक स्ट्रीक या खाता नहीं। ऐप बंद करने पर भी गिनती वहीं से शुरू होगी जहाँ आपने छोड़ी थी।"
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
  storageNotice: {
    marginTop: Spacing.xs,
  },
  footerIcon: {
    alignSelf: 'center',
  },
});
