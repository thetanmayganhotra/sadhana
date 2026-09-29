/**
 * Design tokens. PLACEHOLDER PALETTE — the final palette is set with the illustrator.
 * Direction: the bright mineral pigments of Rajput/Pahari miniature painting — lapis, marigold,
 * vermilion, rose, malachite — on warm ivory paper. Dark mode is a miniature night scene
 * (deep indigo sky), not black.
 * Contrast of text pairs is enforced by src/design/__tests__/tokens.test.ts.
 */

import type { StateId } from '@/content/types';

export type ColorScheme = 'light' | 'dark';

/** Raw pigments for illustration shapes and decoration. Never used for body text. */
export const pigments = {
  lapis: '#3446C8',
  lapisDeep: '#232F8F',
  marigold: '#FFB627',
  vermilion: '#F2603C',
  rose: '#F7A1B5',
  malachite: '#22A57B',
  peacock: '#1E8C9E',
  sky: '#A9C7FF',
  cream: '#FFE9C7',
  ivory: '#FFF7EC',
  night: '#12163A',
  ink: '#1E2340',
} as const;

export type Palette = {
  background: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string; // the one primary button per screen
  onPrimary: string;
  hero: string; // large feature cards (e.g. today's practice)
  onHero: string;
  onHeroMuted: string;
  danger: string;
  focusRing: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: pigments.ivory,
    surface: '#FFFFFF',
    surfaceRaised: '#FFFDF8',
    text: pigments.ink,
    textMuted: '#585D7C',
    border: '#F0E4D2',
    primary: pigments.marigold,
    onPrimary: pigments.ink,
    hero: pigments.lapis,
    onHero: '#FFFFFF',
    onHeroMuted: '#DDE2FF',
    danger: '#C62F3B',
    focusRing: pigments.lapis,
  },
  dark: {
    background: pigments.night,
    surface: '#1C2150',
    surfaceRaised: '#252B61',
    text: '#FFF4E4',
    textMuted: '#B9BCE0',
    border: '#2E3570',
    primary: pigments.marigold,
    onPrimary: pigments.ink,
    hero: '#2A3290',
    onHero: '#FFFFFF',
    onHeroMuted: '#D2D7FF',
    danger: '#FF8A80',
    focusRing: pigments.marigold,
  },
};

/**
 * One accent per user state. `fill` is the vivid decorative pigment (icons, shapes);
 * `soft` is a tint for chips/cards that carries normal `text` on top.
 * Placeholders — final values TBD with the illustrator.
 */
export type StateAccent = { fill: string; soft: string };

export const stateAccents: Record<StateId, Record<ColorScheme, StateAccent>> = {
  racing_thoughts: {
    light: { fill: pigments.lapis, soft: '#E3E7FF' },
    dark: { fill: pigments.sky, soft: '#2B3478' },
  },
  stress_before_moments: {
    light: { fill: pigments.peacock, soft: '#D8F1F3' },
    dark: { fill: '#6FD0DD', soft: '#1D4658' },
  },
  cant_switch_off: {
    light: { fill: '#6B5BD6', soft: '#ECE8FF' },
    dark: { fill: '#B7ABFF', soft: '#342C6E' },
  },
  low_energy_mornings: {
    light: { fill: pigments.marigold, soft: '#FFF0CC' },
    dark: { fill: pigments.marigold, soft: '#4A3A24' },
  },
  feeling_flat: {
    light: { fill: pigments.vermilion, soft: '#FFE3DA' },
    dark: { fill: '#FF8E6E', soft: '#4D2A35' },
  },
  hard_to_start: {
    light: { fill: '#FF8A3D', soft: '#FFE8D6' },
    dark: { fill: '#FFAE72', soft: '#4B3226' },
  },
  scattered_focus: {
    light: { fill: pigments.malachite, soft: '#D9F3E8' },
    dark: { fill: '#5FD3A8', soft: '#1D4A45' },
  },
  restless_mind: {
    light: { fill: '#D0569B', soft: '#FBE1EE' },
    dark: { fill: '#F39CCB', soft: '#4A2651' },
  },
  waking_up_tired: {
    light: { fill: '#E3A21A', soft: '#FFF3D1' },
    dark: { fill: '#FFD166', soft: '#483F25' },
  },
  want_deeper_practice: {
    light: { fill: pigments.rose, soft: '#FFE6EC' },
    dark: { fill: pigments.rose, soft: '#4A2A45' },
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
