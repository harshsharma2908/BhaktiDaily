import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppInfo } from '@/constants/app';
import { IconSize, Layout, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs style={[styles.tabs, { backgroundColor: theme.background }]}>
      <TabList asChild>
        <WebTabBar>
          <TabTrigger name="home" href="/" asChild>
            <WebTabButton
              label="होम"
              icon={{ ios: 'house.fill', android: 'home', web: 'home' }}
            />
          </TabTrigger>
          <TabTrigger name="calendar" href="/calendar" asChild>
            <WebTabButton
              label="कैलेंडर"
              icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            />
          </TabTrigger>
          <TabTrigger name="puja" href="/puja" asChild>
            <WebTabButton
              label="पूजा"
              icon={{ ios: 'flame.fill', android: 'temple_hindu', web: 'temple_hindu' }}
            />
          </TabTrigger>
          <TabTrigger name="jaap" href="/jaap" asChild>
            <WebTabButton
              label="जाप"
              icon={{ ios: 'repeat', android: 'repeat', web: 'repeat' }}
            />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <WebTabButton
              label="सेटिंग्स"
              icon={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
            />
          </TabTrigger>
        </WebTabBar>
      </TabList>

      <TabSlot style={styles.slot} />
    </Tabs>
  );
}

function WebTabBar({ children, style, ...props }: TabListProps) {
  const theme = useTheme();

  return (
    <View {...props} style={[styles.header, { borderBottomColor: theme.border }, style]}>
      <View style={styles.headerInner}>
        <View style={styles.brandRow}>
          <View style={[styles.brandMark, { backgroundColor: theme.accent }]}>
            <Text style={[styles.brandGlyph, { color: theme.onAccent }]}>भ</Text>
          </View>
          <View>
            <Text style={[Typography.bodyStrong, { color: theme.text }]}>{AppInfo.name}</Text>
            <Text style={[Typography.caption, { color: theme.textSecondary }]}>
              {AppInfo.nameEn}
            </Text>
          </View>
        </View>

        <View style={styles.tabRow}>{children}</View>
      </View>
    </View>
  );
}

type PressableRef = ComponentProps<typeof Pressable>['ref'];

function WebTabButton({
  label,
  icon,
  isFocused,
  ref,
  ...props
}: TabTriggerSlotProps & { label: string; icon: SymbolViewProps['name'] }) {
  const theme = useTheme();

  return (
    <Pressable
      ref={ref as PressableRef}
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [
        styles.tabButton,
        { backgroundColor: isFocused ? theme.accentSoft : 'transparent' },
        pressed && styles.pressed,
      ]}>
      <SymbolView
        name={icon}
        size={IconSize.sm}
        tintColor={isFocused ? theme.accent : theme.textSecondary}
      />
      <Text
        style={[
          Typography.label,
          { color: isFocused ? theme.accent : theme.textSecondary },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerInner: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandGlyph: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tabButton: {
    minHeight: TouchTarget.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.7,
  },
});
