import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TabIcon, type TabIconName } from '@/design/components/TabIcon';
import { useTheme } from '@/design/theme';
import { typography } from '@/design/tokens';

const TABS: TabIconName[] = ['today', 'practice', 'learn', 'journey'];

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: StyleSheet.hairlineWidth * 2,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 84,
          paddingTop: 10,
        },
        tabBarLabelStyle: { ...typography.eyebrow, fontSize: 10, letterSpacing: 1.6, marginTop: 4 },
      }}
    >
      {TABS.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t(`tabs.${name}`),
            tabBarIcon: ({ color }) => <TabIcon name={name} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
