import { useAuth } from '../context/AuthContext';
import { getTranslations } from '../i18n';

export function useTranslation() {
  const { user } = useAuth();
  const language = user?.language || 'EN';
  const t = getTranslations(language);

  return { t, language };
}
