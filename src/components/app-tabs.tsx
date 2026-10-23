import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';

/**
 * Android/iOS use the system tab bar for native feel, accessibility and
 * predictable safe-area handling. The web version lives in app-tabs.web.tsx.
 */
export default function AppTabs() {
  const colors = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      tintColor={colors.accent}
      iconColor={{ default: colors.textSecondary, selected: colors.accent }}
      labelStyle={{
        default: { color: colors.textSecondary },
        selected: { color: colors.accent },
      }}
      indicatorColor={colors.accentSoft}
      rippleColor={colors.accentSoft}
      tabBarRespectsIMEInsets
      labelVisibilityMode="labeled">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>होम</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>कैलेंडर</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="puja">
        <NativeTabs.Trigger.Label>पूजा</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="flame.fill" md="temple_hindu" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="jaap">
        <NativeTabs.Trigger.Label>जाप</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="repeat" md="repeat" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>सेटिंग्स</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
