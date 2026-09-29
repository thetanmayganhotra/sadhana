import { Text as RNText, type TextProps } from 'react-native';

import { useTheme } from '../theme';
import { fontFamilies, typography } from '../tokens';

type Variant = keyof typeof typography;

export function Text({
  variant = 'body',
  muted = false,
  style,
  ...rest
}: TextProps & { variant?: Variant; muted?: boolean }) {
  const { colors } = useTheme();
  const isHeading = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <RNText
      style={[
        typography[variant],
        { color: muted ? colors.textMuted : colors.text },
        { fontFamily: isHeading ? fontFamilies.heading : fontFamilies.body },
        style,
      ]}
      {...rest}
    />
  );
}
