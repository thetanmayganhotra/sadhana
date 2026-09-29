import { useTranslation } from 'react-i18next';

import { Screen } from '@/design/components/Screen';
import { Text } from '@/design/components/Text';

export default function PracticeScreen() {
  const { t } = useTranslation();
  return (
    <Screen eyebrow={t('practice.eyebrow')} title={t('practice.title')}>
      <Text muted>{t('practice.placeholder')}</Text>
    </Screen>
  );
}
