import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/design/theme';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      {/* Icons come with the design pass; labels only for now. */}
      <Tabs.Screen name="today" options={{ title: t('tabs.today') }} />
      <Tabs.Screen name="practice" options={{ title: t('tabs.practice') }} />
      <Tabs.Screen name="learn" options={{ title: t('tabs.learn') }} />
      <Tabs.Screen name="journey" options={{ title: t('tabs.journey') }} />
    </Tabs>
  );
}
