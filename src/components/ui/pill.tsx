import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PillTone = 'accent' | 'muted' | 'success' | 'outline';

type PillProps = {
  label: string;
  tone?: PillTone;
  icon?: SymbolViewProps['name'];
  style?: StyleProp<ViewStyle>;
};

export function Pill({ label, tone = 'accent', icon, style }: PillProps) {
  const theme = useTheme();

  const backgroundColor =
    tone === 'accent'
      ? theme.accentSoft
      : tone === 'muted'
        ? theme.surfaceMuted
        : tone === 'success'
          ? theme.successSoft
          : 'transparent';

  const textColor =
    tone === 'accent'
      ? 'accent'
      : tone === 'success'
        ? 'success'
        : tone === 'outline'
          ? 'accent'
          : 'textSecondary';

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor },
        tone === 'outline' && { borderColor: theme.accentBorder, borderWidth: StyleSheet.hairlineWidth },
        style,
      ]}>
      {icon ? <SymbolView name={icon} size={IconSize.sm - 2} tintColor={theme[textColor]} /> : null}
      <ThemedText type="caption" themeColor={textColor}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
  },
});
