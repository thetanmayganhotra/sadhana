/**
 * Design tokens. PLACEHOLDER PALETTE — the final palette is set with the illustrator.
 * Direction: warm manuscript paper, ink, muted mineral pigments (simplified miniature art).
 * Contrast of text-on-surface pairs is enforced by src/design/__tests__/tokens.test.ts.
 */

import type { StateId } from '@/content/types';

export type ColorScheme = 'light' | 'dark';

export type Palette = {
  background: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string; // the one primary button per screen
  onPrimary: string;
  danger: string;
  focusRing: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: '#F7F2E8', // manuscript paper
    surface: '#FFFCF6',
    surfaceRaised: '#FFFFFF',
    text: '#2A241C', // lamp-black ink
    textMuted: '#645A4C',
    border: '#E4DACA',
    primary: '#8A3B1F', // burnt sienna
    onPrimary: '#FFFCF6',
    danger: '#9E2A2B',
    focusRing: '#2F5D8A',
  },
  dark: {
    background: '#16130F',
    surface: '#1F1B16',
    surfaceRaised: '#29241E',
    text: '#F2EADC',
    textMuted: '#B8AC99',
    border: '#3A332A',
    primary: '#E0A36B',
    onPrimary: '#1F1B16',
    danger: '#F08A80',
    focusRing: '#8FB6DE',
  },
};

/** One accent per user state. Placeholders — final values TBD with the illustrator. */
export const stateAccents: Record<StateId, { light: string; dark: string }> = {
  racing_thoughts: { light: '#2F5D8A', dark: '#8FB6DE' }, // cool indigo-blue
  stress_before_moments: { light: '#3E6B5A', dark: '#8CC2AC' }, // verdigris
  cant_switch_off: { light: '#4B4A7A', dark: '#A9A7DA' }, // night indigo
  low_energy_mornings: { light: '#9A5510', dark: '#F0B267' }, // saffron
  feeling_flat: { light: '#8A3B1F', dark: '#E0A36B' }, // sienna
  hard_to_start: { light: '#9A4A2E', dark: '#E8A488' }, // terracotta
  scattered_focus: { light: '#5B6B1E', dark: '#BFCB7A' }, // leaf green
  restless_mind: { light: '#6A3F6E', dark: '#CFA3D3' }, // lac purple
  waking_up_tired: { light: '#86621A', dark: '#E3C46F' }, // ochre
  want_deeper_practice: { light: '#7A2E3A', dark: '#E39AA6' }, // madder red
};

/** 4-pt spacing scale. */
export const spacing = {
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

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/**
 * Font families. PLACEHOLDER: system fonts until the heading serif (needs IAST diacritics +
 * Devanagari) and body sans are confirmed. Swap these names once fonts are loaded via expo-font.
 */
export const fontFamilies = {
  heading: undefined as string | undefined, // TODO(fonts): serif with IAST + Devanagari support
  body: undefined as string | undefined, // TODO(fonts): clean sans
};

/** Base sizes; scaled by the OS Dynamic Type setting (allowFontScaling stays on). */
export const typography = {
  display: { fontSize: 34, lineHeight: 42, fontWeight: '600' },
  title: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  heading: { fontSize: 22, lineHeight: 30, fontWeight: '600' },
  subheading: { fontSize: 18, lineHeight: 26, fontWeight: '500' },
  body: { fontSize: 17, lineHeight: 26, fontWeight: '400' },
  label: { fontSize: 15, lineHeight: 20, fontWeight: '500' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
} as const;

/** Motion: soft fades and gentle scale, never bouncy. */
export const motion = {
  duration: { fast: 150, base: 250, slow: 400 },
  /** cubic-bezier control points, usable with Reanimated's Easing.bezier(...). */
  easing: {
    standard: [0.4, 0.0, 0.2, 1] as const,
    enter: [0.0, 0.0, 0.2, 1] as const,
    exit: [0.4, 0.0, 1, 1] as const,
    breath: [0.45, 0.05, 0.55, 0.95] as const, // sine-like, for breathing visuals
  },
} as const;

export const minTouchTarget = 44;
