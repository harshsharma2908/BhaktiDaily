import { Colors } from '@/constants/theme';
import { useResolvedColorScheme } from '@/hooks/use-resolved-color-scheme';

export function useTheme() {
  const scheme = useResolvedColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}
