import { useTranslation } from 'react-i18next';

import { Screen } from '@/design/components/Screen';
import { Text } from '@/design/components/Text';

export default function LearnScreen() {
  const { t } = useTranslation();
  return (
    <Screen title={t('learn.title')}>
      <Text muted>{t('learn.placeholder')}</Text>
    </Screen>
  );
}
