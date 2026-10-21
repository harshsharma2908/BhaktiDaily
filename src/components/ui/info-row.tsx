import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSize, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InfoRowProps = {
  icon: SymbolViewProps['name'];
  title: string;
  description?: string;
  value?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  showChevron?: boolean;
  last?: boolean;
};

export function InfoRow({
  icon,
  title,
  description,
  value,
  trailing,
  onPress,
  disabled = false,
  showChevron = Boolean(onPress),
  last = false,
}: InfoRowProps) {
  const theme = useTheme();

  const content = (
    <>
      <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
        <SymbolView name={icon} size={IconSize.md} tintColor={theme.accent} />
      </View>

      <View style={styles.copy}>
        <ThemedText type="bodyStrong">{title}</ThemedText>
        {description ? (
          <ThemedText type="caption" themeColor="textSecondary">
            {description}
          </ThemedText>
        ) : null}
      </View>

      {trailing ??
        (value ? (
          <View style={[styles.value, { backgroundColor: theme.surfaceMuted }]}>
            <ThemedText type="caption" themeColor="textSecondary">
              {value}
            </ThemedText>
          </View>
        ) : null)}

      {showChevron ? (
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={IconSize.sm}
          tintColor={theme.textSecondary}
        />
      ) : null}
    </>
  );

  const rowStyle = [
    styles.row,
    !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth },
    disabled && styles.disabled,
  ];

  if (!onPress) {
    return <View style={rowStyle}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}${description ? `, ${description}` : ''}`}
      accessibilityState={{ disabled }}
      android_ripple={{ color: theme.accentSoft }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        ...rowStyle,
        pressed && !disabled && { backgroundColor: theme.surfaceMuted },
      ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: TouchTarget.comfortable,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
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
  value: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
  },
  disabled: {
    opacity: 0.55,
  },
});
