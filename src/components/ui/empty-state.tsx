import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
  style,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.root,
        compact && styles.compact,
        { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
        style,
      ]}>
      <View
        style={[
          styles.iconWrap,
          compact && styles.iconWrapCompact,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}>
        <SymbolView
          name={icon}
          size={compact ? IconSize.md : IconSize.lg}
          tintColor={theme.accent}
        />
      </View>

      <View style={styles.copy}>
        <ThemedText type={compact ? 'bodyStrong' : 'heading'} style={styles.centerText}>
          {title}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.centerText}>
          {description}
        </ThemedText>
      </View>

      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" size="md" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: Spacing.xl,
  },
  compact: {
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  iconWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
  },
  iconWrapCompact: {
    width: 44,
    height: 44,
  },
  copy: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  centerText: {
    textAlign: 'center',
  },
});
