import { useTranslation } from 'react-i18next';

import { Screen } from '@/design/components/Screen';
import { Text } from '@/design/components/Text';

export default function JourneyScreen() {
  const { t } = useTranslation();
  return (
    <Screen title={t('journey.title')}>
      <Text muted>{t('journey.placeholder')}</Text>
    </Screen>
  );
}
