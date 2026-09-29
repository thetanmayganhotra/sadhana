/**
 * Design tokens. PLACEHOLDER PALETTE — the final palette is set with the illustrator.
 * Direction v3: "Vedic minimal". Sandalwood paper, kohl ink, kumkum red, thin temple-gold
 * line-work, and a lot of empty space. Colour is used sparingly; line and type carry the design.
 * Dark mode is a lamp-lit temple at night: warm near-black with gold.
 * Contrast of text pairs is enforced by src/design/__tests__/tokens.test.ts.
 */

import type { StateId } from '@/content/types';

export type ColorScheme = 'light' | 'dark';

/** Raw pigments for line-work and decoration. Never used for body text. */
export const pigments = {
  kumkum: '#8E2C1F',
  saffron: '#C46A28',
  turmeric: '#D4A23A',
  indigo: '#3D4A6E',
  tulsi: '#56704F',
  lotus: '#C98A8A',
  sandal: '#D9C3A0',
  gold: '#A8823F',
  templeGold: '#C99A52',
} as const;

export type Palette = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string; // hairlines
  primary: string; // the one primary button per screen
  onPrimary: string;
  ornament: string; // gold line-work (yantra, dividers, numerals)
  accent: string; // bindu, today marker
  danger: string;
  focusRing: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: '#F4EEE3', // sandalwood paper
    surface: '#FAF6EE',
    text: '#2A211C', // kohl
    textMuted: '#6B5F55',
    border: '#E0D4C0',
    primary: pigments.kumkum,
    onPrimary: '#FAF6EE',
    ornament: pigments.gold,
    accent: pigments.kumkum,
    danger: '#A3282A',
    focusRing: pigments.kumkum,
  },
  dark: {
    background: '#14110E', // lamp-lit night
    surface: '#1C1814',
    text: '#EEE5D5',
    textMuted: '#A99C8B',
    border: '#332B23',
    primary: pigments.templeGold,
    onPrimary: '#14110E',
    ornament: pigments.templeGold,
    accent: '#D8664F',
    danger: '#E8877C',
    focusRing: pigments.templeGold,
  },
};

/**
 * One accent per user state, in earthy pigments. `fill` is decorative only (dots, line-work);
 * `soft` is a quiet tint that must carry `text` at 4.5:1.
 * Placeholders — final values TBD with the illustrator.
 */
export type StateAccent = { fill: string; soft: string };

export const stateAccents: Record<StateId, Record<ColorScheme, StateAccent>> = {
  racing_thoughts: {
    light: { fill: pigments.indigo, soft: '#E7E4E4' },
    dark: { fill: '#8E9CC4', soft: '#22232A' },
  },
  stress_before_moments: {
    light: { fill: pigments.tulsi, soft: '#E6E7DC' },
    dark: { fill: '#94AE8C', soft: '#1F2520' },
  },
  cant_switch_off: {
    light: { fill: '#4B4368', soft: '#E7E3E6' },
    dark: { fill: '#A79CCB', soft: '#24212C' },
  },
  low_energy_mornings: {
    light: { fill: pigments.saffron, soft: '#F3E3D2' },
    dark: { fill: '#E09A5E', soft: '#2C2219' },
  },
  feeling_flat: {
    light: { fill: pigments.kumkum, soft: '#F1E0DA' },
    dark: { fill: '#D8664F', soft: '#2D1E1A' },
  },
  hard_to_start: {
    light: { fill: pigments.turmeric, soft: '#F3E8CF' },
    dark: { fill: pigments.turmeric, soft: '#2B2518' },
  },
  scattered_focus: {
    light: { fill: '#3F6B66', soft: '#E2E8E2' },
    dark: { fill: '#86B3AC', soft: '#1D2624' },
  },
  restless_mind: {
    light: { fill: pigments.lotus, soft: '#F2E4E0' },
    dark: { fill: '#D9A2A0', soft: '#2B2121' },
  },
  waking_up_tired: {
    light: { fill: '#9A7A3C', soft: '#EFE6D3' },
    dark: { fill: '#CDAE6C', soft: '#28231A' },
  },
  want_deeper_practice: {
    light: { fill: pigments.gold, soft: '#EFE5D2' },
    dark: { fill: pigments.templeGold, soft: '#2A2319' },
  },
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

/** Font family names as registered by the @expo-google-fonts packages (loaded in app/_layout.tsx). */
export const fonts = {
  serifLight: 'CormorantGaramond_300Light',
  serif: 'CormorantGaramond_400Regular',
  serifMedium: 'CormorantGaramond_500Medium',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  sansLight: 'Jost_300Light',
  sans: 'Jost_400Regular',
  sansMedium: 'Jost_500Medium',
  devanagari: 'TiroDevanagariSanskrit_400Regular',
} as const;

/**
 * Type scale. Headings: Cormorant Garamond (covers all IAST diacritics).
 * Body: Jost (does NOT cover IAST — Sanskrit names must use the `sanskrit` variant).
 * No fontWeight here: with custom fonts each weight is its own family (Android requirement).
 * Sizes scale with the OS Dynamic Type setting (allowFontScaling stays on).
 */
export const typography = {
  display: { fontFamily: fonts.serifLight, fontSize: 40, lineHeight: 46 },
  title: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 38 },
  heading: { fontFamily: fonts.serifMedium, fontSize: 24, lineHeight: 30 },
  subheading: { fontFamily: fonts.serifMedium, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.sansLight, fontSize: 16, lineHeight: 25 },
  label: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18 },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sanskrit: { fontFamily: fonts.serifItalic, fontSize: 16, lineHeight: 22 },
  devanagari: { fontFamily: fonts.devanagari, fontSize: 24, lineHeight: 34 },
} as const;

/**
 * Motion: slow, breath-paced, never bouncy. Everything eases in and out; nothing snaps.
 * Reduce Motion replaces movement with plain opacity (see FadeIn / Yantra).
 */
export const motion = {
  duration: { fast: 150, base: 250, slow: 400, enter: 900, breath: 5000, drift: 120000 },
  stagger: 110,
  /** cubic-bezier control points, for Reanimated's Easing.bezier(...). */
  easing: {
    standard: [0.4, 0.0, 0.2, 1] as const,
    enter: [0.22, 1, 0.36, 1] as const, // soft ease-out
    exit: [0.4, 0.0, 1, 1] as const,
    breath: [0.37, 0, 0.63, 1] as const, // sine in-out
  },
} as const;

export const minTouchTarget = 44;
