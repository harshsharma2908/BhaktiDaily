import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardTone = 'default' | 'accent' | 'muted' | 'success';

type CardProps = PropsWithChildren<{
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, tone = 'default', style }: CardProps) {
  const theme = useTheme();

  const backgroundColor =
    tone === 'accent'
      ? theme.accentSoft
      : tone === 'muted'
        ? theme.surfaceMuted
        : tone === 'success'
          ? theme.successSoft
          : theme.surface;

  const borderColor =
    tone === 'accent'
      ? theme.accentBorder
      : tone === 'success'
        ? theme.success
        : theme.border;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor, borderColor },
        tone === 'accent' && { borderLeftColor: theme.accent, borderLeftWidth: 3 },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
});
