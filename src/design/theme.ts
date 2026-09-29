import { useColorScheme } from 'react-native';

import { palettes, type ColorScheme, type Palette } from './tokens';

export function useTheme(): { scheme: ColorScheme; colors: Palette } {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: palettes[scheme] };
}
