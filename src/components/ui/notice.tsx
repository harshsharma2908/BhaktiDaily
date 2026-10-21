import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NoticeTone = 'sample' | 'info' | 'success';

type NoticeProps = {
  title?: string;
  description: string;
  tone?: NoticeTone;
  icon?: SymbolViewProps['name'];
  style?: StyleProp<ViewStyle>;
};

const toneIcons: Record<NoticeTone, SymbolViewProps['name']> = {
  sample: { ios: 'info.circle', android: 'info', web: 'info' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  success: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
};

export function Notice({ title, description, tone = 'info', icon, style }: NoticeProps) {
  const theme = useTheme();

  const backgroundColor =
    tone === 'sample' ? theme.accentSoft : tone === 'success' ? theme.successSoft : theme.surfaceMuted;
  const borderColor =
    tone === 'sample' ? theme.accentBorder : tone === 'success' ? theme.success : theme.border;
  const tintColor = tone === 'success' ? theme.success : theme.accent;

  return (
    <View
      style={[styles.root, { backgroundColor, borderColor }, style]}
      accessibilityRole={tone === 'success' ? 'alert' : undefined}>
      <SymbolView name={icon ?? toneIcons[tone]} size={IconSize.md} tintColor={tintColor} />

      <View style={styles.copy}>
        {title ? (
          <ThemedText type="label" themeColor={tone === 'success' ? 'success' : 'text'}>
            {title}
          </ThemedText>
        ) : null}
        <ThemedText type="caption" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  copy: {
    flex: 1,
    gap: Spacing.xxs,
  },
});
