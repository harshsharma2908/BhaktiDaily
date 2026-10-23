import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { IconSize, Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconButtonProps = {
  icon: SymbolViewProps['name'];
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
};

/** A 44pt icon-only control for compact steppers and similar actions. */
export function IconButton({ icon, accessibilityLabel, onPress, disabled = false }: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      android_ripple={{ color: theme.accentSoft, borderless: true }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.border,
        },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <SymbolView
        name={icon}
        size={IconSize.md}
        tintColor={disabled ? theme.textSecondary : theme.accent}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
});
