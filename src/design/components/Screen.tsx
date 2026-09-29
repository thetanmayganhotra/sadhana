import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../theme';
import { spacing } from '../tokens';

import { FadeIn } from './FadeIn';
import { Text } from './Text';

export function Screen({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn style={styles.header}>
          {eyebrow ? (
            <Text variant="eyebrow" muted>
              {eyebrow}
            </Text>
          ) : null}
          <Text variant="display" accessibilityRole="header">
            {title}
          </Text>
        </FadeIn>
        <FadeIn index={1} style={styles.body}>
          {children}
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.huge },
  header: { gap: spacing.xs, marginBottom: spacing.xl },
  body: { gap: spacing.lg },
});
