import { Link, type Href } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FeatureTileProps = {
  href: Href;
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
};

export function FeatureTile({ href, icon, title, description }: FeatureTileProps) {
  const theme = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        android_ripple={{ color: theme.accentSoft }}
        style={StyleSheet.flatten([
          styles.tile,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ])}>
        <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
          <SymbolView name={icon} size={22} tintColor={theme.accent} />
        </View>

        <View style={styles.copy}>
          <ThemedText type="bodyStrong">{title}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {description}
          </ThemedText>
        </View>

        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={16}
          tintColor={theme.textSecondary}
        />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: Spacing.xxs,
  },
});
