import { useTranslation } from 'react-i18next';

import { Screen } from '@/design/components/Screen';
import { Text } from '@/design/components/Text';

export default function TodayScreen() {
  const { t } = useTranslation();
  return (
    <Screen title={t('today.title')}>
      <Text muted>{t('today.placeholder')}</Text>
    </Screen>
  );
}
