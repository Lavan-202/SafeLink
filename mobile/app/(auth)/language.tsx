import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../providers/LanguageProvider';
import { APP_LANGUAGES, type AppLanguage } from '../../types/language';

export default function LanguageScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<AppLanguage>(language);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fromProfile = from === 'profile';

  async function onContinue() {
    setLoading(true);
    setError('');
    try {
      await setLanguage(selected);
      if (fromProfile) {
        router.back();
        return;
      }
      router.replace(user ? '/(tabs)' : '/(auth)/login');
    } catch {
      setError(t('language.saveError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <PageTitle
        eyebrow={fromProfile ? t('language.eyebrowAccount') : t('language.eyebrowSetup')}
        title={t('language.title')}
        subtitle={t('language.subtitle')}
      />
      <View style={styles.list}>
        {APP_LANGUAGES.map((id) => {
          const active = selected === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(id)}
              style={[styles.option, active && styles.optionOn]}
            >
              <Text style={styles.label}>
                {emoji[id]}  {t(`languages.${id}`)}
              </Text>
              <View style={[styles.radio, active && styles.radioOn]}>{active ? <View style={styles.dot} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={t('common.continue')} onPress={onContinue} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 8,
  },
  option: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionOn: {
    backgroundColor: colors.selected,
    borderColor: '#D5DEEC',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D5DCE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  error: {
    color: colors.sos,
  },
});
