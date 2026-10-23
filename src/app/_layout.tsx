import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';
import { useResolvedColorScheme } from '@/hooks/use-resolved-color-scheme';
import { PreferencesProvider, usePreferences } from '@/providers/preferences-provider';

SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen may already be hidden during fast refresh.
});

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <RootNavigation />
    </PreferencesProvider>
  );
}

function RootNavigation() {
  const scheme = useResolvedColorScheme();
  const { hydrated } = usePreferences();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  useEffect(() => {
    if (!hydrated) {
      // Do not hold the splash screen indefinitely if storage is slow.
      const fallback = setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {});
      }, 1500);

      return () => clearTimeout(fallback);
    }

    SplashScreen.hideAsync().catch(() => {
      // The native splash screen is not available on web.
    });
  }, [hydrated]);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppTabs />
    </ThemeProvider>
  );
}
