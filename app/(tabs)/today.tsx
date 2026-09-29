import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ArchScene } from '@/design/components/ArchScene';
import { Text } from '@/design/components/Text';
import { useTheme } from '@/design/theme';
import { minTouchTarget, pigments, radii, spacing, stateAccents } from '@/design/tokens';
import type { StateId } from '@/content/types';

// DESIGN PREVIEW: static data until personalize() and the practice log land (Phases 3 and 5).
const PREVIEW = {
  states: ['racing_thoughts', 'cant_switch_off'] as StateId[],
  flow: [
    { id: 'sama_vritti', sanskrit: 'Sama Vṛtti', minutes: 3, state: 'racing_thoughts' as StateId },
    { id: 'bhramari', sanskrit: 'Bhrāmarī', minutes: 4, state: 'cant_switch_off' as StateId },
    { id: 'so_hum', sanskrit: "So'ham", minutes: 3, state: 'want_deeper_practice' as StateId },
  ] as const,
  streak: 3,
  weekDone: [true, true, true, false, false, false, false],
  todayIndex: 3,
};

export default function TodayScreen() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const totalMinutes = PREVIEW.flow.reduce((sum, f) => sum + f.minutes, 0);
  const doneColor = scheme === 'dark' ? pigments.sky : colors.hero;
  const weekdays = t('weekdays', { returnObjects: true }) as string[];

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text variant="label" muted>
              {t('today.greeting')}
            </Text>
            <Text variant="title" accessibilityRole="header">
              {t('today.title')}
            </Text>
          </View>
          <View style={[styles.streakPill, { backgroundColor: colors.surface }]}>
            <View style={styles.streakDot} />
            <Text variant="label">{t('today.streak', { count: PREVIEW.streak })}</Text>
          </View>
        </View>

        <View style={[styles.hero, { backgroundColor: colors.hero }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroText}>
              <Text variant="caption" style={[styles.eyebrow, { color: colors.onHeroMuted }]}>
                {t('today.heroLabel').toUpperCase()}
              </Text>
              <Text variant="heading" style={{ color: colors.onHero }}>
                {t('today.heroTitle')}
              </Text>
              <Text variant="label" style={{ color: colors.onHeroMuted }}>
                {t('today.heroMeta', { count: PREVIEW.flow.length, minutes: totalMinutes })}
              </Text>
            </View>
            <ArchScene width={104} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('today.begin')}
            style={({ pressed }) => [
              styles.begin,
              { backgroundColor: colors.primary, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text variant="subheading" style={{ color: colors.onPrimary, fontWeight: '700' }}>
              {t('today.begin')}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text variant="label" muted>
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
                        backgroundColor: done ? doneColor : 'transparent',
                        borderColor: isToday
                          ? pigments.marigold
                          : done
                            ? colors.hero
                            : colors.border,
                        borderWidth: isToday ? 3 : 2,
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
        </View>

        <Text variant="subheading">{t('today.yourFlow')}</Text>
        <View style={styles.flow}>
          {PREVIEW.flow.map((item, i) => {
            const accent = stateAccents[item.state][scheme];
            return (
              <View key={item.id} style={[styles.flowRow, { backgroundColor: colors.surface }]}>
                <View
                  style={[
                    styles.flowBadge,
                    { backgroundColor: accent.soft, borderColor: accent.fill },
                  ]}
                >
                  <Text variant="label" style={styles.flowNum}>
                    {i + 1}
                  </Text>
                </View>
                <View style={styles.flowText}>
                  <Text variant="label">{t(`techniques.${item.id}`)}</Text>
                  <Text variant="caption" muted>
                    {item.sanskrit}
                  </Text>
                </View>
                <Text variant="caption" muted>
                  {t('today.minutes', { count: item.minutes })}
                </Text>
              </View>
            );
          })}
        </View>

        <Text variant="subheading">{t('today.focusingOn')}</Text>
        <View style={styles.chips}>
          {PREVIEW.states.map((s) => {
            const accent = stateAccents[s][scheme];
            return (
              <View key={s} style={[styles.chip, { backgroundColor: accent.soft }]}>
                <View style={[styles.chipDot, { backgroundColor: accent.fill }]} />
                <Text variant="label">{t(`states.${s}`)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  streakDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: pigments.vermilion },
  hero: { borderRadius: radii.xl, padding: spacing.xl, gap: spacing.xl, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.lg },
  heroText: { flex: 1, gap: spacing.sm },
  eyebrow: { letterSpacing: 1.2, fontWeight: '700' },
  begin: {
    minHeight: minTouchTarget + 12,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { borderRadius: radii.lg, padding: spacing.lg, gap: spacing.md },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: spacing.xs },
  dayDot: { width: 28, height: 28, borderRadius: 14 },
  flow: { gap: spacing.sm },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  flowBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowNum: { fontWeight: '700' },
  flowText: { flex: 1, gap: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  chipDot: { width: 10, height: 10, borderRadius: 5 },
});
