import { Link, type Href } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Pill } from '@/components/ui/pill';
import type { PujaGuide, PujaGuideIcon } from '@/data/puja-guides';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const iconMap: Record<PujaGuideIcon, SymbolViewProps['name']> = {
  morning: { ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' },
  evening: { ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' },
  festival: { ios: 'sparkles', android: 'celebration', web: 'celebration' },
  silence: { ios: 'moon.stars.fill', android: 'self_improvement', web: 'self_improvement' },
};

type GuideCardProps = {
  guide: PujaGuide;
};

export function GuideCard({ guide }: GuideCardProps) {
  const theme = useTheme();
  const href: Href = { pathname: '/puja/[id]', params: { id: guide.id } };

  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${guide.title}, ${guide.category}, नमूना मार्गदर्शिका`}
        android_ripple={{ color: theme.accentSoft }}
        style={styles.pressable}>
        {({ pressed }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}>
            <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
              <SymbolView name={iconMap[guide.icon]} size={IconSize.lg} tintColor={theme.accent} />
            </View>

            <View style={styles.copy}>
              <View style={styles.pills}>
                <Pill label={guide.category} tone="muted" />
                <Pill label="नमूना" tone="outline" />
              </View>

              <ThemedText type="bodyStrong">{guide.title}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
                {guide.description}
              </ThemedText>

              <View style={styles.meta}>
                <SymbolView
                  name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                  size={IconSize.sm}
                  tintColor={theme.textSecondary}
                />
                <ThemedText type="caption" themeColor="textSecondary">
                  {guide.duration}
                </ThemedText>
              </View>
            </View>

            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={IconSize.sm}
              tintColor={theme.textSecondary}
            />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  iconWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  copy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  pressed: {
    opacity: 0.82,
  },
});
