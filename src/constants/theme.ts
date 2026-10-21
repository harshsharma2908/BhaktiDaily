import '@/global.css';

/**
 * Bhakti Daily colour system.
 *
 * Light: warm ivory surfaces, white content cards and a deep saffron accent.
 * Dark: warm charcoal (not pure black) with a softer saffron accent.
 *
 * The supplied brand saffron (#D97706) is used decoratively. For text and
 * primary buttons a slightly deeper saffron is used so normal-size text meets
 * WCAG AA contrast on white/ivory surfaces.
 */
export const Colors = {
  light: {
    background: '#FFF9F0',
    surface: '#FFFFFF',
    surfaceMuted: '#F7EDDF',
    border: '#E9DFD1',
    text: '#3D2B1F',
    textSecondary: '#756B60',
    accent: '#B45309',
    accentStrong: '#8A3E07',
    accentSoft: '#FDF0DC',
    accentBorder: '#EFD2A7',
    saffron: '#D97706',
    onAccent: '#FFFFFF',
    success: '#467857',
    successSoft: '#E7F1EA',
  },
  dark: {
    background: '#14100D',
    surface: '#1E1813',
    surfaceMuted: '#2A211A',
    border: '#3B2F24',
    text: '#F6EDE1',
    textSecondary: '#C8B7A4',
    accent: '#F2A65A',
    accentStrong: '#F7C48D',
    accentSoft: '#3A2716',
    accentBorder: '#5A3B1E',
    saffron: '#F2A65A',
    onAccent: '#231407',
    success: '#8CC7A3',
    successSoft: '#22372A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** A 4pt-based spacing scale, with a few larger layout steps. */
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const Radius = {
  xs: 8,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28,
  pill: 999,
} as const;

/** Consistent icon sizing across screens and the tab bar. */
export const IconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 30,
} as const;

/** Android and iOS both expect at least a 44pt touch target. */
export const TouchTarget = {
  min: 44,
  comfortable: 48,
} as const;

export const Layout = {
  maxContentWidth: 720,
  screenPadding: Spacing.lg,
  calendarMaxWidth: 460,
} as const;
