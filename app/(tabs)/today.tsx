import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { StateId } from '@/content/types';
import { FadeIn } from '@/design/components/FadeIn';
import { Ornament } from '@/design/components/Ornament';
import { Text } from '@/design/components/Text';
import { Yantra } from '@/design/components/Yantra';
import { useTheme } from '@/design/theme';
import { minTouchTarget, radii, spacing, stateAccents } from '@/design/tokens';

// DESIGN PREVIEW: static data until personalize() and the practice log land (Phases 3 and 5).
const PREVIEW = {
  states: ['racing_thoughts', 'cant_switch_off'] as StateId[],
  flow: [
    { id: 'sama_vritti', iast: 'Sama Vṛtti', minutes: 3 },
    { id: 'bhramari', iast: 'Bhrāmarī', minutes: 4 },
    { id: 'so_hum', iast: "So'ham", minutes: 3 },
  ] as const,
  streak: 3,
  weekDone: [true, true, true, false, false, false, false],
  todayIndex: 3,
};

export default function TodayScreen() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const totalMinutes = PREVIEW.flow.reduce((sum, f) => sum + f.minutes, 0);
  const weekdays = t('weekdays', { returnObjects: true }) as string[];

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn style={styles.header}>
          <Text variant="eyebrow" muted>
            {t('today.greeting')}
          </Text>
          <View
            style={styles.streak}
            accessible
            accessibilityLabel={t('today.streakA11y', { count: PREVIEW.streak })}
          >
            <View style={[styles.flame, { backgroundColor: colors.accent }]} />
            <Text variant="caption" muted>
              {t('today.streak', { count: PREVIEW.streak })}
            </Text>
          </View>
        </FadeIn>

        <FadeIn index={1} style={styles.hero}>
          <Yantra size={232} />
        </FadeIn>

        <FadeIn index={2} style={styles.heroText}>
          <Text variant="eyebrow" style={{ color: colors.eyebrow }}>
            {t('today.heroLabel')}
          </Text>
          <Text variant="title" style={styles.center} accessibilityRole="header">
            {t('today.heroTitle')}
          </Text>
          <Text variant="body" muted>
            {t('today.heroMeta', { count: PREVIEW.flow.length, minutes: totalMinutes })}
          </Text>
        </FadeIn>

        <FadeIn index={3} style={styles.beginWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('today.begin')}
            style={({ pressed }) => [
              styles.begin,
              { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text variant="button" style={{ color: colors.onPrimary }}>
              {t('today.begin')}
            </Text>
          </Pressable>
        </FadeIn>

        <FadeIn index={4}>
          <Ornament />
        </FadeIn>

        <FadeIn index={5} style={styles.section}>
          <Text variant="eyebrow" muted>
            {t('today.yourFlow')}
          </Text>
          {PREVIEW.flow.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.flowRow,
                i > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth * 2,
                  borderTopColor: colors.border,
                },
              ]}
            >
              <Text
                variant="numeral"
                style={[styles.numeral, { color: colors.steps[i % colors.steps.length] }]}
                accessibilityLabel={t('today.step', { count: i + 1 })}
              >
                {i + 1}
              </Text>
              <View style={styles.flowText}>
                <Text variant="subheading">{t(`techniques.${item.id}`)}</Text>
                <Text variant="sanskrit" muted>
                  {item.iast}
                </Text>
              </View>
              <Text variant="caption" muted>
                {t('today.minutes', { count: item.minutes })}
              </Text>
            </View>
          ))}
        </FadeIn>

        <FadeIn index={6} style={styles.section}>
          <Text variant="eyebrow" muted>
            {t('today.thisWeek')}
          </Text>
          <View style={styles.week}>
            {weekdays.map((d, i) => {
              const done = PREVIEW.weekDone[i];
              const isToday = i === PREVIEW.todayIndex;
              return (
                <View key={i} style={styles.day}>
                  <View
                    style={[
                      styles.dayDot,
                      {
                        backgroundColor: done ? colors.done : 'transparent',
                        borderColor: isToday ? colors.accent : done ? colors.done : colors.border,
                      },
                    ]}
                  />
                  <Text variant="caption" muted={!isToday}>
                    {d}
                  </Text>
                </View>
              );
            })}
          </View>
        </FadeIn>

        <FadeIn index={7} style={styles.section}>
          <Text variant="eyebrow" muted>
            {t('today.focusingOn')}
          </Text>
          <View style={styles.chips}>
            {PREVIEW.states.map((s) => {
              const accent = stateAccents[s][scheme];
              return (
                <View key={s} style={[styles.chip, { backgroundColor: accent.soft }]}>
                  <View style={[styles.chipDot, { backgroundColor: accent.fill }]} />
                  <Text variant="caption">{t(`states.${s}`)}</Text>
                </View>
              );
            })}
          </View>
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
    gap: spacing.xxl,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flame: {
    width: 6,
    height: 9,
    borderRadius: 4,
    borderTopLeftRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  hero: { alignItems: 'center', paddingTop: spacing.lg },
  heroText: { alignItems: 'center', gap: spacing.sm, marginTop: -spacing.md },
  center: { textAlign: 'center' },
  beginWrap: { alignItems: 'center' },
  begin: {
    minHeight: minTouchTarget + 8,
    paddingHorizontal: spacing.huge,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { gap: spacing.md },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  numeral: { width: 24, textAlign: 'center' },
  flowText: { flex: 1, gap: 2 },
  week: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xs },
  day: { alignItems: 'center', gap: spacing.sm },
  dayDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.25 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
});
