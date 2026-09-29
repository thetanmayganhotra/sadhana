/**
 * Design tokens. PLACEHOLDER PALETTE — the final palette is set with the illustrator.
 * Direction v4: "Vedic minimal, in colour". Calm layout and lots of empty space, but painted with
 * the full set of Indian pigments — peacock teal, lotus pink, saffron, indigo, tulsi green,
 * kumkum red — as thin line-work and soft washes, never as big saturated blocks.
 * Dark mode is an indigo night sky, not brown-black.
 * Contrast of text pairs is enforced by src/design/__tests__/tokens.test.ts.
 */

import type { StateId } from '@/content/types';

export type ColorScheme = 'light' | 'dark';

/** Raw pigments for line-work and decoration. Never used for body text. */
export const pigments = {
  kumkum: '#A8322A',
  saffron: '#E07B2E',
  turmeric: '#D9A327',
  indigo: '#34406E',
  peacock: '#1F7A7A',
  lotus: '#D26A7E',
  tulsi: '#4F7D4A',
  sky: '#6E9BC7',
  gold: '#B08A45',
} as const;

/** Colours for the yantra's layers (outer → bindu) and the soft dawn glow behind it. */
export type YantraColors = {
  outer: string;
  petalA: string;
  petalB: string;
  middle: string;
  star: string;
  inner: string;
  bindu: string;
  glowA: string;
  glowB: string;
};

export type Palette = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string; // hairlines
  primary: string; // the one primary button per screen
  onPrimary: string;
  ornament: string; // dividers, small line-work
  accent: string; // today marker, streak flame
  eyebrow: string; // coloured section labels
  done: string; // completed days
  steps: readonly string[]; // numerals in a flow, cycled
  yantra: YantraColors;
  danger: string;
  focusRing: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: '#F8F3EA', // unbleached cotton paper
    surface: '#FFFBF4',
    text: '#26222A',
    textMuted: '#655F6B',
    border: '#E7DDCF',
    primary: pigments.kumkum,
    onPrimary: '#FFFBF4',
    ornament: pigments.gold,
    accent: pigments.kumkum,
    eyebrow: '#1B6B6B',
    done: pigments.peacock,
    steps: [pigments.peacock, pigments.lotus, pigments.saffron, pigments.indigo, pigments.tulsi],
    yantra: {
      outer: pigments.indigo,
      petalA: pigments.lotus,
      petalB: pigments.saffron,
      middle: pigments.gold,
      star: pigments.peacock,
      inner: pigments.kumkum,
      bindu: pigments.kumkum,
      glowA: '#FBDCC4', // dawn peach
      glowB: '#F7D3DC', // lotus blush
    },
    danger: '#A3282A',
    focusRing: pigments.peacock,
  },
  dark: {
    background: '#12141F', // indigo night
    surface: '#1A1D2B',
    text: '#EFEAE0',
    textMuted: '#A9A7B6',
    border: '#2A2E40',
    primary: '#E9A95B', // lamp flame
    onPrimary: '#12141F',
    ornament: '#C9A45F',
    accent: '#F08A6C',
    eyebrow: '#6FC6C0',
    done: '#6FC6C0',
    steps: ['#6FC6C0', '#F0A0B2', '#F2A765', '#A7B4EC', '#9CC794'],
    yantra: {
      outer: '#A7B4EC',
      petalA: '#F0A0B2',
      petalB: '#F2A765',
      middle: '#C9A45F',
      star: '#6FC6C0',
      inner: '#F08A6C',
      bindu: '#F08A6C',
      glowA: '#2B2440', // violet dusk
      glowB: '#1D3038', // peacock night
    },
    danger: '#F0877C',
    focusRing: '#6FC6C0',
  },
};

/**
 * One accent per user state. `fill` is decorative only (dots, line-work);
 * `soft` is a quiet tint that must carry `text` at 4.5:1.
 * Placeholders — final values TBD with the illustrator.
 */
export type StateAccent = { fill: string; soft: string };

export const stateAccents: Record<StateId, Record<ColorScheme, StateAccent>> = {
  racing_thoughts: {
    light: { fill: pigments.sky, soft: '#E3ECF6' },
    dark: { fill: '#8FB4DC', soft: '#1E2A3C' },
  },
  stress_before_moments: {
    light: { fill: pigments.peacock, soft: '#DDEFEC' },
    dark: { fill: '#6FC6C0', soft: '#1A3035' },
  },
  cant_switch_off: {
    light: { fill: pigments.indigo, soft: '#E6E6F2' },
    dark: { fill: '#A7B4EC', soft: '#23284A' },
  },
  low_energy_mornings: {
    light: { fill: pigments.saffron, soft: '#FCE6D3' },
    dark: { fill: '#F2A765', soft: '#382818' },
  },
  feeling_flat: {
    light: { fill: pigments.kumkum, soft: '#F7E0DC' },
    dark: { fill: '#F08A6C', soft: '#3A2020' },
  },
  hard_to_start: {
    light: { fill: pigments.turmeric, soft: '#FAEDCB' },
    dark: { fill: '#E9C25B', soft: '#352D16' },
  },
  scattered_focus: {
    light: { fill: pigments.tulsi, soft: '#E2EEDC' },
    dark: { fill: '#9CC794', soft: '#1E3120' },
  },
  restless_mind: {
    light: { fill: pigments.lotus, soft: '#F9E1E6' },
    dark: { fill: '#F0A0B2', soft: '#3A2230' },
  },
  waking_up_tired: {
    light: { fill: '#8C6BC2', soft: '#ECE4F6' },
    dark: { fill: '#C3A8EE', soft: '#2E2542' },
  },
  want_deeper_practice: {
    light: { fill: pigments.gold, soft: '#F3E8D2' },
    dark: { fill: '#C9A45F', soft: '#302919' },
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
