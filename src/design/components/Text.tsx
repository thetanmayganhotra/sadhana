import { Text as RNText, type TextProps } from 'react-native';

import { useTheme } from '../theme';
import { typography } from '../tokens';

export type TextVariant = keyof typeof typography;

export function Text({
  variant = 'body',
  muted = false,
  style,
  ...rest
}: TextProps & { variant?: TextVariant; muted?: boolean }) {
  const { colors } = useTheme();
  return (
    <RNText
      style={[typography[variant], { color: muted ? colors.textMuted : colors.text }, style]}
      {...rest}
    />
  );
}
