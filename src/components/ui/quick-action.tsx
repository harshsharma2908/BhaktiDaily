import { Link, type Href } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type QuickActionProps = {
  href: Href;
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
};

export function QuickAction({ href, icon, title, description }: QuickActionProps) {
  const theme = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${title}. ${description}`}
        android_ripple={{ color: theme.accentSoft }}
        style={styles.pressable}>
        {({ pressed }) => (
          <View
            style={[
              styles.tile,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}>
            <View style={styles.topRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
                <SymbolView name={icon} size={IconSize.lg} tintColor={theme.accent} />
              </View>
              <SymbolView
                name={{ ios: 'arrow.up.right', android: 'north_east', web: 'north_east' }}
                size={IconSize.sm}
                tintColor={theme.textSecondary}
              />
            </View>

            <View style={styles.copy}>
              <ThemedText type="bodyStrong">{title}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {description}
              </ThemedText>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minWidth: 0,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  tile: {
    flex: 1,
    minWidth: 0,
    minHeight: 132,
    justifyContent: 'space-between',
    gap: Spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  copy: {
    gap: Spacing.xxs,
  },
  pressed: {
    opacity: 0.82,
  },
});
