import { StyleSheet, View } from 'react-native';

import { useTheme } from '../theme';
import { spacing } from '../tokens';

/** Hairline divider with a small gold lozenge in the middle, as in manuscript margins. */
export function Ornament() {
  const { colors } = useTheme();
  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      <View style={[styles.diamond, { borderColor: colors.ornament }]} />
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  line: { flex: 1, height: StyleSheet.hairlineWidth * 2 },
  diamond: { width: 7, height: 7, borderWidth: 1, transform: [{ rotate: '45deg' }] },
});
