import { StyleSheet, Text, type TextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { Typography, type TypographyVariant } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: TypographyVariant;
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = 'body',
  themeColor = 'text',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[styles.base, { color: theme[themeColor] }, Typography[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 1,
  },
});
