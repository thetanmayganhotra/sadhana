import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { TabIcon, type TabIconName } from '@/design/components/TabIcon';
import { useTheme } from '@/design/theme';
import { pigments } from '@/design/tokens';

const TABS: TabIconName[] = ['today', 'practice', 'learn', 'journey'];

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: scheme === 'dark' ? pigments.marigold : pigments.lapis,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 84,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      {TABS.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t(`tabs.${name}`),
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name={name} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
