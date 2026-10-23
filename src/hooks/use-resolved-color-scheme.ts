import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePreferences } from '@/providers/preferences-provider';

/**
 * Combines the saved appearance preference with the system scheme. The
 * preference is local-only; `system` keeps the device behaviour.
 */
export function useResolvedColorScheme() {
  const systemScheme = useColorScheme();
  const { preferences } = usePreferences();

  if (preferences.appearance === 'system') {
    return systemScheme;
  }

  return preferences.appearance;
}
