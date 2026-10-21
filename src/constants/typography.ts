import { Platform, type TextStyle } from 'react-native';

/**
 * Devanagari benefits from a generous line height. These families intentionally
 * use the platform's Devanagari-capable system font (Noto Sans Devanagari on
 * Android, system Devanagari on iOS, and the CSS stack on web).
 *
 * A bundled brand font can be added later without changing screen code.
 */
export const Fonts = {
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: 'var(--font-sans)',
    default: 'sans-serif',
  }) as string,
} as const;

export const Typography = {
  display: {
    fontFamily: Fonts.sans,
    fontSize: 30,
    lineHeight: 42,
    fontWeight: '700',
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '700',
  },
  heading: {
    fontFamily: Fonts.sans,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '700',
  },
  lead: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '600',
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
  },
  bodyStrong: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  eyebrow: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  counter: {
    fontFamily: Fonts.sans,
    fontSize: 64,
    lineHeight: 76,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  button: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;
