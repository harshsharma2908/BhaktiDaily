import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSize, Layout, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
};

export function Screen({
  title,
  subtitle,
  eyebrow,
  onBack,
  backLabel = 'वापस',
  children,
}: ScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            {onBack ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={backLabel}
                android_ripple={{ color: theme.accentSoft, borderless: true }}
                hitSlop={4}
                onPress={onBack}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <SymbolView
                  name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
                  size={IconSize.md}
                  tintColor={theme.accent}
                />
                <ThemedText type="label" themeColor="accent">
                  {backLabel}
                </ThemedText>
              </Pressable>
            ) : null}

            <View style={styles.header}>
              {eyebrow ? (
                <ThemedText type="eyebrow" themeColor="accent">
                  {eyebrow}
                </ThemedText>
              ) : null}
              <ThemedText type="display" accessibilityRole="header">
                {title}
              </ThemedText>
              {subtitle ? (
                <ThemedText type="body" themeColor="textSecondary">
                  {subtitle}
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.body}>{children}</View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

type SectionHeaderProps = {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, hint, actionLabel, onAction }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="heading" style={styles.sectionTitle}>
        {title}
      </ThemedText>

      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={4}
          onPress={onAction}
          style={({ pressed }) => [styles.sectionAction, pressed && styles.pressed]}>
          <ThemedText type="label" themeColor="accent">
            {actionLabel}
          </ThemedText>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={IconSize.sm}
            tintColor={theme.accent}
          />
        </Pressable>
      ) : hint ? (
        <ThemedText type="caption" themeColor="textSecondary" style={styles.sectionHint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xxl + Spacing.lg,
  },
  inner: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: Layout.maxContentWidth,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: TouchTarget.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginLeft: -Spacing.sm,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.sm,
  },
  header: {
    gap: Spacing.sm,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl + Spacing.sm,
  },
  body: {
    gap: Spacing.xl,
  },
  sectionHeader: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  sectionTitle: {
    flexShrink: 1,
  },
  sectionHint: {
    flexShrink: 1,
    textAlign: 'right',
  },
  sectionAction: {
    minHeight: TouchTarget.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  pressed: {
    opacity: 0.65,
  },
});
